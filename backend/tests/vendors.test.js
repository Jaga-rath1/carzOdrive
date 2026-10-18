require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/modules/auth/auth.model');
const Vendor = require('../src/modules/vendors/vendors.model');

let customerToken, adminToken, customerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const cust = await User.create({ name: 'Vendor Customer', email: 'vendcust@carzodrive.com', password: 'Password1', role: 'CUSTOMER' });
  customerId = cust._id;
  await User.create({ name: 'Vendor Admin', email: 'vendadmin@carzodrive.com', password: 'Password1', role: 'SUPER_ADMIN' });

  const r1 = await request(app).post('/api/v1/auth/login').send({ email: 'vendcust@carzodrive.com', password: 'Password1' });
  customerToken = r1.body.data.accessToken;
  const r2 = await request(app).post('/api/v1/auth/login').send({ email: 'vendadmin@carzodrive.com', password: 'Password1' });
  adminToken = r2.body.data.accessToken;
});

afterAll(async () => {
  await Vendor.deleteMany({ userId: customerId });
  await User.deleteMany({ email: /carzodrive\.com$/ });
  await mongoose.disconnect();
});

describe('Vendors — Apply', () => {
  afterEach(async () => {
    await Vendor.deleteMany({ userId: customerId });
  });

  test('customer can apply as vendor', async () => {
    const res = await request(app)
      .post('/api/v1/vendors/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ businessName: 'Test Cars', vendorType: 'CAR', contactPhone: '+919999999999' });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PENDING');
  });

  test('duplicate vendor application is rejected', async () => {
    await Vendor.create({ userId: customerId, businessName: 'Existing', vendorType: 'CAR' });
    const res = await request(app)
      .post('/api/v1/vendors/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ businessName: 'Test Cars', vendorType: 'CAR' });
    expect(res.status).toBe(409);
  });

  test('unauthenticated user cannot apply', async () => {
    const res = await request(app).post('/api/v1/vendors/apply').send({ businessName: 'Test', vendorType: 'CAR' });
    expect(res.status).toBe(401);
  });
});

describe('Vendors — Admin Operations', () => {
  let vendorId;

  beforeAll(async () => {
    const vendor = await Vendor.create({ userId: customerId, businessName: 'Admin Test Cars', vendorType: 'CAR' });
    vendorId = vendor._id;
  });

  afterAll(async () => {
    await Vendor.deleteOne({ _id: vendorId });
  });

  test('admin can list vendors', async () => {
    const res = await request(app).get('/api/v1/vendors').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('customer cannot list all vendors', async () => {
    const res = await request(app).get('/api/v1/vendors').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  test('admin can approve vendor', async () => {
    const res = await request(app)
      .post(`/api/v1/vendors/${vendorId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('APPROVED');
  });

  test('admin can suspend vendor', async () => {
    const res = await request(app)
      .post(`/api/v1/vendors/${vendorId}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Policy violation' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('SUSPENDED');
  });
});
