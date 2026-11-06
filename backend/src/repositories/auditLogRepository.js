/**
 * TraceAI Audit Log Repository
 * Records system and administrative actions for security tracking.
 */

import { memoryDb } from '../config/database.js';

export const auditLogRepository = {
  async log({ userId = null, action, resource = null, ipAddress = null, metadata = null }) {
    const id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const entry = {
      id,
      userId,
      action,
      resource,
      ipAddress,
      metadata,
      createdAt: new Date().toISOString()
    };
    memoryDb.auditLogs.set(id, entry);
    return entry;
  },

  async findMany({ limit = 100 } = {}) {
    const list = Array.from(memoryDb.auditLogs.values());
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, limit);
  }
};

export default auditLogRepository;
