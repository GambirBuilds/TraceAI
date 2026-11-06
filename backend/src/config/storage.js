/**
 * TraceAI Storage Configuration
 * Directs uploads to S3-compatible bucket or local disk isolation directory.
 */

import fs from 'fs';
import path from 'path';
import config from './environment.js';
import logger from '../utils/logger.js';

export const storageConfig = {
  isS3Configured: Boolean(config.storage.endpoint && config.storage.accessKey),
  localDirectory: config.storage.localUploadDir
};

// Ensure local upload directory exists
try {
  if (!fs.existsSync(storageConfig.localDirectory)) {
    fs.mkdirSync(storageConfig.localDirectory, { recursive: true });
    logger.info('Created local upload vault directory', { path: storageConfig.localDirectory });
  }
} catch (err) {
  logger.warn('Could not initialize upload vault directory', { error: err.message });
}
