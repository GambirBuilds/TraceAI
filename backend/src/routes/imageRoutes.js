/**
 * TraceAI Image Analysis Routes
 */

import { Router } from 'express';
import imageController from '../controllers/imageController.js';
import authenticate from '../middleware/authenticate.js';
import { uploadImage } from '../middleware/uploadValidation.js';

const router = Router();

router.post('/', authenticate, uploadImage, imageController.analyze);

export default router;
