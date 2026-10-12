require('dotenv').config();
const { validateEnv, env } = require('./config/env');
const { connectDB } = require('./config/database');
const app = require('./app');

validateEnv();

let server;

async function start() {
  await connectDB();
  server = app.listen(env.port, () => {
    console.log(`CarzoDrive API running on port ${env.port} [${env.nodeEnv}]`);
  });
}

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown('unhandledRejection');
});

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = { app };
