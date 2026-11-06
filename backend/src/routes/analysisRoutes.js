/**
 * TraceAI Analyses & History Routes
 */

import { Router } from 'express';
import analysisController from '../controllers/analysisController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, analysisController.listAnalyses);
router.get('/:id/breakdown', authenticate, analysisController.getAnalysisBreakdown);
router.get('/:id', authenticate, analysisController.getAnalysisById);
router.delete('/:id', authenticate, analysisController.deleteAnalysis);

export default router;
