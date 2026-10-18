const mongoose = require('mongoose');

async function purge() {
  await mongoose.connect('mongodb://localhost:27017/carzodrive');
  console.log('Connected to MongoDB. Purging all demo data...');

  // 1. Delete all non-vendor vehicles (or all demo vehicles)
  const vDel = await mongoose.connection.db.collection('vehicles').deleteMany({ isVendorListing: { $ne: true } });
  console.log('✓ Deleted demo vehicles:', vDel.deletedCount);

  // 2. Delete all non-vendor bikes
  const bDel = await mongoose.connection.db.collection('bikes').deleteMany({ isVendorListing: { $ne: true } });
  console.log('✓ Deleted demo bikes:', bDel.deletedCount);

  // 3. Delete all dummy drivers
  const dDel = await mongoose.connection.db.collection('drivers').deleteMany({});
  console.log('✓ Deleted demo drivers:', dDel.deletedCount);

  // 4. Delete all dummy tour packages
  const pDel = await mongoose.connection.db.collection('tourpackages').deleteMany({});
  console.log('✓ Deleted demo tour packages:', pDel.deletedCount);

  // 5. Delete dummy driver users
  const uDel = await mongoose.connection.db.collection('users').deleteMany({ role: 'DRIVER' });
  console.log('✓ Deleted demo driver users:', uDel.deletedCount);

  // 6. Delete test bookings
  const bkDel = await mongoose.connection.db.collection('bookings').deleteMany({});
  console.log('✓ Deleted test bookings:', bkDel.deletedCount);

  console.log('PURGE COMPLETE: All fake/demo records removed from MongoDB!');
  await mongoose.disconnect();
}

purge().catch(err => {
  console.error('Purge error:', err);
  process.exit(1);
});
