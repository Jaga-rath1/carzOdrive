const express = require('express');
const controller = require('../controllers/settings.controller');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const ADMINS = [
  'SUPER_ADMIN',
  'OPERATIONS_ADMIN',
  'FINANCE_ADMIN',
  'SUPPORT_ADMIN',
  'STAFF_ADMIN',
  'ADMIN',
];

// ─── Discount Settings (Default 5%) ─────────────────────────────────────────
// Public / client-side route to fetch active discount
router.get('/discount', optionalAuth, controller.getDiscountSettings);
router.get('/discount/public', controller.getDiscountSettings);

// Admin-only route to update discount percentage & settings
router.put('/discount', authenticate, authorize(...ADMINS, 'manage_settings'), controller.updateDiscountSettings);

// ─── Driver Pricing & Registration Settings (Default ₹799) ──────────────────
// Public / client-side route to fetch driver rates and registration fee
router.get('/driver', optionalAuth, controller.getDriverSettings);
router.get('/driver/public', controller.getDriverSettings);

// Admin-only route to update driver daily rate & registration fee
router.put('/driver', authenticate, authorize(...ADMINS, 'manage_settings', 'manage_drivers'), controller.updateDriverSettings);

module.exports = router;
