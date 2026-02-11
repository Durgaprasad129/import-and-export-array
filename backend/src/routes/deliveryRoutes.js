import { Router } from 'express';
import {
  listAssignedOrders,
  setOnlineStatus,
  todaysEarnings,
  updateAssignedOrderStatus
} from '../controllers/deliveryController.js';
import { requireRole } from '../middleware/role.js';

const router = Router();
router.use(requireRole('delivery_partner'));
router.patch('/online-status', setOnlineStatus);
router.get('/orders/assigned', listAssignedOrders);
router.patch('/orders/status', updateAssignedOrderStatus);
router.get('/earnings/today', todaysEarnings);

export default router;
