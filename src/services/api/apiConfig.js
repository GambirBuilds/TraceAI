/**
 * TraceAI API Configuration
 * Supports environment-configurable base URLs and Part 2 endpoint routing.
 */

export const API_CONFIG = {
  // Configured via VITE_API_BASE_URL or defaults to /api/v1
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeoutMs: 30000,
  endpoints: {
    analyzeText: '/analyze/text',
    analyzeImage: '/analyze/image',
    analyzeAudio: '/analyze/audio',
    analyzeVideo: '/analyze/video',
    analyses: '/analyses',
    analysisById: (id) => `/analyses/${encodeURIComponent(id)}`,
    analysisBreakdown: (id) => `/analyses/${encodeURIComponent(id)}/breakdown`,
    reports: '/reports',
    reportById: (id) => `/reports/${encodeURIComponent(id)}`
  }
};
