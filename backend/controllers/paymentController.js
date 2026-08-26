import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Cart from '../models/Cart.js';

const getRazorpayInstance = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// @desc    Create Razorpay order based on current cart total
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  let itemsPrice = 0;
  for (const item of cart.items) {
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    itemsPrice += price * item.quantity;
  }

  const shippingPrice = itemsPrice >= 999 ? 0 : 79;
  let discountAmount = Number(req.body.discountAmount) || 0;
  const totalPrice = Math.max(itemsPrice + shippingPrice - discountAmount, 1);

  const razorpay = getRazorpayInstance();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalPrice * 100), // paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });

  res.status(200).json({
    success: true,
    order: razorpayOrder,
    keyId: process.env.RAZORPAY_KEY_ID,
    amountBreakdown: { itemsPrice, shippingPrice, discountAmount, totalPrice },
  });
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed - signature mismatch');
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    paymentResult: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: 'success',
    },
  });
});
