/**
 * Test Cloudinary Configuration
 * 
 * This script tests if your Cloudinary credentials are working correctly.
 * Run: node scripts/test-cloudinary.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { v2: cloudinary } = require('cloudinary');

console.log('🧪 Testing Cloudinary Configuration...\n');

// Check environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Environment Variables:');
console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set (hidden)' : '❌ Missing');
console.log('');

if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Missing Cloudinary credentials!');
    console.error('Please set all three environment variables:');
    console.error('  - CLOUDINARY_CLOUD_NAME');
    console.error('  - CLOUDINARY_API_KEY');
    console.error('  - CLOUDINARY_API_SECRET');
    process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

// Test API connection
async function testCloudinary() {
    try {
        console.log('Testing API connection...');
        
        // Test by listing resources (this will fail if credentials are wrong)
        const result = await cloudinary.api.ping();
        
        console.log('✅ Cloudinary API connection successful!');
        console.log('   Status:', result.status);
        console.log('');
        
        // Test uploading a small test image
        console.log('Testing image upload...');
        const uploadResult = await cloudinary.uploader.upload(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            {
                folder: 'plinko-test',
                resource_type: 'image',
                public_id: 'test-image-' + Date.now()
            }
        );
        
        console.log('✅ Image upload successful!');
        console.log('   URL:', uploadResult.secure_url);
        console.log('');
        
        // Clean up test image
        console.log('Cleaning up test image...');
        await cloudinary.uploader.destroy(uploadResult.public_id);
        console.log('✅ Test image deleted');
        console.log('');
        
        console.log('✅✅✅ All tests passed! Your Cloudinary configuration is working correctly.');
        console.log('');
        console.log('Next steps:');
        console.log('  1. Make sure these environment variables are set in your production environment (Render, etc.)');
        console.log('  2. Restart your backend server');
        console.log('  3. Try uploading an image through your admin panel');
        
    } catch (error) {
        console.error('❌ Cloudinary test failed!');
        console.error('');
        console.error('Error details:');
        console.error('  Message:', error.message);
        
        if (error.http_code === 401) {
            console.error('');
            console.error('🔴 Authentication Error:');
            console.error('   Your API credentials are incorrect or invalid.');
            console.error('   Please check:');
            console.error('   - CLOUDINARY_CLOUD_NAME is correct');
            console.error('   - CLOUDINARY_API_KEY is correct');
            console.error('   - CLOUDINARY_API_SECRET is correct');
            console.error('   - No extra spaces or quotes in the values');
        } else if (error.http_code === 400) {
            console.error('');
            console.error('🔴 Bad Request:');
            console.error('   The request to Cloudinary was invalid.');
            console.error('   Details:', error.message);
        } else {
            console.error('  HTTP Code:', error.http_code);
            console.error('  Full error:', error);
        }
        
        process.exit(1);
    }
}

testCloudinary();

