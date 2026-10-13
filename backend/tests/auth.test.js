require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/modules/auth/auth.model');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({ email: /test@carzodrive/ });
  await mongoose.disconnect();
});

describe('Auth — Registration', () => {
  const testEmail = 'test@carzodrive.com';

  afterEach(async () => {
    await User.deleteOne({ email: testEmail });
  });

  test('registers a new customer', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: testEmail,
      password: 'Password1',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.role).toBe('CUSTOMER');
  });

  test('rejects duplicate email', async () => {
    await User.create({ name: 'Existing', email: testEmail, password: 'Password1', role: 'CUSTOMER' });
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test',
      email: testEmail,
      password: 'Password1',
    });
    expect(res.status).toBe(409);
  });

  test('rejects weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test',
      email: testEmail,
      password: 'weak',
    });
    expect(res.status).toBe(400);
  });
});

describe('Auth — Login', () => {
  const testEmail = 'login@carzodrive.com';
  let userId;

  beforeAll(async () => {
    const user = await User.create({ name: 'Login Test', email: testEmail, password: 'Password1', role: 'CUSTOMER' });
    userId = user._id;
  });

  afterAll(async () => {
    await User.deleteOne({ email: testEmail });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'Password1',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  test('rejects wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'WrongPass1',
    });
    expect(res.status).toBe(401);
  });

  test('suspended account cannot login', async () => {
    await User.findByIdAndUpdate(userId, { status: 'SUSPENDED' });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'Password1',
    });
    expect(res.status).toBe(403);
    await User.findByIdAndUpdate(userId, { status: 'ACTIVE' });
  });
});

describe('Auth — Refresh and Logout', () => {
  const testEmail = 'refresh@carzodrive.com';
  let tokens;

  beforeAll(async () => {
    await User.create({ name: 'Refresh Test', email: testEmail, password: 'Password1', role: 'CUSTOMER' });
    const res = await request(app).post('/api/v1/auth/login').send({ email: testEmail, password: 'Password1' });
    tokens = res.body.data;
  });

  afterAll(async () => {
    await User.deleteOne({ email: testEmail });
  });

  test('refreshes access token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: tokens.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('logs out and invalidates token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${tokens.accessToken}`);
    expect(res.status).toBe(200);
  });

  test('rejects invalid refresh token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: 'invalid.token.here' });
    expect(res.status).toBe(401);
  });
});

describe('Auth — Role-Based Access', () => {
  const adminEmail = 'rbac-admin@carzodrive.com';
  const customerEmail = 'rbac-customer@carzodrive.com';
  let adminToken, customerToken;

  beforeAll(async () => {
    await User.create({ name: 'RBAC Admin', email: adminEmail, password: 'Password1', role: 'SUPER_ADMIN' });
    await User.create({ name: 'RBAC Customer', email: customerEmail, password: 'Password1', role: 'CUSTOMER' });

    const r1 = await request(app).post('/api/v1/auth/login').send({ email: adminEmail, password: 'Password1' });
    adminToken = r1.body.data.accessToken;
    const r2 = await request(app).post('/api/v1/auth/login').send({ email: customerEmail, password: 'Password1' });
    customerToken = r2.body.data.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: [adminEmail, customerEmail] } });
  });

  test('admin can list users', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  test('customer cannot list users', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  test('unauthenticated request is rejected', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });
});
