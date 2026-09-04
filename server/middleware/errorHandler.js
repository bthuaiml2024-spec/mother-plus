/**
 * Global API Error Handling Middleware
 */

export function errorHandler(err, req, res, next) {
  console.error('[API ERROR]', req.method, req.url, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
}
