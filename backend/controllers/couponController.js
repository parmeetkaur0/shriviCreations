import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// @desc    Validate & calculate discount for a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;

  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    res.status(400);
    throw new Error('This coupon has expired or is not yet active');
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('This coupon has reached its usage limit');
  }

  if (coupon.usedBy.includes(req.user._id)) {
    res.status(400);
    throw new Error('You have already used this coupon');
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    res.status(400);
    throw new Error(`Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  } else {
    discount = coupon.discountValue;
  }

  res.status(200).json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discount: Math.round(discount),
  });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, count: coupons.length, coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});
