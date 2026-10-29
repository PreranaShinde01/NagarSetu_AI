/**
 * NAGARSETU CENTRALIZED ERROR HANDLING MIDDLEWARE
 */

export class ApiError extends Error {
  constructor(statusCode, message, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 503 ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR');
  const message = err.message || 'An unexpected internal governance platform error occurred.';
  
  const response = {
    success: false,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
    requestId: req.requestId || undefined,
  };

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(`[EXPRESS ERROR LOG] ${req.method} ${req.originalUrl}:`, err.stack);
  }

  res.status(statusCode).json(response);
}
