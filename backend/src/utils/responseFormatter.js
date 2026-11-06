/**
 * TraceAI API Response Formatter
 */

export function successResponse(res, data, statusCode = 200, meta = null) {
  const payload = {
    success: true,
    data,
    ...(meta ? { meta } : {})
  };
  return res.status(statusCode).json(payload);
}

export function errorResponse(res, error, statusCode = 500) {
  const payload = {
    success: false,
    error: {
      message: error.message || 'An unexpected error occurred.',
      code: error.code || 'INTERNAL_ERROR',
      ...(error.details ? { details: error.details } : {})
    }
  };
  return res.status(error.statusCode || statusCode).json(payload);
}
