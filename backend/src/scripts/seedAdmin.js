/**
 * One-time Super Admin seed script.
 * Run: node src/scripts/seedAdmin.js
 * Requires SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_NAME, MONGODB_URI, JWT_SECRET in .env
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { env, validateEnv } = require('../config/env');
const { User } = require('../models/user.model');

async function seedAdmin() {
  validateEnv();

  if (!env.superAdmin.email || !env.superAdmin.password) {
    console.error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ role: 'SUPER_ADMIN' });
  if (existing) {
    existing.permissions = [
      'manage_cars',
      'manage_bikes',
      'manage_drivers',
      'manage_bookings',
      'manage_staff',
      'manage_rates',
      'view_analytics',
      'manage_vendors',
      'approve_vendor_fleet',
    ];
    await existing.save();
    console.log(`Updated permissions for existing Super Admin: ${existing.email}`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name: env.superAdmin.name || 'Super Admin',
    email: env.superAdmin.email,
    password: env.superAdmin.password,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    permissions: [
      'manage_cars',
      'manage_bikes',
      'manage_drivers',
      'manage_bookings',
      'manage_staff',
      'manage_rates',
      'view_analytics',
      'manage_vendors',
      'approve_vendor_fleet',
    ],
  });

  console.log(`Super Admin created: ${admin.email}`);
  console.log('IMPORTANT: Change the password after first login.');
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
