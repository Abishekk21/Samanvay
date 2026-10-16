/**
 * Server entry point
 */

import app from './app.js';
import { PORT, validateEnv } from './config/env.js';

// Validate environment
validateEnv();

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🏹 Archeville Tournament Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default server;
