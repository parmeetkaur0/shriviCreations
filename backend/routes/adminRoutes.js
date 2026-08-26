import express from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);
router.get('/dashboard', getDashboardStats);
router.get('/reports/sales', getSalesReport);

export default router;
