/**
 * TraceAI Auth Routes
 */

import { Router } from 'express';
import authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.put('/profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile);
router.delete('/account', authenticate, authController.deleteAccount);

export default router;
