const dns = require('dns');

// On Windows / local networks, Node's c-ares DNS resolver frequently throws
// querySrv ECONNREFUSED for MongoDB Atlas mongodb+srv:// URIs using the default router DNS.
// Setting public DNS servers (Google 8.8.8.8, Cloudflare 1.1.1.1) fixes SRV resolution reliably.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Graceful fallback if custom DNS servers are restricted in the current runtime
}

const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('../utils/logger');

const options = {
  maxPoolSize: 50,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

// Dedicated Partner Database Connection for "Rent Your Car", "Rent Your Bike", and "Driver Registration"
// Uses useDb('carzodrive_partners', { useCache: true }) on the primary connection pool
// This prevents buffering timeouts (10000ms timeout) and race conditions across local/Atlas setups.
const isDedicatedPartnerUri =
  Boolean(env.partnerMongodbUri) &&
  env.partnerMongodbUri !== env.mongodbUri &&
  !env.partnerMongodbUri.includes('localhost:27017/carzodrive_partners') &&
  !env.partnerMongodbUri.includes('127.0.0.1:27017/carzodrive_partners');

const partnerConnection = isDedicatedPartnerUri
  ? mongoose.createConnection(env.partnerMongodbUri, options)
  : mongoose.connection.useDb('carzodrive_partners', { useCache: true });

if (isDedicatedPartnerUri) {
  partnerConnection.on('connected', () => {
    logger.success(`Dedicated Partner DB connected: ${partnerConnection.host} [database: ${partnerConnection.name}]`);
  });
  partnerConnection.on('error', (err) => {
    logger.error('Partner DB connection error:', err);
  });
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB primary connection lost. Retrying...');
});

mongoose.connection.on('reconnected', () => {
  logger.success('MongoDB primary connection re-established.');
});

async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri, options);
    logger.success(`MongoDB connected successfully to host: ${mongoose.connection.host} [database: ${mongoose.connection.name}]`);
    if (!isDedicatedPartnerUri) {
      logger.success(`Dedicated Partner DB connected: ${mongoose.connection.host} [database: ${partnerConnection.name}]`);
    } else if (partnerConnection.readyState !== 1) {
      await partnerConnection.asPromise();
    }
  } catch (err) {
    logger.error('MongoDB initial connection error:', err);
    if (env.nodeEnv === 'production') {
      process.exit(1);
    } else {
      logger.warn(`Local development MongoDB notice: retrying connection in background to ${env.mongodbUri}`);
      const retryTimer = setInterval(async () => {
        try {
          if (mongoose.connection.readyState === 1) {
            clearInterval(retryTimer);
            return;
          }
          await mongoose.connect(env.mongodbUri, options);
          clearInterval(retryTimer);
          logger.success(`MongoDB reconnected successfully to host: ${mongoose.connection.host}`);
        } catch (retryErr) {
          logger.warn(`Retrying MongoDB connection: ${retryErr.message}`);
        }
      }, 5000);
      retryTimer.unref();
    }
  }
}

async function checkDBHealth() {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const status = states[state] || 'unknown';
  const isHealthy = state === 1;

  if (isHealthy) {
    try {
      await mongoose.connection.db.admin().ping();
      return {
        status: 'ok',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        partnerDatabase: partnerConnection.name,
        partnerStatus: partnerConnection.readyState === 1 ? 'connected' : 'connecting',
        poolSize: options.maxPoolSize,
      };
    } catch (pingErr) {
      return { status: 'error', message: pingErr.message };
    }
  }

  return { status };
}

module.exports = { connectDB, checkDBHealth, partnerConnection, isDedicatedPartnerUri };
