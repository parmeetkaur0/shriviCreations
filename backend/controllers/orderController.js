import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { sendEmail, orderConfirmationTemplate, orderStatusUpdateTemplate } from '../utils/sendEmail.js';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 79;

// @desc    Create new order (called after payment verified, or for COD)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode, paymentResult } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Validate stock & build order items
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product no longer available: ${product?.name || 'unknown'}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      variant: item.variant,
      price,
      quantity: item.quantity,
    });
  }

  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

  // Apply coupon if provided
  let discountAmount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (itemsPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      } else {
        discountAmount = coupon.discountValue;
      }
    }
  }

  const totalPrice = Math.max(itemsPrice + shippingPrice - discountAmount, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    shippingPrice,
    discountAmount,
    couponCode: coupon ? coupon.code : undefined,
    totalPrice,
    isPaid: paymentMethod === 'razorpay' && !!paymentResult,
    paidAt: paymentMethod === 'razorpay' && paymentResult ? new Date() : undefined,
    orderStatus: 'confirmed',
  });

  // Decrement stock, increment sold count
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  // Mark coupon as used
  if (coupon) {
    coupon.usedCount += 1;
    coupon.usedBy.push(req.user._id);
    await coupon.save();
  }

  // Clear cart
  cart.items = [];
  cart.couponCode = undefined;
  await cart.save();

  // Send confirmation email (non-blocking failure)
  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed - #${order.orderNumber}`,
      html: orderConfirmationTemplate(order, req.user),
    });
  } catch (err) {
    console.error('Order confirmation email failed:', err.message);
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.status(200).json({ success: true, order });
});

// @desc    Track order by order number (public-ish, requires login)
// @route   GET /api/orders/track/:orderNumber
// @access  Private
export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to track this order');
  }

  res.status(200).json({
    success: true,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    trackingHistory: order.trackingHistory,
    trackingNumber: order.trackingNumber,
    courierPartner: order.courierPartner,
    estimatedDelivery: order.estimatedDelivery,
  });
});

// @desc    Cancel order (owner, only if not shipped)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.trackingHistory.push({ status: 'cancelled', note: order.cancelReason });
  await order.save();

  // Restock items
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
  }

  res.status(200).json({ success: true, order });
});

// ---------- ADMIN ----------

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.keyword) filter.orderNumber = { $regex: req.query.keyword, $options: 'i' };

  const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit);
  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders,
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, trackingNumber, courierPartner, note, estimatedDelivery } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    order.trackingHistory.push({ status: orderStatus, note: note || '' });
    if (orderStatus === 'delivered') order.deliveredAt = new Date();
  }
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

  await order.save();

  try {
    await sendEmail({
      to: order.user.email,
      subject: `Order #${order.orderNumber} - Status Update`,
      html: orderStatusUpdateTemplate(order, order.user),
    });
  } catch (err) {
    console.error('Status update email failed:', err.message);
  }

  res.status(200).json({ success: true, order });
});
