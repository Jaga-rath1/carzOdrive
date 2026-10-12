const mongoose = require('mongoose');
const { env } = require('./env');

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri, options);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
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
    } catch {
      return { status: 'error', message: 'Ping failed' };
    }
  }

  return { status: isHealthy ? 'ok' : status };
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = { connectDB, checkDBHealth };
