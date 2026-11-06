/**
 * TraceAI Backend Standalone Server Entry Point
 */

import { createApp } from './app.js';
import config from './config/environment.js';
import { connectDatabase } from './config/database.js';
import logger from './utils/logger.js';

async function startServer() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info(`TraceAI Backend API server running on port ${config.port}`, {
      env: config.env,
      apiBase: `/api/v1`
    });
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down TraceAI backend server...');
    server.close(() => {
      logger.info('Server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  logger.error('Failed to start TraceAI backend server', { error: err.message });
  process.exit(1);
});
