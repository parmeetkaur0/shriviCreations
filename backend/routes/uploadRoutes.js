import express from 'express';
import { uploadImage, getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;
