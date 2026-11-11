const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), 'backend/.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { env } = require('../config/env');
const { User } = require('../models/user.model');
const { Setting } = require('../models/setting.model');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    throw new Error(`Test failed: ${testName}`);
  }
}

function generateTestToken(userPayload) {
  return jwt.sign(userPayload, env.jwt.secret, { expiresIn: '1h' });
}

async function runRBACTests() {
  console.log('================================================================');
  console.log('🛡️ CARZODRIVE ENTERPRISE RBAC & PERMISSION AUDIT & TEST SUITE');
  console.log('================================================================\n');

  console.log('--- 1. Connecting to Database ---');
  await mongoose.connect(env.mongodbUri);
  assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connection established');

  const existingSiteSettings = await Setting.findOne({ key: 'site_settings' }).lean();
  const originalDiscountSnapshot = existingSiteSettings?.discount ? { ...existingSiteSettings.discount } : null;

  // Define synthetic payloads for all platform roles
  const superAdminPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Super Admin Test',
    email: 'superadmin@carzodrive.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
  };

  const opsAdminPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Operations Admin Test',
    email: 'opsadmin@carzodrive.com',
    role: 'OPERATIONS_ADMIN',
    status: 'ACTIVE',
  };

  const financeAdminPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Finance Admin Test',
    email: 'financeadmin@carzodrive.com',
    role: 'FINANCE_ADMIN',
    status: 'ACTIVE',
  };

  const supportAdminPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Support Admin Test',
    email: 'supportadmin@carzodrive.com',
    role: 'SUPPORT_ADMIN',
    status: 'ACTIVE',
  };

  const vendorPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Vendor Partner Test',
    email: 'vendor@carzodrive.com',
    role: 'VENDOR',
    status: 'ACTIVE',
  };

  const driverPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Driver Pilot Test',
    email: 'driver@carzodrive.com',
    role: 'DRIVER',
    status: 'ACTIVE',
  };

  const customerPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Customer Guest Test',
    email: 'customer@carzodrive.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  };

  const suspendedPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Suspended User Test',
    email: 'suspended@carzodrive.com',
    role: 'CUSTOMER',
    status: 'SUSPENDED',
  };

  // Sign JWT tokens for each role
  const superAdminToken = generateTestToken(superAdminPayload);
  const opsAdminToken = generateTestToken(opsAdminPayload);
  const financeAdminToken = generateTestToken(financeAdminPayload);
  const supportAdminToken = generateTestToken(supportAdminPayload);
  const vendorToken = generateTestToken(vendorPayload);
  const driverToken = generateTestToken(driverPayload);
  const customerToken = generateTestToken(customerPayload);
  const suspendedToken = generateTestToken(suspendedPayload);
  const expiredToken = jwt.sign(customerPayload, env.jwt.secret, { expiresIn: '-10s' });
  const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';

  console.log('\n--- 2. Testing Unauthenticated Access Rejection (401 Unauthorized) ---');
  let res = await request(app).get('/api/v1/users');
  assert(res.status === 401, 'Unauthenticated request to /api/v1/users returns 401');

  res = await request(app).get('/api/v1/admins');
  assert(res.status === 401, 'Unauthenticated request to /api/v1/admins returns 401');

  res = await request(app).get('/api/v1/vendors/submissions');
  assert(res.status === 401, 'Unauthenticated request to /api/v1/vendors/submissions returns 401');

  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${tamperedToken}`);
  assert(res.status === 401, 'Tampered token returns 401 Invalid Token');

  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${expiredToken}`);
  assert(res.status === 401, 'Expired token returns 401 Token Expired');

  console.log('\n--- 3. Testing Suspended User Rejection (403 Forbidden) ---');
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${suspendedToken}`);
  assert(res.status === 403, 'Suspended user token is blocked with 403');
  assert(res.body.message.includes('suspended'), 'Suspended user receives explicit suspension notice');

  console.log('\n--- 4. Testing Customer Role Permission Boundaries ---');
  // Customer trying to access Admin Staff list
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${customerToken}`);
  assert(res.status === 403, 'CUSTOMER cannot access /api/v1/users (403 Forbidden)');

  // Customer trying to access Super Admin management
  res = await request(app).get('/api/v1/admins').set('Authorization', `Bearer ${customerToken}`);
  assert(res.status === 403, 'CUSTOMER cannot access /api/v1/admins (403 Forbidden)');

  // Customer trying to access Vendor Submissions admin review
  res = await request(app).get('/api/v1/vendors/submissions').set('Authorization', `Bearer ${customerToken}`);
  assert(res.status === 403, 'CUSTOMER cannot access /api/v1/vendors/submissions (403 Forbidden)');

  // Customer trying to access internal Admin Bikes management
  res = await request(app).get('/api/v1/bikes/admin/all').set('Authorization', `Bearer ${customerToken}`);
  assert(res.status === 403, 'CUSTOMER cannot access /api/v1/bikes/admin/all (403 Forbidden)');

  console.log('\n--- 5. Testing Vendor Role Permission Boundaries ---');
  // Vendor can access their own fleet endpoint
  res = await request(app).get('/api/v1/vehicles/vendor/mine').set('Authorization', `Bearer ${vendorToken}`);
  assert(res.status === 200, 'VENDOR can access /api/v1/vehicles/vendor/mine (200 OK)');

  // Vendor CANNOT access user management
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${vendorToken}`);
  assert(res.status === 403, 'VENDOR cannot access /api/v1/users (403 Forbidden)');

  // Vendor CANNOT access all vendor submissions
  res = await request(app).get('/api/v1/vendors/submissions').set('Authorization', `Bearer ${vendorToken}`);
  assert(res.status === 403, 'VENDOR cannot access /api/v1/vendors/submissions (403 Forbidden)');

  console.log('\n--- 6. Testing Driver Role Permission Boundaries ---');
  // Driver CANNOT access user management
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${driverToken}`);
  assert(res.status === 403, 'DRIVER cannot access /api/v1/users (403 Forbidden)');

  // Driver CANNOT modify vehicle fleet
  res = await request(app).post('/api/v1/vehicles').set('Authorization', `Bearer ${driverToken}`).send({});
  assert(res.status === 403, 'DRIVER cannot create vehicles via POST /api/v1/vehicles (403 Forbidden)');

  console.log('\n--- 7. Testing Granular Admin Roles & Separation of Duties ---');
  // 7a. SUPPORT_ADMIN:
  // Cannot manage staff / admins
  res = await request(app).get('/api/v1/admins').set('Authorization', `Bearer ${supportAdminToken}`);
  assert(res.status === 403, 'SUPPORT_ADMIN cannot access /api/v1/admins (403 Forbidden)');

  // Cannot update user status (only SUPER_ADMIN and OPERATIONS_ADMIN)
  res = await request(app).patch('/api/v1/users/507f1f77bcf86cd799439011/status').set('Authorization', `Bearer ${supportAdminToken}`).send({ status: 'SUSPENDED' });
  assert(res.status === 403, 'SUPPORT_ADMIN cannot patch user status (403 Forbidden)');
  
  // Cannot manage rates / discount settings
  res = await request(app).put('/api/v1/settings/discount').set('Authorization', `Bearer ${supportAdminToken}`).send({ percentage: 10 });
  assert(res.status === 403, 'SUPPORT_ADMIN cannot update discount settings (403 Forbidden)');

  // 7b. FINANCE_ADMIN:
  // Cannot manage staff / admins
  res = await request(app).get('/api/v1/admins').set('Authorization', `Bearer ${financeAdminToken}`);
  assert(res.status === 403, 'FINANCE_ADMIN cannot access /api/v1/admins (403 Forbidden)');

  // Cannot manage users list
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${financeAdminToken}`);
  assert(res.status === 403, 'FINANCE_ADMIN cannot access /api/v1/users (403 Forbidden)');

  // Can manage rates / discount settings
  res = await request(app).put('/api/v1/settings/discount').set('Authorization', `Bearer ${financeAdminToken}`).send({ percentage: 20 });
  assert(res.status === 200, 'FINANCE_ADMIN can update discount settings (200 OK)');

  // 7c. OPERATIONS_ADMIN:
  // Cannot manage staff / admins
  res = await request(app).get('/api/v1/admins').set('Authorization', `Bearer ${opsAdminToken}`);
  assert(res.status === 403, 'OPERATIONS_ADMIN cannot access /api/v1/admins (403 Forbidden)');

  // Can view vehicles admin list
  res = await request(app).get('/api/v1/vehicles/admin/all').set('Authorization', `Bearer ${opsAdminToken}`);
  assert(res.status === 200, 'OPERATIONS_ADMIN can view /api/v1/vehicles/admin/all (200 OK)');

  // Can view bikes admin list
  res = await request(app).get('/api/v1/bikes/admin/all').set('Authorization', `Bearer ${opsAdminToken}`);
  assert(res.status === 200, 'OPERATIONS_ADMIN can view /api/v1/bikes/admin/all (200 OK)');

  console.log('\n--- 8. Testing Super Admin Master Access ---');
  // Super Admin can list users
  res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${superAdminToken}`);
  assert(res.status === 200, 'SUPER_ADMIN can access /api/v1/users (200 OK)');

  // Super Admin can list admins
  res = await request(app).get('/api/v1/admins').set('Authorization', `Bearer ${superAdminToken}`);
  assert(res.status === 200, 'SUPER_ADMIN can access /api/v1/admins (200 OK)');

  // Super Admin can view vendor submissions
  res = await request(app).get('/api/v1/vendors/submissions').set('Authorization', `Bearer ${superAdminToken}`);
  assert(res.status === 200, 'SUPER_ADMIN can access /api/v1/vendors/submissions (200 OK)');

  // Super Admin can access discount settings
  res = await request(app).put('/api/v1/settings/discount').set('Authorization', `Bearer ${superAdminToken}`).send({ percentage: 25 });
  assert(res.status === 200, 'SUPER_ADMIN can update discount settings (200 OK)');

  console.log('\n--- 9. Testing Admin Login Gatekeeper ---');
  // Customer attempting login through /api/v1/auth/admin-login must be rejected
  const custInDb = await User.findOne({ role: 'CUSTOMER' });
  if (custInDb) {
    res = await request(app).post('/api/v1/auth/admin-login').send({
      email: custInDb.email,
      password: 'AnyPassword123!',
    });
    // Even if password was known or unknown, customer role must never gain admin access
    assert([401, 403].includes(res.status), 'CUSTOMER rejected from /api/v1/auth/admin-login');
  }

  if (originalDiscountSnapshot) {
    await Setting.findOneAndUpdate(
      { key: 'site_settings' },
      { $set: { discount: originalDiscountSnapshot } }
    );
    console.log('  🧹 Restored original production discount settings');
  }

  await mongoose.disconnect();

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} RBAC & AUTHORIZATION TESTS PASSED!`);
  console.log('🛡️ Platform Access Control & Permission Boundaries Verified.');
  console.log('================================================================\n');
}

runRBACTests().catch((err) => {
  console.error('\n❌ Fatal error during RBAC test execution:', err);
  process.exit(1);
});
