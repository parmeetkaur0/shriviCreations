import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/:id', getOrderById);

// Admin
router.get('/', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

export default router;
