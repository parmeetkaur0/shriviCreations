import asyncHandler from 'express-async-handler';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import Banner from '../models/Banner.js';

// @desc    Upload a single generic image (e.g. for rich text content)
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/misc');
  res.status(200).json({ success: true, url: result.url, public_id: result.public_id });
});

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
export const getBanners = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const banners = await Banner.find(filter).sort('displayOrder');
  res.status(200).json({ success: true, banners });
});

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Banner image is required');
  }
  const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/banners');
  const banner = await Banner.create({
    ...req.body,
    image: { url: result.url, public_id: result.public_id },
  });
  res.status(201).json({ success: true, banner });
});

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  if (req.file) {
    if (banner.image?.public_id) await deleteFromCloudinary(banner.image.public_id);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/banners');
    banner.image = { url: result.url, public_id: result.public_id };
  }

  const updatable = ['title', 'subtitle', 'buttonText', 'buttonLink', 'isActive', 'displayOrder'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) banner[field] = req.body[field];
  });

  await banner.save();
  res.status(200).json({ success: true, banner });
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  if (banner.image?.public_id) await deleteFromCloudinary(banner.image.public_id);
  await banner.deleteOne();
  res.status(200).json({ success: true, message: 'Banner deleted' });
});
