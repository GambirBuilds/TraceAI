/**
 * TraceAI Admin Routes
 * Protected by role-based access control (senior_analyst and admin only).
 */

import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import authenticate, { requireRole } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin', 'senior_analyst'));

router.get('/overview', adminController.getOverview);
router.get('/users', adminController.listUsers);
router.put('/users/:id', adminController.updateUserRole);
router.get('/logs', adminController.listLogs);
router.get('/evaluations', adminController.getEvaluationDatasets);
router.get('/jobs', adminController.listJobs);

export default router;
