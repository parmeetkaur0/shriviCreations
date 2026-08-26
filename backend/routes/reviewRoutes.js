import express from 'express';
import { getProductReviews, createReview, updateReview, deleteReview, replyToReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, upload.array('images', 3), createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/reply', protect, admin, replyToReview);

export default router;
