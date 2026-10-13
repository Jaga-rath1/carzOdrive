const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const ctrl = require('./drivers.controller');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];
const SENIOR_ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'];
const ADMIN_OR_VENDOR = [...ADMIN_ROLES, 'VENDOR'];

// Authenticated user routes (driver self-service)
router.post('/apply', authenticate, ctrl.applyAsDriver);
router.get('/me', authenticate, ctrl.getMyProfile);
router.put('/me', authenticate, ctrl.updateMyProfile);

// Admin / Vendor list and availability routes
router.get('/', authenticate, authorize(...ADMIN_OR_VENDOR), ctrl.listDrivers);
router.get('/available', authenticate, authorize(...ADMIN_OR_VENDOR), ctrl.getAvailableDrivers);

// Admin / Vendor individual driver lookup
router.get('/:id', authenticate, authorize(...ADMIN_OR_VENDOR), ctrl.getDriverById);

// Senior admin action routes
router.post('/:id/approve', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.approveDriver);
router.post('/:id/reject', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.rejectDriver);
router.post('/:id/suspend', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.suspendDriver);

module.exports = router;
