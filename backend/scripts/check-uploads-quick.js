/**
 * Quick Check: Cloudinary Uploads
 * 
 * Quick script to see if files are being uploaded.
 * Run: node scripts/check-uploads-quick.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');

console.log('🔍 Quick Cloudinary Check\n');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const mongoUri = process.env.MONGODB_URI;

if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Missing Cloudinary credentials!');
    process.exit(1);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

async function quickCheck() {
    try {
        // First, verify connection
        console.log('📸 Connecting to Cloudinary...');
        const pingResult = await cloudinary.api.ping();
        if (pingResult.status === 'ok') {
            console.log('✅ Connected to Cloudinary\n');
        }

        // Check Cloudinary - Use resources API (works on free tier)
        console.log('📸 Fetching Cloudinary Files...');
        let allResources = [];
        
        // Check common folders
        const folders = ['plinko-ads', 'plinko-casinos', 'plinko-uploads', 'plinko-test'];
        
        for (const folder of folders) {
            try {
                const folderResult = await cloudinary.api.resources({
                    type: 'upload',
                    prefix: folder,
                    max_results: 50
                });
                if (folderResult.resources && folderResult.resources.length > 0) {
                    allResources = allResources.concat(folderResult.resources);
                    console.log(`   ✅ Found ${folderResult.resources.length} files in "${folder}"`);
                }
            } catch (err) {
                // Folder might not exist, skip it silently
                if (err.message && !err.message.includes('not found') && !err.message.includes('Invalid')) {
                    console.log(`   ⚠️  Error checking "${folder}": ${err.message}`);
                }
            }
        }

        // Also check root level (no prefix)
        try {
            const rootResult = await cloudinary.api.resources({
                type: 'upload',
                max_results: 50
            });
            if (rootResult.resources && rootResult.resources.length > 0) {
                // Filter out duplicates and only show root-level files (no folder)
                const existingUrls = new Set(allResources.map(r => r.secure_url));
                const rootFiles = rootResult.resources.filter(r => {
                    // Only include if not in a folder and not already in our list
                    return !r.folder && !existingUrls.has(r.secure_url);
                });
                if (rootFiles.length > 0) {
                    allResources = allResources.concat(rootFiles);
                    console.log(`   ✅ Found ${rootFiles.length} files in root`);
                }
            }
        } catch (err) {
            // Root check failed, but that's okay
            if (err.message && !err.message.includes('Invalid')) {
                console.log(`   ⚠️  Error checking root: ${err.message}`);
            }
        }

        // Sort by created date (newest first)
        allResources.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

        if (allResources.length > 0) {
            console.log(`\n   ✅ Total found: ${allResources.length} files\n`);
            
            allResources.slice(0, 5).forEach((resource, index) => {
                const folder = resource.folder || 'root';
                console.log(`   ${index + 1}. [${folder}] ${resource.public_id}`);
                console.log(`      ${resource.secure_url}`);
                const date = resource.created_at ? new Date(resource.created_at).toLocaleString() : 'Unknown';
                console.log(`      Created: ${date}\n`);
            });

            if (allResources.length > 5) {
                console.log(`   ... and ${allResources.length - 5} more files\n`);
            }
        } else {
            console.log('\n   ⚠️  No files found in Cloudinary');
            console.log('   💡 Try uploading an image through your admin panel.\n');
        }

        // Check Database (if MongoDB URI is available)
        if (mongoUri) {
            try {
                await mongoose.connect(mongoUri);
                console.log('📊 Database Check:');
                
                const adSchema = new mongoose.Schema({}, { strict: false, collection: 'ads' });
                const casinoSchema = new mongoose.Schema({}, { strict: false, collection: 'casinos' });
                const Ad = mongoose.model('Ad', adSchema);
                const Casino = mongoose.model('Casino', casinoSchema);

                const ads = await Ad.find({ imageUrl: { $regex: 'res.cloudinary.com' } });
                const casinos = await Casino.find({ logo: { $regex: 'res.cloudinary.com' } });

                console.log(`   Ads with Cloudinary URLs: ${ads.length}`);
                if (ads.length > 0) {
                    console.log(`   Latest ad: ${ads[ads.length - 1].imageUrl}`);
                }
                
                console.log(`   Casinos with Cloudinary URLs: ${casinos.length}`);
                if (casinos.length > 0) {
                    console.log(`   Latest casino: ${casinos[casinos.length - 1].logo}`);
                }

                await mongoose.disconnect();
            } catch (dbError) {
                console.log('   ⚠️  Could not check database:', dbError.message);
            }
        }

        console.log('\n✅ Check complete!');
        console.log('\n💡 Tip: Run "node scripts/list-cloudinary-uploads.js" for detailed information.');

    } catch (error) {
        console.error('\n❌ Error occurred!');
        console.error('   Error type:', error?.constructor?.name || typeof error);
        console.error('   Error message:', error?.message || 'No error message');
        console.error('   HTTP code:', error?.http_code || 'N/A');
        console.error('   Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        
        if (error?.http_code === 401) {
            console.error('\n   🔴 Authentication failed. Check your Cloudinary credentials.');
        } else if (error?.message?.includes('Invalid')) {
            console.error('\n   🔴 Invalid request. Check your Cloudinary configuration.');
        }
        
        process.exit(1);
    }
}

quickCheck();

