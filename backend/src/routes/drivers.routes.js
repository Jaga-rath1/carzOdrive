const express = require('express');
const router = express.Router();
const { authenticate, authorize, optionalAuth } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/drivers.controller');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];
const SENIOR_ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_drivers'];

// Driver catalog list & availability routes (public for frontend booking & driver selection)
router.get('/', ctrl.listDrivers);
router.get('/available', ctrl.getAvailableDrivers);

// Driver individual lookup (public by ID or slug)
router.get('/:id', ctrl.getDriverById);

// Public & Authenticated Driver Registration & Document Submission
router.post('/register', optionalAuth, ctrl.registerDriver);

// Admin direct driver creation / fleet enrollment
router.post('/', authenticate, authorize(...ADMIN_ROLES), ctrl.createDriver);
router.post('/admin/create', authenticate, authorize(...ADMIN_ROLES), ctrl.createDriver);

// Authenticated user routes (driver self-service)
router.post('/apply', authenticate, ctrl.applyAsDriver);
router.get('/me', authenticate, ctrl.getMyProfile);
router.put('/me', authenticate, ctrl.updateMyProfile);

// Senior admin action routes
router.post('/:id/approve', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.approveDriver);
router.patch('/:id/approve', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.approveDriver);
router.post('/:id/reject', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.rejectDriver);
router.patch('/:id/reject', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.rejectDriver);
router.post('/:id/suspend', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.suspendDriver);
router.patch('/:id/suspend', authenticate, authorize(...SENIOR_ADMIN_ROLES), ctrl.suspendDriver);

// Admin delete driver
router.delete('/:id', authenticate, authorize(...ADMIN_ROLES), ctrl.deleteDriver);

module.exports = router;
