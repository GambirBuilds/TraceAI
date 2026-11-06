/**
 * TraceAI Secure File Storage Service
 * Stores files to isolated disk vault with randomized UUID filenames, SHA256 integrity,
 * and secure deletion.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import config from '../../config/environment.js';
import { storageConfig } from '../../config/storage.js';
import { getBufferSha256 } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';

export const fileStorageService = {
  /**
   * Stores buffer securely and returns reference descriptor.
   */
  async storeFile(buffer, originalFilename, mimeType) {
    const ext = path.extname(originalFilename || '') || '.bin';
    const storageKey = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(storageConfig.localDirectory, storageKey);
    const sha256 = getBufferSha256(buffer);

    try {
      await fs.promises.writeFile(filePath, buffer);
      logger.info('File saved to storage vault', { storageKey, size: buffer.length, sha256 });

      return {
        storageKey,
        storagePath: filePath,
        sha256,
        size: buffer.length,
        mimeType
      };
    } catch (err) {
      logger.error('Failed to write file to storage vault', { error: err.message });
      throw err;
    }
  },

  /**
   * Reads stored file by storageKey.
   */
  async getFile(storageKey) {
    const safeKey = path.basename(storageKey);
    const filePath = path.join(storageConfig.localDirectory, safeKey);
    if (!fs.existsSync(filePath)) return null;
    return fs.promises.readFile(filePath);
  },

  /**
   * Securely deletes stored file.
   */
  async deleteFile(storageKey) {
    if (!storageKey) return false;
    const safeKey = path.basename(storageKey);
    const filePath = path.join(storageConfig.localDirectory, safeKey);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.info('File securely purged from storage vault', { storageKey });
      }
      return true;
    } catch (err) {
      logger.warn('Failed to delete file from vault', { error: err.message });
      return false;
    }
  }
};

export default fileStorageService;
