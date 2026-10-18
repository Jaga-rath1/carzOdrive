const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('../utils/logger');

const options = {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  compressors: ['zstd', 'snappy', 'zlib'],
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
