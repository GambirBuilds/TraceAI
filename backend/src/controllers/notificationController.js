/**
 * TraceAI Notification Controller
 */

import notificationRepository from '../repositories/notificationRepository.js';
import { successResponse } from '../utils/responseFormatter.js';
import { NotFoundError } from '../utils/errors.js';

export const notificationController = {
  async listNotifications(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const { unreadOnly = false, limit = 50 } = req.query;
      const notifications = await notificationRepository.findManyByUser(userId, {
        unreadOnly: unreadOnly === 'true',
        limit: parseInt(limit, 10)
      });
      const unreadCount = await notificationRepository.countUnread(userId);

      return successResponse(res, notifications, 200, { unreadCount });
    } catch (err) {
      next(err);
    }
  },

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const count = await notificationRepository.countUnread(userId);
      return successResponse(res, { unreadCount: count });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationRepository.markAsRead(id);
      if (!notification) throw new NotFoundError('Notification not found.');
      return successResponse(res, notification);
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user?.id || null;
      await notificationRepository.markAllAsRead(userId);
      return successResponse(res, { message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  },

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      await notificationRepository.delete(id);
      return successResponse(res, { message: 'Notification removed.' });
    } catch (err) {
      next(err);
    }
  }
};

export default notificationController;
