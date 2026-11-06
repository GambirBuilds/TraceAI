/**
 * TraceAI Core API Client
 * Built on the native Fetch API with timeout handling, token authorization,
 * FormData upload handling, and error normalization.
 */

import { API_CONFIG } from './apiConfig';
import { ApiError, normalizeError } from './apiErrors';

class ApiClient {
  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeoutMs = config.timeoutMs;
    try {
      this.authToken = localStorage.getItem('traceai_token') || null;
    } catch {
      this.authToken = null;
    }
  }

  setAuthToken(token) {
    this.authToken = token;
    try {
      if (token) {
        localStorage.setItem('traceai_token', token);
      } else {
        localStorage.removeItem('traceai_token');
      }
    } catch {
      // Storage error
    }
  }

  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = { ...customHeaders };
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.authToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      timeout = this.timeoutMs,
      signal: externalSignal
    } = options;

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const requestHeaders = this.getHeaders(headers, isFormData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Merge external abort signal if provided
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {
          // If response is not JSON
        }
        const message = errorData?.message || `HTTP request failed with status ${response.status}`;
        throw new ApiError(message, response.status, errorData?.code || 'HTTP_ERROR', errorData);
      }

      const json = await response.json();
      return json && typeof json === 'object' && json.success !== undefined && json.data !== undefined 
        ? json.data 
        : json;
    } catch (err) {
      clearTimeout(timeoutId);
      throw normalizeError(err);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
