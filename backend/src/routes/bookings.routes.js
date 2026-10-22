const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/bookings.controller');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'STAFF_ADMIN', 'ADMIN'];
const dateRange = [
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
];

// Universal booking creation from frontend modal (supports guest & logged-in checkout)
router.post('/', optionalAuth, controller.createUniversalBooking);
router.post('/universal', optionalAuth, controller.createUniversalBooking);

// Booking voucher lookup by bookingNumber / code
router.get('/voucher/:code', controller.getBookingByCode);
router.get('/voucher/:code/invoice', controller.getBookingInvoice);
router.get('/voucher/:code/pdf', controller.downloadBookingInvoicePdf);
router.get('/:id/pdf', controller.downloadBookingInvoicePdf);

// Public booking & payment history lookup (by phone, voucher code, or email - no token required)
router.get('/lookup', controller.lookupBookings);

// Create bookings (customers)
router.post(
  '/self-drive-car',
  authenticate,
  authorize('CUSTOMER'),
  validate([body('vehicleId').notEmpty().withMessage('vehicleId is required'), ...dateRange]),
  controller.createSelfDriveCar
);

router.post(
  '/self-drive-bike',
  authenticate,
  authorize('CUSTOMER'),
  validate([body('bikeId').notEmpty().withMessage('bikeId is required'), ...dateRange]),
  controller.createSelfDriveBike
);

router.post(
  '/car-with-driver',
  authenticate,
  authorize('CUSTOMER'),
  validate([body('vehicleId').notEmpty().withMessage('vehicleId is required'), ...dateRange]),
  controller.createCarWithDriver
);

router.post(
  '/driver-only',
  authenticate,
  authorize('CUSTOMER'),
  validate([...dateRange]),
  controller.createDriverOnly
);

router.post(
  '/tour-package',
  authenticate,
  authorize('CUSTOMER'),
  validate([
    body('packageId').notEmpty().withMessage('packageId is required'),
    body('tourDate').isISO8601().withMessage('Valid tourDate required'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
  ]),
  controller.createTourBooking
);

// List and get
router.get('/', authenticate, controller.listBookings);
router.get('/:id', authenticate, controller.getBooking);
router.get('/:id/invoice', optionalAuth, controller.getBookingInvoice);

// Status management
router.patch(
  '/:id/status',
  authenticate,
  validate([body('status').notEmpty().withMessage('status is required')]),
  controller.updateStatus
);

// Edit booking details (Admin)
router.put(
  '/:id',
  authenticate,
  authorize(...ADMINS, 'manage_bookings'),
  controller.updateBooking
);

// Delete booking record permanently (Admin)
router.delete(
  '/:id',
  authenticate,
  authorize(...ADMINS, 'manage_bookings'),
  controller.deleteBooking
);

// Admin-only operations
router.post(
  '/:id/assign-driver',
  authenticate,
  authorize(...ADMINS, 'manage_bookings', 'manage_drivers'),
  validate([body('driverId').notEmpty().withMessage('driverId is required')]),
  controller.assignDriver
);

router.post('/:id/pickup-inspection', authenticate, controller.pickupInspection);
router.post(
  '/:id/return-inspection',
  authenticate,
  authorize(...ADMINS, 'VENDOR', 'manage_bookings'),
  controller.returnInspection
);

module.exports = router;
