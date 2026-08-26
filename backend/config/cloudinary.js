import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PLACEHOLDER_VALUES = new Set(['your_cloud_name', 'your_api_key', 'your_api_secret', '']);

const isPlaceholder = (value) => typeof value === 'string' && PLACEHOLDER_VALUES.has(value.trim().toLowerCase());

const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return [cloudName, apiKey, apiSecret].every((value) => value && !isPlaceholder(value));
};

const cloudinaryEnabled = isCloudinaryConfigured();

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary credentials are not configured. Falling back to local uploads in the backend uploads folder.');
}

const detectImageExtension = (buffer) => {
  const signature = buffer.subarray(0, 4).toString('hex');
  if (signature.startsWith('ffd8ff')) return 'jpg';
  if (signature.startsWith('89504e47')) return 'png';
  if (signature.startsWith('52494646')) return 'webp';
  return 'jpg';
};

const saveLocalImage = async (buffer) => {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = detectImageExtension(buffer);
  const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${localId}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const url = `${baseUrl.replace(/\/$/, '')}/uploads/${fileName}`;

  return { url, public_id: fileName };
};

/**
 * Upload a buffer (from multer memoryStorage) to Cloudinary
 * @param {Buffer} buffer
 * @param {String} folder
 * @returns {Promise<{url: String, public_id: String}>}
 */
export const uploadBufferToCloudinary = async (buffer, folder = 'shrivi-creations') => {
  if (!cloudinaryEnabled) {
    return saveLocalImage(buffer);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => {
        if (result) {
          resolve({ url: result.secure_url, public_id: result.public_id });
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (public_id) => {
  if (!public_id || !cloudinaryEnabled) {
    if (public_id) {
      const filePath = path.resolve(process.cwd(), 'uploads', public_id);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        // ignore if file does not exist
      }
    }
    return;
  }

  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

export default cloudinary;
