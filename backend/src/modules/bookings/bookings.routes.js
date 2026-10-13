const express = require('express');
const { body } = require('express-validator');
const controller = require('./bookings.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];
const dateRange = [
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
];

// Create bookings (customers)
router.post('/self-drive-car', authenticate, authorize('CUSTOMER'), [
  body('vehicleId').notEmpty(),
  ...dateRange,
], controller.createSelfDriveCar);

router.post('/self-drive-bike', authenticate, authorize('CUSTOMER'), [
  body('bikeId').notEmpty(),
  ...dateRange,
], controller.createSelfDriveBike);

router.post('/car-with-driver', authenticate, authorize('CUSTOMER'), [
  body('vehicleId').notEmpty(),
  ...dateRange,
], controller.createCarWithDriver);

router.post('/driver-only', authenticate, authorize('CUSTOMER'), [
  ...dateRange,
], controller.createDriverOnly);

router.post('/tour-package', authenticate, authorize('CUSTOMER'), [
  body('packageId').notEmpty(),
  body('tourDate').isISO8601(),
  body('adults').isInt({ min: 1 }),
], controller.createTourBooking);

// List and get
router.get('/', authenticate, controller.listBookings);
router.get('/:id', authenticate, controller.getBooking);

// Status management
router.patch('/:id/status', authenticate, [
  body('status').notEmpty(),
], controller.updateStatus);

// Admin-only operations
router.post('/:id/assign-driver', authenticate, authorize(...ADMINS), [
  body('driverId').notEmpty(),
], controller.assignDriver);

router.post('/:id/pickup-inspection', authenticate, controller.pickupInspection);
router.post('/:id/return-inspection', authenticate, authorize(...ADMINS, 'VENDOR'), controller.returnInspection);

module.exports = router;
