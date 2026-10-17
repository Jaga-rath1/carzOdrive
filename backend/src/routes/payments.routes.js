const express = require('express');
const controller = require('../controllers/payments.controller');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'STAFF_ADMIN', 'ADMIN'];

// Webhook — signature validated in service (rawBody captured by app-level verify callback)
router.post('/webhook/cashfree',
  (req, res, next) => {
    if (!req.rawBody) {
      req.rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
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
