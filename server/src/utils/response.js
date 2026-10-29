/**
 * STANDARDIZED NAGARSETU API RESPONSE FORMATTERS
 */

export function sendSuccess(res, data = {}, message = 'Operation completed successfully.', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'An error occurred.', details = null) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    requestId: res.req?.requestId || undefined,
  });
}
