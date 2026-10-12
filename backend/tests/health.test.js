require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Health Endpoints', () => {
  test('GET /api/v1/health returns 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  test('GET /api/v1/health/database returns DB status', async () => {
    const res = await request(app).get('/api/v1/health/database');
    expect([200, 503]).toContain(res.status);
    expect(res.body.data.database).toBeDefined();
  });

  test('GET /api/v1/unknown returns 404', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
