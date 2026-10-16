/**
 * Request validation middleware
 */

import { ValidationError } from '../errors/AppError.js';

/**
 * Validate request body exists
 */
export function validateBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ValidationError('Request body is required');
  }
  next();
}

/**
 * Validate specific fields exist in request body
 */
export function validateFields(requiredFields) {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      throw new ValidationError(
        'Missing required fields',
        { missingFields: missing }
      );
    }
    
    next();
  };
}

/**
 * Wrap async route handlers to catch errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
