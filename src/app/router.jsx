/**
 * TraceAI Router Configuration
 * Declares all application routes using React Router DOM.
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

// Lazy-loaded route components for performance
const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const TextDetectorPage = lazy(() => import('../features/text-detection/pages/TextDetectorPage'));
const ImageDetectorPage = lazy(() => import('../features/image-detection/pages/ImageDetectorPage'));
const AudioDetectorPage = lazy(() => import('../features/audio-detection/pages/AudioDetectorPage'));
const VideoDetectorPage = lazy(() => import('../features/video-detection/pages/VideoDetectorPage'));
const HistoryPage = lazy(() => import('../features/history/pages/HistoryPage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage'));
const EvaluationPage = lazy(() => import('../features/evaluation/pages/EvaluationPage'));
const PrivacyPolicyPage = lazy(() => import('../features/legal/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../features/legal/pages/TermsPage'));
const DataGovernancePage = lazy(() => import('../features/legal/pages/DataGovernancePage'));
const NotFoundPage = lazy(() => import('../features/error/NotFoundPage'));

function SuspenseFallback() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <div className="h-8 bg-slate-200/80 animate-pulse rounded-md w-1/4 mb-6" />
      <LoadingSkeleton count={6} className="h-12 w-full" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LandingPage />
      </Suspense>
    )
  },
  {
    path: '/privacy',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <PrivacyPolicyPage />
      </Suspense>
    )
  },
  {
    path: '/terms',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <TermsPage />
      </Suspense>
    )
  },
  {
    path: '/data-governance',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <DataGovernancePage />
      </Suspense>
    )
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <DashboardPage />
          </Suspense>
        )
      },
      {
        path: 'text',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <TextDetectorPage />
          </Suspense>
        )
      },
      {
        path: 'image',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ImageDetectorPage />
          </Suspense>
        )
      },
      {
        path: 'audio',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AudioDetectorPage />
          </Suspense>
        )
      },
      {
        path: 'video',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <VideoDetectorPage />
          </Suspense>
        )
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <HistoryPage />
          </Suspense>
        )
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ReportsPage />
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <SettingsPage />
          </Suspense>
        )
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AdminPage />
          </Suspense>
        )
      },
      {
        path: 'evaluation',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <EvaluationPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <NotFoundPage />
      </Suspense>
    )
  }
]);

export default router;
