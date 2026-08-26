import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

// Admin (must precede /:slug)
router.get('/admin/all', protect, admin, getAdminProducts);
router.post('/', protect, admin, upload.array('images', 6), createProduct);
router.put('/:id', protect, admin, upload.array('images', 6), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);

// Public dynamic (last)
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

export default router;
