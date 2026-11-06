/**
 * TraceAI In-Memory Rate Limiting Middleware
 */

import config from '../config/environment.js';
import { RateLimitError } from '../utils/errors.js';

const requestCounts = new Map();

// Periodic cleanup of expired rate limit windows
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.startTime > config.rateLimit.windowMs) {
      requestCounts.delete(key);
    }
  }
}, 60000).unref();

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown-client';
  const now = Date.now();

  const record = requestCounts.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > config.rateLimit.windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count += 1;
  }

  requestCounts.set(ip, record);

  if (record.count > config.rateLimit.maxRequests) {
    return next(new RateLimitError(`Rate limit exceeded (${config.rateLimit.maxRequests} req / 15 min). Please retry shortly.`));
  }

  res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimit.maxRequests - record.count));
  next();
}

export default rateLimiter;
