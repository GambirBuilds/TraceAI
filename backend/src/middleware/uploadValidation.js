/**
 * TraceAI Multer File Upload Middleware
 * Stores uploads in memory buffer for immediate binary inspection, signature verification,
 * and secure S3/local streaming.
 */

import multer from 'multer';

// Use memory storage for fast in-buffer inspection & hashing
const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  }
}).single('image');

export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
}).single('audio');

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB
  }
}).single('video');
