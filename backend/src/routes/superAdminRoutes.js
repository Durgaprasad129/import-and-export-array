import { Router } from 'express';
import {
  assignFranchiseAdmin,
  createFranchise,
  health,
  listFranchises,
  overrideOrder
} from '../controllers/superAdminController.js';
import { requireRole } from '../middleware/role.js';

const router = Router();
router.use(requireRole('super_admin'));
router.get('/franchises', listFranchises);
router.post('/franchises', createFranchise);
router.patch('/franchise-admin/assign', assignFranchiseAdmin);
router.patch('/orders/override', overrideOrder);
router.get('/health', health);

export default router;
