/**
 * TraceAI API Error Normalization
 */

export class ApiError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function normalizeError(err) {
  if (err instanceof ApiError) {
    return err;
  }

  if (err.name === 'AbortError') {
    return new ApiError(
      'Analysis request timed out after 30 seconds. Please try again.',
      408,
      'REQUEST_TIMEOUT'
    );
  }

  if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
    return new ApiError(
      'Unable to connect to TraceAI detection service. Backend service is currently in preparation (Part 2 Integration Pending).',
      503,
      'SERVICE_UNAVAILABLE'
    );
  }

  return new ApiError(
    err.message || 'An unexpected error occurred during content evaluation.',
    err.status || 500,
    err.code || 'UNKNOWN_ERROR',
    err
  );
}
