/**
 * TraceAI Analytics Service
 * Connects to /api/v1/analytics endpoints backed by real database records.
 */

import apiClient from './apiClient';

export const analyticsService = {
  async getOverview(range = '30d') {
    return apiClient.get(`/analytics/overview?range=${encodeURIComponent(range)}`);
  },

  async getProviderStatus() {
    return apiClient.get('/analytics/provider-status');
  }
};

export default analyticsService;
