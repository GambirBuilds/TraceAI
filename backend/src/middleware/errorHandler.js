/**
 * TraceAI Global Express Error Handler Middleware
 */

import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { errorResponse } from '../utils/responseFormatter.js';

export function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(err.message || 'Express request exception', {
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
    details: err.details || null
  });

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    return errorResponse(res, {
      message: `File upload error: ${err.message}`,
      code: 'UPLOAD_ERROR',
      statusCode: 400
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const formatted = err.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return errorResponse(res, {
      message: 'Request payload validation failed.',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: formatted
    });
  }

  // Handle known AppError instances
  if (err instanceof AppError) {
    return errorResponse(res, err, err.statusCode);
  }

  // Fallback for unhandled internal exceptions
  return errorResponse(res, {
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected internal error occurred.' 
      : err.message,
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  });
}

export default errorHandler;
