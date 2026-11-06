/**
 * TraceAI Report Routes
 */

import { Router } from 'express';
import reportController from '../controllers/reportController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, reportController.listReports);
router.get('/:id', authenticate, reportController.getReportById);
router.get('/:id/download', authenticate, reportController.downloadReport);

export default router;
