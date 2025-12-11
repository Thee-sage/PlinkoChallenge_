/* 
 * Migration: upload existing local /uploads files to Cloudinary and update DB URLs.
 * 
 * Usage:
 *   1) Ensure env vars are set (MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
 *   2) Build the backend so dist/ is present: npm run build
 *   3) Run: node scripts/migrate-uploads-to-cloudinary.js
 *
 * Only ads with imageUrl starting with /uploads/ and casinos with logo starting with /uploads/ are processed.
 */
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import compiled models from dist (run `npm run build` first)
// These files register the models with mongoose when required
require('../dist/models/Casino');
require('../dist/models/Ad');

// Get the registered models
const Ad = mongoose.model('Ad');
const Casino = mongoose.model('Casino');

if (!Ad) {
  console.error('Ad model not found. Make sure you ran npm run build first.');
  process.exit(1);
}

if (!Casino) {
  console.error('Casino model not found. Make sure you ran npm run build first.');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary credentials in environment variables.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadsDir = path.join(__dirname, '../uploads');

const uploadFileToCloudinary = (filePath, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result.secure_url);
      }
    );
  });

async function migrateAds() {
  const ads = await Ad.find({ imageUrl: { $regex: '^/uploads/' } });
  let updated = 0;
  for (const ad of ads) {
    const filename = ad.imageUrl.replace('/uploads/', '');
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping ad ${ad._id} (${ad.title}): file not found ${filePath}`);
      continue;
    }
    try {
      const url = await uploadFileToCloudinary(filePath, 'plinko-ads');
      ad.imageUrl = url;
      await ad.save();
      updated += 1;
      console.log(`Updated ad ${ad._id} (${ad.title}) -> ${url}`);
    } catch (err) {
      console.error(`Failed to upload ad ${ad._id} (${ad.title}):`, err.message);
    }
  }
  console.log(`Ads updated: ${updated}/${ads.length}`);
}

async function migrateCasinos() {
  const casinos = await Casino.find({ logo: { $regex: '^/uploads/' } });
  let updated = 0;
  for (const casino of casinos) {
    const filename = casino.logo.replace('/uploads/', '');
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping casino ${casino._id} (${casino.name}): file not found ${filePath}`);
      continue;
    }
    try {
      const url = await uploadFileToCloudinary(filePath, 'plinko-casinos');
      casino.logo = url;
      await casino.save();
      updated += 1;
      console.log(`Updated casino ${casino._id} (${casino.name}) -> ${url}`);
    } catch (err) {
      console.error(`Failed to upload casino ${casino._id} (${casino.name}):`, err.message);
    }
  }
  console.log(`Casinos updated: ${updated}/${casinos.length}`);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
  });
  console.log('Connected to MongoDB');

  await migrateAds();
  await migrateCasinos();

  await mongoose.disconnect();
  console.log('Done. You can now deploy; image URLs now point to Cloudinary.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

