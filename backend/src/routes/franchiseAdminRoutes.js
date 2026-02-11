import { Router } from 'express';
import {
  assignDeliveryPartner,
  cityOrders,
  createCoupon,
  reviewDeliveryPartner,
  reviewRestaurant,
  updateCityConfig
} from '../controllers/franchiseAdminController.js';
import { requireRole } from '../middleware/role.js';

const router = Router();
router.use(requireRole('franchise_admin'));
router.patch('/restaurants/review', reviewRestaurant);
router.patch('/delivery-partners/review', reviewDeliveryPartner);
router.get('/orders', cityOrders);
router.patch('/orders/assign-delivery', assignDeliveryPartner);
router.patch('/city-config', updateCityConfig);
router.post('/coupons', createCoupon);

export default router;
