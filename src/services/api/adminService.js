/**
 * TraceAI Admin & Evaluation Service
 * Connects to /api/v1/admin endpoints for RBAC admin console & empirical benchmarks.
 */

import apiClient from './apiClient';

export const adminService = {
  async getOverview() {
    return apiClient.get('/admin/overview');
  },

  async getUsers() {
    return apiClient.get('/admin/users');
  },

  async updateUserRole(userId, role, tier) {
    return apiClient.put(`/admin/users/${encodeURIComponent(userId)}/role`, { role, tier });
  },

  async getAuditLogs(limit = 50, offset = 0, action = '') {
    const q = action ? `&action=${encodeURIComponent(action)}` : '';
    return apiClient.get(`/admin/audit-logs?limit=${limit}&offset=${offset}${q}`);
  },

  async getJobStatus() {
    return apiClient.get('/admin/jobs');
  },

  async getEvaluations() {
    return apiClient.get('/admin/evaluations');
  }
};

export default adminService;
