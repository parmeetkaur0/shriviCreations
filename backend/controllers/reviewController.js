import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: stats[0]?.avgRating || 0,
    ratingsCount: stats[0]?.count || 0,
  });
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort('-createdAt');
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Create a review
// @route   POST /api/reviews/product/:productId
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment, orderId } = req.body;
  const productId = req.params.productId;

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  let isVerifiedPurchase = false;
  if (orderId) {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'delivered',
    });
    if (order) isVerifiedPurchase = true;
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, 'shrivi-creations/reviews');
      images.push({ url: result.url, public_id: result.public_id });
    }
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    order: orderId,
    rating,
    title,
    comment,
    images,
    isVerifiedPurchase,
  });

  await recalculateProductRating(productId);
  const populated = await review.populate('user', 'name avatar');

  res.status(201).json({ success: true, review: populated });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  review.rating = req.body.rating ?? review.rating;
  review.title = req.body.title ?? review.title;
  review.comment = req.body.comment ?? review.comment;
  await review.save();

  await recalculateProductRating(review.product);
  res.status(200).json({ success: true, review });
});

// @desc    Delete review (own or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  res.status(200).json({ success: true, message: 'Review deleted' });
});

// @desc    Admin reply to review
// @route   PUT /api/reviews/:id/reply
// @access  Private/Admin
export const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  review.adminReply = req.body.reply;
  await review.save();
  res.status(200).json({ success: true, review });
});
