import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Validate Cloudinary environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️  Cloudinary credentials are missing! Image uploads will fail.');
    console.warn('Missing:', {
        cloud_name: !cloudName,
        api_key: !apiKey,
        api_secret: !apiSecret
    });
} else {
    console.log('✅ Cloudinary configured successfully');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

/**
 * Upload image to Cloudinary
 * @param file - Multer file object
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with uploaded image URL
 */
export const uploadToCloudinary = async (
    file: Express.Multer.File,
    folder: string = 'plinko-uploads'
): Promise<string> => {
    // Validate environment variables
    if (!cloudName || !apiKey || !apiSecret) {
        const missing = [];
        if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
        if (!apiKey) missing.push('CLOUDINARY_API_KEY');
        if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
        throw new Error(`Cloudinary credentials missing: ${missing.join(', ')}. Please set these environment variables.`);
    }

    // Validate file object
    if (!file) {
        throw new Error('No file provided for upload');
    }

    // Validate file buffer
    if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty or undefined. Make sure multer is configured with memory storage.');
    }

    // Validate file size (10MB limit for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.buffer.length > maxSize) {
        throw new Error(`File size (${(file.buffer.length / 1024 / 1024).toFixed(2)}MB) exceeds Cloudinary's 10MB limit`);
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (file.mimetype && !allowedMimes.includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimes.join(', ')}`);
    }

    return new Promise((resolve, reject) => {
        try {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 1920, height: 1080, crop: 'limit' }, // Max size
                        { quality: 'auto' }, // Auto optimize quality
                        { fetch_format: 'auto' } // Auto format (webp when supported)
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary upload error:', {
                            message: error.message,
                            http_code: error.http_code,
                            name: error.name
                        });
                        
                        // Provide more specific error messages
                        let errorMessage = 'Failed to upload image to Cloudinary';
                        if (error.http_code === 401) {
                            errorMessage = 'Cloudinary authentication failed. Please check your API credentials.';
                        } else if (error.http_code === 400) {
                            errorMessage = `Invalid request to Cloudinary: ${error.message}`;
                        } else if (error.message) {
                            errorMessage = `Cloudinary error: ${error.message}`;
                        }
                        
                        reject(new Error(errorMessage));
                    } else if (result) {
                        console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
                        resolve(result.secure_url);
                    } else {
                        reject(new Error('Upload failed: No result from Cloudinary'));
                    }
                }
            );

            // Handle stream errors
            uploadStream.on('error', (streamError) => {
                console.error('❌ Upload stream error:', streamError);
                reject(new Error(`Upload stream error: ${streamError.message}`));
            });

            // Convert buffer to stream
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            
            bufferStream.pipe(uploadStream);
        } catch (error: any) {
            console.error('❌ Error setting up upload stream:', error);
            reject(new Error(`Failed to set up upload: ${error.message}`));
        }
    });
};

/**
 * Delete image from Cloudinary
 * @param imageUrl - Full Cloudinary URL or public_id
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        // Extract public_id from URL
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log('Image deleted from Cloudinary:', publicId);
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        // Don't throw - deletion failure shouldn't break the app
    }
};

/**
 * Extract public_id from Cloudinary URL
 */
const extractPublicId = (url: string): string | null => {
    try {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

export default cloudinary;

