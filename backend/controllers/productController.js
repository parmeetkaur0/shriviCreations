import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import APIFeatures from '../utils/apiFeatures.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all products with filter/search/sort/pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const normalizedQuery = { ...req.query };

  if (normalizedQuery.category && !mongoose.Types.ObjectId.isValid(normalizedQuery.category)) {
    const category = await Category.findOne({
      $or: [
        { slug: normalizedQuery.category, isActive: true },
        { name: normalizedQuery.category, isActive: true },
      ],
    }).select('_id');

    normalizedQuery.category = category ? category._id.toString() : null;
  }

  const baseQuery = Product.find({ isActive: true }).populate('category', 'name slug');

  const features = new APIFeatures(baseQuery, normalizedQuery)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  // total count respecting filters (excluding pagination)
  const countFeatures = new APIFeatures(Product.find({ isActive: true }), normalizedQuery)
    .search()
    .filter();
  const total = await countFeatures.query.countDocuments();

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    products,
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, product });
});

// @desc    Get related products (same category)
// @route   GET /api/products/:slug/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(8)
    .populate('category', 'name slug');

  res.status(200).json({ success: true, products: related });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).populate('category', 'name slug');
  res.status(200).json({ success: true, products });
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .sort('-soldCount')
    .limit(8)
    .populate('category', 'name slug');
  res.status(200).json({ success: true, products });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .sort('-createdAt')
    .limit(8)
    .populate('category', 'name slug');
  res.status(200).json({ success: true, products });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, 'shrivi-creations/products');
      if (result?.url && result?.public_id) {
        images.push({ url: result.url, public_id: result.public_id, alt: req.body.name });
      }
    }
  }

  let variants = [];
  if (req.body.variants) {
    try {
      variants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;
    } catch {
      res.status(400);
      throw new Error('Variants must be valid JSON');
    }
  }

  let materials = [];
  if (req.body.materials) {
    materials = typeof req.body.materials === 'string' ? req.body.materials.split(',').map((m) => m.trim()) : req.body.materials;
  }

  let tags = [];
  if (req.body.tags) {
    tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map((t) => t.trim()) : req.body.tags;
  }

  const productData = {
    ...req.body,
    images,
    variants,
    materials,
    tags,
  };

  // Empty optional values must not occupy unique sparse indexes.
  if (!productData.sku?.trim()) delete productData.sku;
  if (!productData.discountPrice) delete productData.discountPrice;

  const product = await Product.create(productData);

  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, 'shrivi-creations/products');
      if (result?.url && result?.public_id) {
        product.images.push({ url: result.url, public_id: result.public_id, alt: req.body.name || product.name });
      }
    }
  }

  const updatable = [
    'name', 'description', 'shortDescription', 'category', 'price', 'discountPrice',
    'stock', 'sku', 'care', 'dimensions', 'weight', 'isCustomizable', 'isFeatured',
    'isBestSeller', 'isNewArrival', 'isActive', 'lowStockThreshold',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  if (req.body.variants) {
    product.variants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;
  }
  if (req.body.materials) {
    product.materials = typeof req.body.materials === 'string' ? req.body.materials.split(',').map((m) => m.trim()) : req.body.materials;
  }
  if (req.body.tags) {
    product.tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map((t) => t.trim()) : req.body.tags;
  }

  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Delete a single product image (admin)
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const image = product.images.id(req.params.imageId);
  if (image) {
    await deleteFromCloudinary(image.public_id);
    product.images.pull(req.params.imageId);
    await product.save();
  }

  res.status(200).json({ success: true, images: product.images });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  for (const image of product.images) {
    await deleteFromCloudinary(image.public_id);
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Get all products for admin (including inactive)
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAdminProducts = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Product.find().populate('category', 'name'), req.query)
    .search()
    .filter()
    .sort()
    .paginate();
  const products = await features.query;
  const total = await Product.countDocuments();

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    products,
  });
});
