import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCouponToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart);
router.put('/coupon', applyCouponToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

export default router;
