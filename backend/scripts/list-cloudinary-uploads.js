/**
 * List Cloudinary Uploads
 * 
 * This script shows all files uploaded to Cloudinary and compares with your database.
 * Run: node scripts/list-cloudinary-uploads.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');

console.log('📸 Checking Cloudinary Uploads...\n');

// Check environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const mongoUri = process.env.MONGODB_URI;

if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Missing Cloudinary credentials!');
    process.exit(1);
}

if (!mongoUri) {
    console.error('❌ Missing MONGODB_URI!');
    process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

// MongoDB Models (simplified)
const adSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    location: String
}, { collection: 'ads' });

const casinoSchema = new mongoose.Schema({
    name: String,
    logo: String
}, { collection: 'casinos' });

const Ad = mongoose.model('Ad', adSchema);
const Casino = mongoose.model('Casino', casinoSchema);

async function listCloudinaryUploads() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // List all resources from Cloudinary
        console.log('Fetching files from Cloudinary...');
        console.log('(This may take a moment if you have many files)\n');

        // Get all resources
        const folders = ['plinko-ads', 'plinko-casinos', 'plinko-uploads', 'plinko-test'];
        let allResources = [];

        for (const folder of folders) {
            try {
                const result = await cloudinary.search
                    .expression(`folder:${folder}`)
                    .sort_by([{ created_at: 'desc' }])
                    .max_results(500)
                    .execute();

                if (result.resources && result.resources.length > 0) {
                    console.log(`📁 Folder "${folder}": ${result.resources.length} files`);
                    allResources = allResources.concat(result.resources);
                }
            } catch (err) {
                // Folder might not exist, that's okay
                if (err.message && !err.message.includes('not found')) {
                    console.log(`⚠️  Error checking folder "${folder}": ${err.message}`);
                }
            }
        }

        // Also get root level files
        try {
            const rootResult = await cloudinary.search
                .expression('resource_type:image')
                .sort_by([{ created_at: 'desc' }])
                .max_results(500)
                .execute();

            if (rootResult.resources && rootResult.resources.length > 0) {
                console.log(`📁 Root folder: ${rootResult.resources.length} files`);
                // Filter out duplicates
                const existingUrls = new Set(allResources.map(r => r.secure_url));
                rootResult.resources.forEach(r => {
                    if (!existingUrls.has(r.secure_url)) {
                        allResources.push(r);
                    }
                });
            }
        } catch (err) {
            console.log(`⚠️  Error checking root folder: ${err.message}`);
        }

        console.log(`\n✅ Total files in Cloudinary: ${allResources.length}\n`);

        if (allResources.length === 0) {
            console.log('ℹ️  No files found in Cloudinary. You may need to upload some images first.');
            await mongoose.disconnect();
            return;
        }

        // Get files from database
        console.log('Checking database for Cloudinary URLs...');
        const ads = await Ad.find({ imageUrl: { $regex: 'res.cloudinary.com' } });
        const casinos = await Casino.find({ logo: { $regex: 'res.cloudinary.com' } });

        console.log(`\n📊 Summary:`);
        console.log(`   Cloudinary files: ${allResources.length}`);
        console.log(`   Ads with Cloudinary URLs: ${ads.length}`);
        console.log(`   Casinos with Cloudinary URLs: ${casinos.length}`);

        // Show files by folder
        console.log('\n📁 Files by Folder:');
        const byFolder = {};
        allResources.forEach(resource => {
            const folder = resource.folder || 'root';
            if (!byFolder[folder]) {
                byFolder[folder] = [];
            }
            byFolder[folder].push(resource);
        });

        Object.keys(byFolder).sort().forEach(folder => {
            console.log(`\n   ${folder}:`);
            byFolder[folder].forEach((resource, index) => {
                const sizeKB = (resource.bytes / 1024).toFixed(2);
                const date = new Date(resource.created_at).toLocaleDateString();
                console.log(`   ${index + 1}. ${resource.public_id}`);
                console.log(`      URL: ${resource.secure_url}`);
                console.log(`      Size: ${sizeKB} KB | Format: ${resource.format} | Created: ${date}`);
            });
        });

        // Check for orphaned files (in Cloudinary but not in DB)
        console.log('\n🔍 Checking for orphaned files...');
        const dbUrls = new Set();
        ads.forEach(ad => {
            if (ad.imageUrl) dbUrls.add(ad.imageUrl);
        });
        casinos.forEach(casino => {
            if (casino.logo) dbUrls.add(casino.logo);
        });

        const orphaned = allResources.filter(resource => !dbUrls.has(resource.secure_url));
        if (orphaned.length > 0) {
            console.log(`\n⚠️  Found ${orphaned.length} files in Cloudinary not referenced in database:`);
            orphaned.forEach((resource, index) => {
                console.log(`   ${index + 1}. ${resource.public_id}`);
                console.log(`      ${resource.secure_url}`);
            });
            console.log('\n💡 These files can be safely deleted if they\'re not needed.');
        } else {
            console.log('✅ All Cloudinary files are referenced in your database!');
        }

        // Check for missing files (in DB but not in Cloudinary)
        console.log('\n🔍 Checking for missing files...');
        const cloudinaryUrls = new Set(allResources.map(r => r.secure_url));
        const missingAds = ads.filter(ad => ad.imageUrl && !cloudinaryUrls.has(ad.imageUrl));
        const missingCasinos = casinos.filter(casino => casino.logo && !cloudinaryUrls.has(casino.logo));

        if (missingAds.length > 0 || missingCasinos.length > 0) {
            console.log(`\n⚠️  Found ${missingAds.length + missingCasinos.length} database entries pointing to missing Cloudinary files:`);
            missingAds.forEach(ad => {
                console.log(`   Ad: "${ad.title}"`);
                console.log(`      URL: ${ad.imageUrl}`);
            });
            missingCasinos.forEach(casino => {
                console.log(`   Casino: "${casino.name}"`);
                console.log(`      URL: ${casino.logo}`);
            });
        } else {
            console.log('✅ All database URLs point to existing Cloudinary files!');
        }

        // Storage usage
        const totalBytes = allResources.reduce((sum, r) => sum + (r.bytes || 0), 0);
        const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
        const totalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(2);
        
        console.log('\n💾 Storage Usage:');
        console.log(`   Total: ${totalMB} MB (${totalGB} GB)`);
        console.log(`   Free tier limit: 25 GB`);
        console.log(`   Usage: ${((totalBytes / 1024 / 1024 / 1024 / 25) * 100).toFixed(2)}% of free tier`);

        await mongoose.disconnect();
        console.log('\n✅ Done!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.http_code) {
            console.error(`   HTTP Code: ${error.http_code}`);
        }
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

listCloudinaryUploads();

