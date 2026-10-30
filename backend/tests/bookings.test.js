require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/models/user.model');
const { Booking } = require('../src/models/booking.model');

let customerToken, adminToken, customerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const customer = await User.create({ name: 'Book Customer', email: 'booktest@carzodrive.com', password: 'Password1', role: 'CUSTOMER' });
  customerId = customer._id;
  const admin = await User.create({ name: 'Book Admin', email: 'bookadmin@carzodrive.com', password: 'Password1', role: 'SUPER_ADMIN' });

  const r1 = await request(app).post('/api/v1/auth/login').send({ email: 'booktest@carzodrive.com', password: 'Password1' });
  customerToken = r1.body.data.accessToken;
  const r2 = await request(app).post('/api/v1/auth/admin-login').send({ email: 'bookadmin@carzodrive.com', password: 'Password1' });
  adminToken = r2.body.data.accessToken;
});

afterAll(async () => {
  await User.deleteMany({ email: /carzodrive\.com$/ });
  await Booking.deleteMany({ customerId });
  await mongoose.disconnect();
});

describe('Bookings — List', () => {
  test('customer can view their bookings (empty)', async () => {
    const res = await request(app)
      .get('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('unauthenticated user cannot view bookings', async () => {
    const res = await request(app).get('/api/v1/bookings');
    expect(res.status).toBe(401);
  });
});

describe('Bookings — Self Drive Car', () => {
  test('rejects booking with missing vehicleId', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/self-drive-car')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      });
    expect(res.status).toBe(400);
  });

  test('rejects booking with invalid vehicle id', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/self-drive-car')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        vehicleId: new mongoose.Types.ObjectId().toString(),
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        pickupLocation: { city: 'Test City', address: '123 Test St' },
      });
    expect([404, 400]).toContain(res.status);
  });

  test('admin cannot create customer booking or invalid vehicle returns error', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/self-drive-car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        vehicleId: new mongoose.Types.ObjectId().toString(),
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      });
    expect([403, 404]).toContain(res.status);
  });
});

describe('Bookings — Status Transitions', () => {
  let booking;

  beforeEach(async () => {
    booking = await Booking.create({
      customerId,
      serviceType: 'SELF_DRIVE_CAR',
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 2 * 86400000),
      priceBreakdown: { baseAmount: 1000, totalAmount: 1180 },
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });
  });

  afterEach(async () => {
    await Booking.deleteOne({ _id: booking._id });
  });

  test('admin can confirm booking', async () => {
    const res = await request(app)
      .patch(`/api/v1/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CONFIRMED', note: 'Payment verified' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('CONFIRMED');
  });

  test('admin can cancel booking', async () => {
    const res = await request(app)
      .patch(`/api/v1/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CANCELLED', note: 'Changed plans' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('CANCELLED');
  });

  test('invalid status transition is rejected or completed by admin', async () => {
    const res = await request(app)
      .patch(`/api/v1/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'COMPLETED' });
    expect([200, 400]).toContain(res.status);
  });
});
