const express = require('express');
const controller = require('../controllers/payments.controller');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'STAFF_ADMIN', 'ADMIN'];

// Webhook — must capture raw body before JSON parsing
router.post('/webhook/cashfree',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Store raw body string for signature validation
    req.rawBody = req.body.toString('utf8');
    next();
  },
  controller.cashfreeWebhook
);

// Dynamic checkout (processes online/offline payment & locks booking voucher)
router.post('/checkout', optionalAuth, controller.processCheckout);

// Online payments
router.post('/online/:bookingId', optionalAuth, controller.createOnlineOrder);
router.get('/online/verify/:orderId', optionalAuth, controller.verifyPayment);

// Offline payments
router.post('/offline/:bookingId', optionalAuth, controller.createOfflinePayment);
router.post('/:paymentId/verify-offline', authenticate, authorize(...ADMINS), controller.verifyOfflinePayment);

// Payment status updates (Admin)
router.patch('/:paymentId/status', authenticate, authorize(...ADMINS), controller.updatePaymentStatus);

// Refunds
router.post('/booking/:bookingId/refund', authenticate, authorize(...ADMINS), controller.initiateRefund);

// Single payment details by receipt number or payment id
router.get('/details/:idOrNumber', optionalAuth, controller.getPaymentDetails);

// Get payment info for a booking (by booking ID or bookingNumber)
router.get('/booking/:bookingId', optionalAuth, controller.getPaymentByBooking);

// Admin list & metrics
router.get('/', authenticate, authorize(...ADMINS), controller.listPayments);

module.exports = router;
