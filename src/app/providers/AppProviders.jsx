/**
 * TraceAI Application Providers
 * Combines Authentication, Theme, Notification contexts, and Global Error Boundary.
 */

import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
