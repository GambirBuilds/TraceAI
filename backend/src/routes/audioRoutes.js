/**
 * TraceAI Audio Analysis Routes
 */

import { Router } from 'express';
import audioController from '../controllers/audioController.js';
import authenticate from '../middleware/authenticate.js';
import { uploadAudio } from '../middleware/uploadValidation.js';

const router = Router();

router.post('/', authenticate, uploadAudio, audioController.analyze);

export default router;
