/**
 * TraceAI Backend Structured Logger
 * Emits ISO timestamped structured logs with log levels and redaction for sensitive media contents.
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function formatMessage(level, message, meta = {}) {
  // Redact potentially sensitive content or credentials
  const sanitizedMeta = { ...meta };
  if (sanitizedMeta.password) sanitizedMeta.password = '[REDACTED]';
  if (sanitizedMeta.token) sanitizedMeta.token = '[REDACTED]';
  if (sanitizedMeta.text && typeof sanitizedMeta.text === 'string' && sanitizedMeta.text.length > 50) {
    sanitizedMeta.text = `${sanitizedMeta.text.substring(0, 50)}... [truncated length: ${sanitizedMeta.text.length}]`;
  }

  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    service: 'traceai-backend',
    message,
    ...(Object.keys(sanitizedMeta).length > 0 ? { meta: sanitizedMeta } : {})
  });
}

export const logger = {
  error(msg, meta) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.error) {
      console.error(formatMessage('error', msg, meta));
    }
  },
  warn(msg, meta) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', msg, meta));
    }
  },
  info(msg, meta) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.info) {
      console.log(formatMessage('info', msg, meta));
    }
  },
  debug(msg, meta) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.debug) {
      console.log(formatMessage('debug', msg, meta));
    }
  }
};

export default logger;
