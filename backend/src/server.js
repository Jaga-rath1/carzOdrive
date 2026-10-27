const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const { validateEnv, env } = require('./config/env');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
const app = require('./app');

validateEnv();

let server;

async function start() {
  await connectDB();

  // Verify email transport
  const { verifyMailer } = require('./utils/mailer');
  verifyMailer()
    .then((status) => {
      if (status.configured) {
        logger.success('✓ Nodemailer Email Service verified: Ready to dispatch OTPs and invoices');
      } else {
        logger.warn(`⚠️ Nodemailer Service warning: ${status.message || status.error}`);
      }
    })
    .catch((err) => {
      logger.warn(`⚠️ Nodemailer verification handshake error: ${err.message}`);
    });

  server = app.listen(env.port, '0.0.0.0', () => {
    logger.success(`CarzoDrive Production Server listening on http://127.0.0.1:${env.port} [Environment: ${env.nodeEnv}]`);
  });
}

async function shutdown(signal) {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed. Terminating database connections...');
      try {
        await mongoose.connection.close(false);
        logger.success('MongoDB connection cleanly closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcefully terminating process.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Fatal Uncaught Exception:', err);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  shutdown('unhandledRejection');
});

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
