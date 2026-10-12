const express = require('express');
const controller = require('./reports.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];

// All reports routes require authentication and admin role
router.use(authenticate, authorize(...ADMINS));

// GET /reports/stats — overall platform stats
router.get('/stats', controller.getOverallStats);

// GET /reports/bookings — paginated booking report with filters
router.get('/bookings', controller.getBookingReport);

// GET /reports/revenue — revenue breakdown by service type and period
router.get('/revenue', controller.getRevenueReport);

// GET /reports/pending-approvals — count of pending vendor/vehicle/driver/package approvals
router.get('/pending-approvals', controller.getPendingApprovals);

// GET /reports/vendor/:vendorId — individual vendor performance report
router.get('/vendor/:vendorId', controller.getVendorReport);

// GET /reports/refunds — refund summary report
router.get('/refunds', controller.getRefundReport);

module.exports = router;
