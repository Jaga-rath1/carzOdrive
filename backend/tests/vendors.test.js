require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/models/user.model');
const { PartnerCarSubmission: Vendor } = require('../src/models/partner.model');

let customerToken, adminToken, customerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const cust = await User.create({ name: 'Vendor Customer', email: 'vendcust@carzodrive.com', password: 'Password1', role: 'CUSTOMER' });
  customerId = cust._id;
  await User.create({ name: 'Vendor Admin', email: 'vendadmin@carzodrive.com', password: 'Password1', role: 'SUPER_ADMIN' });

  const r1 = await request(app).post('/api/v1/auth/login').send({ email: 'vendcust@carzodrive.com', password: 'Password1' });
  customerToken = r1.body.data.accessToken;
  const r2 = await request(app).post('/api/v1/auth/admin-login').send({ email: 'vendadmin@carzodrive.com', password: 'Password1' });
  adminToken = r2.body.data.accessToken;
});

afterAll(async () => {
  await Vendor.deleteMany({ ownerPhone: '9999999999' });
  await User.deleteMany({ email: /carzodrive\.com$/ });
  await mongoose.disconnect();
});

describe('Vendors — Attach Vehicle', () => {
  afterEach(async () => {
    await Vendor.deleteMany({ ownerPhone: '9999999999' });
  });

  test('customer can attach car for rent', async () => {
    const res = await request(app)
      .post('/api/v1/vendors/attach-car')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        ownerName: 'Test Owner',
        phone: '9999999999',
        email: 'vendcust@carzodrive.com',
        vehicleBrand: 'Hyundai',
        vehicleModel: 'Creta',
        expectedDailyPrice: 2500,
      });
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });

  test('rejects car attachment with missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/vendors/attach-car')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        ownerName: 'Test Owner',
      });
    expect(res.status).toBe(400);
  });
});

describe('Vendors — Admin Operations', () => {
  test('admin can list submissions', async () => {
    const res = await request(app).get('/api/v1/vendors/submissions').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('customer cannot list all submissions', async () => {
    const res = await request(app).get('/api/v1/vendors/submissions').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });
});
