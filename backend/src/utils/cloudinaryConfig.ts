import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
    return new Promise((resolve, reject) => {
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
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else if (result) {
                    console.log('Image uploaded to Cloudinary:', result.secure_url);
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed: No result from Cloudinary'));
                }
            }
        );

        // Convert buffer to stream
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        
        bufferStream.pipe(uploadStream);
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

