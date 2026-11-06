/**
 * TraceAI useLocalPreferences Hook
 * Persists frontend application preferences to localStorage.
 */

import { useState, useEffect } from 'react';

const PREFS_KEY = 'traceai_preferences';

const DEFAULT_PREFERENCES = {
  defaultCategory: 'text',
  sensitivityLevel: 'standard', // 'standard', 'conservative', 'high'
  autoSaveToHistory: true,
  stripClientMetadataBeforeUpload: true,
  anonymousAnalysisMode: false,
  dataRetentionDays: 30, // 7, 30, or 0 (manual only)
  notificationsEnabled: true
};

export function useLocalPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // Storage error
    }
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return { preferences, updatePreference, resetPreferences };
}
