/**
 * TraceAI Analytics Routes
 */

import { Router } from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/overview', authenticate, analyticsController.getOverview);

export default router;
