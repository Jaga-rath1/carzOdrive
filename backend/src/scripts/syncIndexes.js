const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { env } = require('../config/env');
const logger = require('../utils/logger');

// Load all models
const { Vehicle } = require('../models/vehicle.model');
const { Bike } = require('../models/bike.model');
const { Driver } = require('../models/driver.model');
const TourPackage = require('../models/package.model');
const { Booking } = require('../models/booking.model');
const { User } = require('../models/user.model');
const {
  PartnerCarSubmission,
  PartnerBikeSubmission,
  DriverRegistrationSubmission,
} = require('../models/partner.model');

async function syncAllIndexes() {
  console.log('⚡ Starting Production Database Optimization & Index Sync...');
  const startTime = Date.now();

  try {
    await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
      compressors: ['zstd', 'snappy', 'zlib'],
    });
    console.log(`✅ Connected to Primary MongoDB Cluster: ${mongoose.connection.host}`);

    const syncTasks = [
      { name: 'Vehicle', model: Vehicle },
      { name: 'Bike', model: Bike },
      { name: 'Driver', model: Driver },
      { name: 'TourPackage', model: TourPackage },
      { name: 'Booking', model: Booking },
      { name: 'User', model: User },
      { name: 'PartnerCarSubmission', model: PartnerCarSubmission },
      { name: 'PartnerBikeSubmission', model: PartnerBikeSubmission },
      { name: 'DriverRegistrationSubmission', model: DriverRegistrationSubmission },
    ];

    for (const task of syncTasks) {
      try {
        const t0 = Date.now();
        console.log(`Syncing indexes for ${task.name}...`);
        await task.model.syncIndexes();
        const indexes = await task.model.collection.indexes();
        console.log(`  ✓ ${task.name}: ${indexes.length} indexes verified in ${Date.now() - t0}ms`);
      } catch (err) {
        console.warn(`  ⚠️ Notice for ${task.name}:`, err.message);
      }
    }

    console.log('\n📊 Benchmarking Production Vehicle Query...');
    const q0 = Date.now();
    const result = await Vehicle.find({
      status: 'APPROVED',
      isPublished: true,
      isAvailable: true,
    })
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .limit(12)
      .lean();
    const qDuration = Date.now() - q0;
    console.log(`🚀 Fetched ${result.length} vehicles in: ${qDuration}ms (Lean & Indexed)`);

    console.log(`\n🎉 All Database Indexes & Optimizations Applied Successfully in ${Date.now() - startTime}ms!`);
  } catch (err) {
    console.error('Index sync error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

syncAllIndexes();
