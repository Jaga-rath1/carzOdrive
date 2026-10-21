/**
 * One-time Super Admin seed script.
 * Run: node src/scripts/seedAdmin.js
 * Requires SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_NAME, MONGODB_URI, JWT_SECRET in .env
 */
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

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

  const targetEmail = env.superAdmin.email.toLowerCase().trim();
  let user = await User.findOne({ email: targetEmail });

  const allPerms = [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_bookings',
    'manage_staff',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
    'manage_packages',
  ];

  if (user) {
    user.name = env.superAdmin.name || user.name || 'CARZODRIVE Admin';
    user.role = 'SUPER_ADMIN';
    user.status = 'ACTIVE';
    user.password = env.superAdmin.password;
    user.permissions = allPerms;
    await user.save();
    console.log(`✓ Super Admin password and permissions successfully updated for: ${user.email}`);
  } else {
    user = await User.create({
      name: env.superAdmin.name || 'CARZODRIVE Admin',
      email: targetEmail,
      password: env.superAdmin.password,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      permissions: allPerms,
    });
    console.log(`✓ Super Admin successfully created: ${user.email}`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
