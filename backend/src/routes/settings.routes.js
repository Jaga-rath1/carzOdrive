const express = require('express');
const controller = require('../controllers/settings.controller');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const RATE_ADMINS = ['SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN', 'manage_rates', 'manage_settings'];
const DRIVER_RATE_ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_settings', 'manage_drivers'];

// ─── Discount Settings (Default 5%) ─────────────────────────────────────────
// Public / client-side route to fetch active discount (supports both singular and plural aliases)
router.get('/discount', optionalAuth, controller.getDiscountSettings);
router.get('/discounts', optionalAuth, controller.getDiscountSettings);
router.get('/discount/public', controller.getDiscountSettings);
router.get('/discounts/public', controller.getDiscountSettings);
router.get('/', optionalAuth, controller.getDiscountSettings);

// Admin-only route to update discount percentage & settings
router.put('/discount', authenticate, authorize(...RATE_ADMINS), controller.updateDiscountSettings);
router.put('/discounts', authenticate, authorize(...RATE_ADMINS), controller.updateDiscountSettings);

// ─── Driver Pricing & Registration Settings (Default ₹799) ──────────────────
// Public / client-side route to fetch driver rates and registration fee
router.get('/driver', optionalAuth, controller.getDriverSettings);
router.get('/driver/public', controller.getDriverSettings);

// Admin-only route to update driver daily rate & registration fee
router.put('/driver', authenticate, authorize(...DRIVER_RATE_ADMINS), controller.updateDriverSettings);

module.exports = router;
