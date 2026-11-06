/**
 * TraceAI Notification Routes
 */

import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.listNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
