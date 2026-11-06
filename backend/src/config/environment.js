/**
 * TraceAI Backend Environment Configuration
 * Safe validation and defaults for environment variables.
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'traceai_jwt_access_secret_dev_key_38f2a',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'traceai_jwt_refresh_secret_dev_key_99c1b',
    accessExpiresIn: '1h',
    refreshExpiresIn: '7d'
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://traceai:traceaipass@localhost:5432/traceai_db?schema=public'
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || null,
    bucket: process.env.STORAGE_BUCKET || 'traceai-media-vault',
    accessKey: process.env.STORAGE_ACCESS_KEY || null,
    secretKey: process.env.STORAGE_SECRET_KEY || null,
    localUploadDir: process.env.LOCAL_UPLOAD_DIR || '/tmp/traceai_uploads'
  },

  aiProviders: {
    text: process.env.TEXT_DETECTION_PROVIDER || 'huggingface', // 'huggingface' | 'openai' | 'sapling' | 'heuristic'
    image: process.env.IMAGE_DETECTION_PROVIDER || 'huggingface',
    audio: process.env.AUDIO_DETECTION_PROVIDER || 'huggingface',
    video: process.env.VIDEO_DETECTION_PROVIDER || 'huggingface',
    openaiApiKey: process.env.OPENAI_API_KEY || null,
    hfToken: process.env.HF_TOKEN || null
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
  }
};

export default config;
