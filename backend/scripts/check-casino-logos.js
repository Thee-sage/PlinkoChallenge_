/**
 * Check Casino Logo URLs
 * 
 * Script to check what logo URLs casinos currently have in the database.
 * Run: node scripts/check-casino-logos.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

console.log('🔍 Checking Casino Logo URLs\n');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('❌ Missing MONGODB_URI in environment variables!');
    process.exit(1);
}

async function checkCasinoLogos() {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        const casinoSchema = new mongoose.Schema({}, { strict: false, collection: 'casinos' });
        const Casino = mongoose.model('Casino', casinoSchema);

        const casinos = await Casino.find({}).select('name logo').lean();

        console.log(`📊 Found ${casinos.length} casinos in database\n`);

        if (casinos.length === 0) {
            console.log('⚠️  No casinos found in database.');
            await mongoose.disconnect();
            return;
        }

        // Categorize logos
        const cloudinaryLogos = [];
        const localPathLogos = [];
        const httpLogos = [];
        const otherLogos = [];

        casinos.forEach(casino => {
            const logo = casino.logo || '';
            
            if (logo.includes('res.cloudinary.com')) {
                cloudinaryLogos.push(casino);
            } else if (logo.startsWith('/uploads/') || logo.startsWith('uploads/')) {
                localPathLogos.push(casino);
            } else if (logo.startsWith('http://') || logo.startsWith('https://')) {
                httpLogos.push(casino);
            } else {
                otherLogos.push(casino);
            }
        });

        // Display results
        console.log('📸 Logo URL Analysis:');
        console.log(`   ✅ Cloudinary URLs: ${cloudinaryLogos.length}`);
        console.log(`   📁 Local paths (/uploads/): ${localPathLogos.length}`);
        console.log(`   🌐 Other HTTP URLs: ${httpLogos.length}`);
        console.log(`   ❓ Other/Unknown: ${otherLogos.length}\n`);

        if (cloudinaryLogos.length > 0) {
            console.log('✅ Casinos with Cloudinary URLs:');
            cloudinaryLogos.slice(0, 5).forEach(casino => {
                console.log(`   - ${casino.name}: ${casino.logo}`);
            });
            if (cloudinaryLogos.length > 5) {
                console.log(`   ... and ${cloudinaryLogos.length - 5} more\n`);
            } else {
                console.log('');
            }
        }

        if (localPathLogos.length > 0) {
            console.log('📁 Casinos with local paths (need migration):');
            localPathLogos.slice(0, 5).forEach(casino => {
                console.log(`   - ${casino.name}: ${casino.logo}`);
            });
            if (localPathLogos.length > 5) {
                console.log(`   ... and ${localPathLogos.length - 5} more\n`);
            } else {
                console.log('');
            }
        }

        if (httpLogos.length > 0) {
            console.log('🌐 Casinos with other HTTP URLs:');
            httpLogos.slice(0, 5).forEach(casino => {
                console.log(`   - ${casino.name}: ${casino.logo}`);
            });
            if (httpLogos.length > 5) {
                console.log(`   ... and ${httpLogos.length - 5} more\n`);
            } else {
                console.log('');
            }
        }

        if (otherLogos.length > 0) {
            console.log('❓ Casinos with other/unknown logo formats:');
            otherLogos.slice(0, 5).forEach(casino => {
                console.log(`   - ${casino.name}: ${casino.logo || '(empty)'}`);
            });
            if (otherLogos.length > 5) {
                console.log(`   ... and ${otherLogos.length - 5} more\n`);
            } else {
                console.log('');
            }
        }

        // Check Cloudinary for plinko-casinos folder
        const { v2: cloudinary } = require('cloudinary');
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });

            try {
                console.log('📸 Checking Cloudinary for "plinko-casinos" folder...');
                const cloudinaryResult = await cloudinary.api.resources({
                    type: 'upload',
                    prefix: 'plinko-casinos',
                    max_results: 50
                });
                
                if (cloudinaryResult.resources && cloudinaryResult.resources.length > 0) {
                    console.log(`   ✅ Found ${cloudinaryResult.resources.length} files in Cloudinary "plinko-casinos" folder\n`);
                } else {
                    console.log(`   ⚠️  No files found in Cloudinary "plinko-casinos" folder\n`);
                }
            } catch (err) {
                if (err.message && err.message.includes('not found')) {
                    console.log(`   ⚠️  "plinko-casinos" folder not found in Cloudinary\n`);
                } else {
                    console.log(`   ⚠️  Error checking Cloudinary: ${err.message}\n`);
                }
            }
        }

        console.log('✅ Check complete!');
        
        if (localPathLogos.length > 0) {
            console.log('\n💡 Tip: Run "node scripts/migrate-uploads-to-cloudinary.js" to migrate local logos to Cloudinary.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('\n❌ Error occurred!');
        console.error('   Error:', error.message);
        console.error('   Full error:', error);
        process.exit(1);
    }
}

checkCasinoLogos();
