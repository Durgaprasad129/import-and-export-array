import { Router } from 'express';
import {
  getProfile,
  listIncomingOrders,
  setOpenStatus,
  setOrderStatus,
  updateMenu,
  updateProfile
} from '../controllers/restaurantController.js';
import { requireRole } from '../middleware/role.js';

const router = Router();
router.use(requireRole('restaurant'));
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/open-status', setOpenStatus);
router.put('/menu', updateMenu);
router.get('/orders/incoming', listIncomingOrders);
router.patch('/orders/status', setOrderStatus);

export default router;
