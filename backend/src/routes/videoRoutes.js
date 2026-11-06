/**
 * TraceAI Video Analysis Routes
 */

import { Router } from 'express';
import videoController from '../controllers/videoController.js';
import authenticate from '../middleware/authenticate.js';
import { uploadVideo } from '../middleware/uploadValidation.js';

const router = Router();

router.post('/', authenticate, uploadVideo, videoController.analyze);

export default router;
