/**
 * TraceAI Text Analysis Routes
 */

import { Router } from 'express';
import textController from '../controllers/textController.js';
import authenticate from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateRequest.js';
import { textAnalysisSchema } from '../validators/analysisValidator.js';

const router = Router();

router.post('/', authenticate, validateBody(textAnalysisSchema), textController.analyze);

export default router;
