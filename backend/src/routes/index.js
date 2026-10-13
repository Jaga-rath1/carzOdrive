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

// Module routes (registered here as implemented)
router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/users/users.routes'));
router.use('/admins', require('../modules/admins/admins.routes'));
router.use('/vendors', require('../modules/vendors/vendors.routes'));
router.use('/vehicles', require('../modules/vehicles/vehicles.routes'));
router.use('/bikes', require('../modules/bikes/bikes.routes'));
router.use('/drivers', require('../modules/drivers/drivers.routes'));
router.use('/packages', require('../modules/packages/packages.routes'));
router.use('/bookings', require('../modules/bookings/bookings.routes'));
router.use('/quotations', require('../modules/quotations/quotations.routes'));
router.use('/payments', require('../modules/payments/payments.routes'));
router.use('/reviews', require('../modules/reviews/reviews.routes'));
router.use('/notifications', require('../modules/notifications/notifications.routes'));
router.use('/requests', require('../modules/requests/requests.routes'));
router.use('/reports', require('../modules/reports/reports.routes'));

module.exports = router;
