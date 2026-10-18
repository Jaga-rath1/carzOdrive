const mongoose = require('mongoose');
const { env } = require('../config/env');

async function syncRealData() {
  const mongoUri = env?.mongodbUri || 'mongodb://localhost:27017/carzodrive';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB. Verifying database records...');

  const vehiclesCount = await mongoose.connection.db.collection('vehicles').countDocuments();
  const bikesCount = await mongoose.connection.db.collection('bikes').countDocuments();
  const bookingsCount = await mongoose.connection.db.collection('bookings').countDocuments();
  const usersCount = await mongoose.connection.db.collection('users').countDocuments();

  console.log(`Database Records:
  - Vehicles: ${vehiclesCount}
  - Bikes: ${bikesCount}
  - Bookings: ${bookingsCount}
  - Users: ${usersCount}
  `);

  await mongoose.disconnect();
}

syncRealData().catch((err) => {
  console.error('Sync error:', err);
  process.exit(1);
});
