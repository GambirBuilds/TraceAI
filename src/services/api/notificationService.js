/**
 * TraceAI Notification Service
 * Connects to /api/v1/notifications for database-backed notification center.
 */

import apiClient from './apiClient';

export const notificationService = {
  async getNotifications(limit = 20, unreadOnly = false) {
    return apiClient.get(`/notifications?limit=${limit}&unreadOnly=${unreadOnly}`);
  },

  async getUnreadCount() {
    return apiClient.get('/notifications/unread-count');
  },

  async markAsRead(id) {
    return apiClient.post(`/notifications/${encodeURIComponent(id)}/read`);
  },

  async markAllAsRead() {
    return apiClient.post('/notifications/mark-all-read');
  },

  async deleteNotification(id) {
    return apiClient.delete(`/notifications/${encodeURIComponent(id)}`);
  }
};

export default notificationService;
