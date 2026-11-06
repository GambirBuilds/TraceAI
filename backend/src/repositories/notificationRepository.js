/**
 * TraceAI Notification Repository
 * Manages database-backed user and system notifications.
 */

import { memoryDb } from '../config/database.js';

export const notificationRepository = {
  async create({ userId = null, category, title, message, link = null }) {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const notification = {
      id,
      userId,
      category, // 'analysis_completed' | 'analysis_failed' | 'analysis_inconclusive' | 'report_generated' | 'security_alert' | 'provider_status'
      title,
      message,
      read: false,
      link,
      createdAt: new Date().toISOString()
    };

    memoryDb.notifications.set(id, notification);
    return notification;
  },

  async findManyByUser(userId = null, { unreadOnly = false, limit = 50 } = {}) {
    let list = Array.from(memoryDb.notifications.values());
    if (userId) {
      list = list.filter(n => n.userId === userId || n.userId === null);
    }
    if (unreadOnly) {
      list = list.filter(n => !n.read);
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, limit);
  },

  async countUnread(userId = null) {
    let list = Array.from(memoryDb.notifications.values());
    if (userId) {
      list = list.filter(n => (n.userId === userId || n.userId === null) && !n.read);
    } else {
      list = list.filter(n => !n.read);
    }
    return list.length;
  },

  async markAsRead(id) {
    const n = memoryDb.notifications.get(id);
    if (!n) return null;
    n.read = true;
    memoryDb.notifications.set(id, n);
    return n;
  },

  async markAllAsRead(userId = null) {
    for (const [id, n] of memoryDb.notifications.entries()) {
      if (!userId || n.userId === userId || n.userId === null) {
        n.read = true;
        memoryDb.notifications.set(id, n);
      }
    }
    return true;
  },

  async delete(id) {
    return memoryDb.notifications.delete(id);
  }
};

// Seed initial system notifications for current analyst
(() => {
  notificationRepository.create({
    userId: 'usr-analyst-441',
    category: 'provider_status',
    title: 'Provider Health Check Passed',
    message: 'Linguistic stylometry engine and binary C2PA manifest scanner active.',
    link: '/app/admin'
  });
  notificationRepository.create({
    userId: 'usr-analyst-441',
    category: 'security_alert',
    title: 'Session Authenticated',
    message: 'Senior analyst session verified with JWT authorization.',
    link: '/app/settings'
  });
})();

export default notificationRepository;
