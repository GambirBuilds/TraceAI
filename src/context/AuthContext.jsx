/**
 * TraceAI Authentication Context
 * Manages user state, JWT access token, and login/logout synchronization with backend API.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api/apiClient';
import { API_CONFIG } from '../services/api/apiConfig';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr-analyst-441',
  name: 'Amir Karki',
  email: 'karkiamir15@gmail.com',
  role: 'Senior Content Forensics Analyst',
  avatarUrl: null,
  organization: 'TraceAI Intelligence Lab',
  plan: 'Enterprise Forensics',
  apiKeyPreview: 'tai_live_8f3a...b92c'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('traceai_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('traceai_user', JSON.stringify(user));
    } catch {
      // Storage error
    }
  }, [user]);

  // Sync with /api/v1/auth/me on mount if token is stored
  useEffect(() => {
    async function verifySession() {
      try {
        const response = await apiClient.get('/auth/me');
        if (response && response.user) {
          setUser(prev => ({ ...prev, ...response.user }));
          setIsAuthenticated(true);
        }
      } catch {
        // If unauthenticated, keep guest/default session
      }
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res && res.accessToken) {
      apiClient.setAuthToken(res.accessToken);
      if (res.user) {
        setUser(prev => ({ ...prev, ...res.user }));
        setIsAuthenticated(true);
      }
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
    apiClient.setAuthToken(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
    try {
      await apiClient.put('/auth/profile', updatedFields);
    } catch {
      // Fallback
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
