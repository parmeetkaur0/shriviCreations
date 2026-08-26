import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort('displayOrder name');

  await Promise.all(
    categories.map(async (category) => {
      if (!category.slug) {
        category.slug = slugify(category.name, { lower: true, strict: true });
        await category.save({ validateBeforeSave: false });
      }
    })
  );

  res.status(200).json({ success: true, count: categories.length, categories });
});

// @desc    Get single category by slug with product count
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const productCount = await Product.countDocuments({ category: category._id, isActive: true });
  res.status(200).json({ success: true, category, productCount });
});

// @desc    Create category (admin)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  let image = {};
  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/categories');
    if (result?.url && result?.public_id) {
      image = { url: result.url, public_id: result.public_id };
    }
  }

  const category = await Category.create({ ...req.body, image });
  res.status(201).json({ success: true, category });
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (req.file) {
    if (category.image?.public_id) await deleteFromCloudinary(category.image.public_id);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'shrivi-creations/categories');
    if (result?.url && result?.public_id) {
      category.image = { url: result.url, public_id: result.public_id };
    }
  }

  const updatable = ['name', 'description', 'isFeatured', 'isActive', 'displayOrder'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) category[field] = req.body[field];
  });

  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const productsUsingCategory = await Product.countDocuments({ category: category._id });
  if (productsUsingCategory > 0) {
    res.status(400);
    throw new Error('Cannot delete category with existing products. Reassign or remove products first.');
  }

  if (category.image?.public_id) await deleteFromCloudinary(category.image.public_id);
  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted' });
});
