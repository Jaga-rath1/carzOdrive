const express = require('express');
const controller = require('./payments.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];

// Webhook — must capture raw body before JSON parsing
// Raw body middleware applied only on webhook route
router.post('/webhook/cashfree',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Store raw body string for signature validation
    req.rawBody = req.body.toString('utf8');
    next();
  },
  controller.cashfreeWebhook
);

// Online payments
router.post('/online/:bookingId', authenticate, authorize('CUSTOMER'), controller.createOnlineOrder);
router.get('/online/verify/:orderId', authenticate, controller.verifyPayment);

// Offline payments
router.post('/offline/:bookingId', authenticate, authorize('CUSTOMER'), controller.createOfflinePayment);
router.post('/:paymentId/verify-offline', authenticate, authorize(...ADMINS), controller.verifyOfflinePayment);

// Refunds
router.post('/booking/:bookingId/refund', authenticate, authorize(...ADMINS), controller.initiateRefund);

// Get payment info
router.get('/booking/:bookingId', authenticate, controller.getPaymentByBooking);

// Admin list
router.get('/', authenticate, authorize(...ADMINS), controller.listPayments);

module.exports = router;
