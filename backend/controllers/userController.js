import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.file) {
    if (user.avatar?.public_id) await deleteFromCloudinary(user.avatar.public_id);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/avatars');
    user.avatar = { url: result.url, public_id: result.public_id };
  }

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.addressId);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.keyword) {
    filter.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { email: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).sort('-createdAt').skip(skip).limit(limit);
  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Get single user with order stats (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const orderCount = await Order.countDocuments({ user: user._id });
  const totalSpent = await Order.aggregate([
    { $match: { user: user._id, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  res.status(200).json({
    success: true,
    user,
    stats: { orderCount, totalSpent: totalSpent[0]?.total || 0 },
  });
});

// @desc    Update user role/status (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User removed' });
});
