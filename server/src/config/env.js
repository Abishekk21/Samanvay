/**
 * Environment configuration
 */

import { config } from 'dotenv';

// Load environment variables
config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// Validate required environment variables
export function validateEnv() {
  // No critical env vars required for localStorage version
  // This will be extended when database is added
  return true;
}
