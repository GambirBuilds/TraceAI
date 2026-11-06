/**
 * TraceAI History Service
 * Connects to backend API (/api/v1/analyses) with local cache fallback.
 */

import apiClient from '../api/apiClient';
import { API_CONFIG } from '../api/apiConfig';
import { DEMO_HISTORY_RECORDS } from '../../utils/sampleData';

const STORAGE_KEY = 'traceai_analysis_history';

class HistoryService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_HISTORY_RECORDS));
      }
    } catch {
      // LocalStorage fallback
    }
  }

  getLocalRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [...DEMO_HISTORY_RECORDS];
    } catch {
      return [...DEMO_HISTORY_RECORDS];
    }
  }

  async getAll() {
    try {
      // Fetch live records from backend API
      const remote = await apiClient.get(API_CONFIG.endpoints.analyses);
      if (Array.isArray(remote) && remote.length > 0) {
        // Merge with local records
        const local = this.getLocalRecords();
        const mergedMap = new Map();
        local.forEach(r => mergedMap.set(r.id, r));
        remote.forEach(r => mergedMap.set(r.id, r));
        const merged = Array.from(mergedMap.values());
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      }
      return this.getLocalRecords();
    } catch {
      return this.getLocalRecords();
    }
  }

  async getById(id) {
    try {
      const remote = await apiClient.get(API_CONFIG.endpoints.analysisById(id));
      if (remote) return remote;
    } catch {
      // Fallback to local
    }
    const local = this.getLocalRecords();
    return local.find(r => r.id === id) || null;
  }

  async save(record) {
    const records = this.getLocalRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...records];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...records];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return record;
  }

  async delete(id) {
    try {
      await apiClient.delete(API_CONFIG.endpoints.analysisById(id));
    } catch {
      // If offline
    }
    const records = this.getLocalRecords();
    const updated = records.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return true;
  }

  async clearAll() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
    return true;
  }

  resetToDemo() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_HISTORY_RECORDS));
    } catch {}
    return [...DEMO_HISTORY_RECORDS];
  }

  async query({
    search = '',
    contentType = 'all',
    status = 'all',
    sortBy = 'newest'
  } = {}) {
    let records = await this.getAll();

    // Content Type Filter
    if (contentType && contentType !== 'all') {
      records = records.filter(r => r.contentType === contentType);
    }

    // Status Filter
    if (status && status !== 'all') {
      records = records.filter(r => r.status === status);
    }

    // Search Query (title, id, fileName)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      records = records.filter(r => {
        const titleMatch = r.title?.toLowerCase().includes(q);
        const idMatch = r.id?.toLowerCase().includes(q);
        const fileMatch = r.originalFilename?.toLowerCase().includes(q) || r.fileName?.toLowerCase().includes(q);
        const labelMatch = r.assessmentLabel?.toLowerCase().includes(q) || r.assessment?.label?.toLowerCase().includes(q);
        return titleMatch || idMatch || fileMatch || labelMatch;
      });
    }

    // Sorting
    records.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA; // newest default
    });

    return records;
  }
}

export const historyService = new HistoryService();
export default historyService;
