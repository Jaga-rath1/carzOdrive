/**
 * Production Structured Logger for CarzoDrive Platform
 */

const isProd = process.env.NODE_ENV === 'production';

const formatTimestamp = () => new Date().toISOString();

const logger = {
  info: (message, meta = '') => {
    console.log(`[${formatTimestamp()}] [INFO] ${message}`, meta ? (typeof meta === 'object' ? JSON.stringify(meta) : meta) : '');
  },

  success: (message, meta = '') => {
    console.log(`[${formatTimestamp()}] [SUCCESS] ✓ ${message}`, meta ? (typeof meta === 'object' ? JSON.stringify(meta) : meta) : '');
  },

  warn: (message, meta = '') => {
    console.warn(`[${formatTimestamp()}] [WARN] ⚠️ ${message}`, meta ? (typeof meta === 'object' ? JSON.stringify(meta) : meta) : '');
  },

  error: (message, error = null) => {
    console.error(
      `[${formatTimestamp()}] [ERROR] ✗ ${message}`,
      error?.stack ? (isProd ? error.message : error.stack) : (error || '')
    );
  },

  debug: (message, meta = '') => {
    if (!isProd) {
      console.debug(`[${formatTimestamp()}] [DEBUG] ${message}`, meta);
    }
  },
};

module.exports = logger;
