/**
 * TraceAI Express Application Factory
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/environment.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import textRoutes from './routes/textRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analysisController from './controllers/analysisController.js';

export function createApp() {
  const app = express();

  // 1. Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Permit frontend script/styles in development
    crossOriginEmbedderPolicy: false
  }));

  // 2. CORS Handling
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // 3. Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. Rate Limiting for API routes
  app.use('/api/', rateLimiter);

  // 5. Mount API Routes (/api/v1/*)
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/analyze/text', textRoutes);
  app.use('/api/v1/analyze/image', imageRoutes);
  app.use('/api/v1/analyze/audio', audioRoutes);
  app.use('/api/v1/analyze/video', videoRoutes);
  app.use('/api/v1/analyses', analysisRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/notifications', notificationRoutes);

  // Background Job Routes
  app.get('/api/v1/jobs/:jobId', analysisController.getJobStatus);
  app.get('/api/v1/jobs/:jobId/status', analysisController.getJobStatus);
  app.delete('/api/v1/jobs/:jobId', analysisController.cancelJob);

  // System & Health Endpoints
  app.get('/api/v1/health', analysisController.health);
  app.get('/api/v1/providers/status', analysisController.getProvidersStatus);

  // 6. Global Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
