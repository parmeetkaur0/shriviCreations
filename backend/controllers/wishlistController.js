import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    select: 'name price discountPrice images stock isActive slug ratingsAverage ratingsCount',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.status(200).json({ success: true, wishlist });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

  if (!wishlist.products.includes(req.params.productId)) {
    wishlist.products.push(req.params.productId);
    await wishlist.save();
  }

  await wishlist.populate({ path: 'products', select: 'name price discountPrice images stock slug' });
  res.status(200).json({ success: true, wishlist });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
  await wishlist.save();
  await wishlist.populate({ path: 'products', select: 'name price discountPrice images stock slug' });
  res.status(200).json({ success: true, wishlist });
});
