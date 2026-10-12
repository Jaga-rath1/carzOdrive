const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const ctrl = require('./bikes.controller');

// Public routes
router.get('/', ctrl.getPublicBikes);
router.get('/:id/availability', ctrl.checkBikeAvailability);
router.get('/:id/price', ctrl.getBikePriceEstimate);
router.get('/:id', ctrl.getPublicBikeById);

// Vendor routes
router.post('/', authenticate, authorize('VENDOR'), ctrl.createBike);
router.get('/vendor/mine', authenticate, authorize('VENDOR'), ctrl.getVendorBikes);
router.put('/:id', authenticate, authorize('VENDOR'), ctrl.updateBike);
router.patch('/:id/publish', authenticate, authorize('VENDOR'), ctrl.togglePublish);

// Admin routes
router.get('/admin/all', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'), ctrl.getAdminBikes);
router.post('/:id/approve', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'), ctrl.approveBike);
router.post('/:id/reject', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'), ctrl.rejectBike);

module.exports = router;
