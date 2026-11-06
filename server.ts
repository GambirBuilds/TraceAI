/**
 * TraceAI Full-Stack Development & Production Server Entry Point
 * Mounts Express API microservices (/api/v1/*) with Vite development middleware or static production dist.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './backend/src/app';
import { connectDatabase } from './backend/src/config/database';
import logger from './backend/src/utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startFullStackServer() {
  await connectDatabase();

  const app = createApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    logger.info('Vite development middlewares mounted on Express');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
    logger.info('Serving production static build from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`TraceAI Full-Stack Server active on port ${PORT}`, {
      apiUrl: `http://localhost:${PORT}/api/v1`,
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

startFullStackServer().catch((err) => {
  logger.error('Failed to launch TraceAI Full-Stack server', { error: err.message, stack: err.stack });
  process.exit(1);
});
