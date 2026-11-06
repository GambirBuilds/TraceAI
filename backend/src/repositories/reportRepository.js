/**
 * TraceAI Report Repository
 */

import { memoryDb } from '../config/database.js';

export const reportRepository = {
  async create({ id, userId = null, analysisId, reportFormat = 'json', storageReference = null }) {
    const reportId = id || `rep-${Date.now()}`;
    const report = {
      id: reportId,
      userId,
      analysisId,
      reportFormat,
      storageReference,
      createdAt: new Date().toISOString()
    };
    memoryDb.reports.set(reportId, report);
    return report;
  },

  async findById(id) {
    return memoryDb.reports.get(id) || null;
  },

  async findMany({ userId = null, limit = 50 } = {}) {
    let results = Array.from(memoryDb.reports.values());
    if (userId) {
      results = results.filter(r => r.userId === userId);
    }
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results.slice(0, limit);
  },

  async delete(id) {
    return memoryDb.reports.delete(id);
  }
};

export default reportRepository;
