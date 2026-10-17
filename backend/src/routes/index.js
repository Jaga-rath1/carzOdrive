const express = require('express');
const { checkDBHealth } = require('../config/database');
const { success } = require('../utils/response');

const router = express.Router();

router.get('/health', (req, res) => {
  success(res, {
    status: 'ok',
    service: 'carzodrive-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/health/database', async (req, res) => {
  const dbHealth = await checkDBHealth();
  const statusCode = dbHealth.status === 'ok' ? 200 : 503;
  res.status(statusCode).json({
    success: dbHealth.status === 'ok',
    data: { database: dbHealth },
  });
});

// MVC Routes
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/admins', require('./admins.routes'));
router.use('/vehicles', require('./vehicles.routes'));
router.use('/bikes', require('./bikes.routes'));
router.use('/drivers', require('./drivers.routes'));
router.use('/packages', require('./packages.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/payments', require('./payments.routes'));
router.use('/vendors', require('./vendors.routes'));
router.use('/uploads', require('./uploads.routes'));

module.exports = router;
