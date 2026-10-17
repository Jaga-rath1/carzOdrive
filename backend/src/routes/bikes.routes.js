const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/bikes.controller');

// Public routes
router.get('/', ctrl.getPublicBikes);
router.get('/:id/availability', ctrl.checkBikeAvailability);
router.get('/:id/price', ctrl.getBikePriceEstimate);
router.get('/:id', ctrl.getPublicBikeById);

// Admin / Staff routes with manage_bikes permission
router.post('/', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.createBike);
router.get('/vendor/mine', authenticate, authorize('VENDOR', 'SUPER_ADMIN', 'manage_bikes'), ctrl.getVendorBikes);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.updateBike);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.deleteBike);
router.patch('/:id/publish', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.togglePublish);

// Admin routes
router.get('/admin/all', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'manage_bikes'), ctrl.getAdminBikes);
router.post('/:id/approve', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.approveBike);
router.post('/:id/reject', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_bikes'), ctrl.rejectBike);

module.exports = router;
