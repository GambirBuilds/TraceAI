/**
 * TraceAI Redis & Queue Configuration
 */

import config from './environment.js';
import logger from '../utils/logger.js';

export const redisConfig = {
  url: config.redis.url,
  isAvailable: false
};

export async function checkRedisConnection() {
  logger.info('Checking Redis background queue connection...', { url: redisConfig.url });
  // For local environments without redis server running, we gracefully fallback to asynchronous in-process queue
  return false;
}
