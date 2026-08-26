import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Get dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, totalReviews] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Review.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed', 'processing'] } });

  const lowStockProducts = await Product.find({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } })
    .select('name stock lowStockThreshold images')
    .limit(10);

  const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(8);

  // Sales over last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const salesTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Product.find().sort('-soldCount').limit(5).select('name soldCount images price');

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalReviews,
      totalRevenue: revenueAgg[0]?.total || 0,
      pendingOrders,
    },
    lowStockProducts,
    recentOrders,
    salesTrend,
    topProducts,
  });
});

// @desc    Get detailed sales report within a date range
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const match = { isPaid: true };
  if (startDate && endDate) {
    match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const report = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
        itemsSold: { $sum: { $sum: '$items.quantity' } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totals = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' },
      },
    },
  ]);

  const categoryBreakdown = await Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { $unwind: '$productInfo' },
    {
      $lookup: {
        from: 'categories',
        localField: 'productInfo.category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        unitsSold: { $sum: '$items.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  res.status(200).json({
    success: true,
    report,
    totals: totals[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    categoryBreakdown,
  });
});
