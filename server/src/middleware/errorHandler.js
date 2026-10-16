/**
 * Centralized error handling middleware
 */

import { AppError } from '../errors/AppError.js';

export function errorHandler(err, req, res, next) {
  // Default to 500 server error
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details = null;
  
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }
  
  // Log error for debugging (in production, use proper logging)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      statusCode,
      code,
      message,
      details,
      stack: err.stack
    });
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  });
}

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
}
