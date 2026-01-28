import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// console.log('--- Initializing Cloudinary ---');
// console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
// console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');
// if (process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET.includes('*')) {
//     console.warn('WARNING: CLOUDINARY_API_SECRET appears to contain placeholder stars!');
// }

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
});

export default cloudinary;
