import { Router } from 'express';
import {
  addReview,
  listMyOrders,
  listRestaurants,
  placeOrder,
  reorderLastFive
} from '../controllers/customerController.js';
import { requireRole } from '../middleware/role.js';

const router = Router();
router.use(requireRole('customer'));
router.get('/restaurants', listRestaurants);
router.post('/orders', placeOrder);
router.get('/orders', listMyOrders);
router.get('/orders/reorder-last-five', reorderLastFive);
router.post('/reviews', addReview);

export default router;
