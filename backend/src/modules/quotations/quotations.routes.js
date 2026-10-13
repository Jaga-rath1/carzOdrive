const express = require('express');
const { body } = require('express-validator');
const controller = require('./quotations.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];

// Admin: create and send quotations
router.post('/', authenticate, authorize(...ADMINS), [
  body('customerId').notEmpty().withMessage('Customer ID required'),
  body('serviceType').notEmpty(),
  body('title').trim().notEmpty(),
  body('priceBreakdown.totalAmount').isNumeric().withMessage('Total amount required'),
], controller.createQuotation);

router.post('/:id/send', authenticate, authorize(...ADMINS), controller.sendQuotation);

// Shared: list and view
router.get('/', authenticate, controller.listQuotations);
router.get('/:id', authenticate, controller.getQuotation);

// Customer actions
router.post('/:id/accept', authenticate, authorize('CUSTOMER'), controller.acceptQuotation);
router.post('/:id/decline', authenticate, authorize('CUSTOMER'), controller.declineQuotation);
router.post('/:id/cancel', authenticate, controller.cancelQuotation);

module.exports = router;
