const express = require('express');
const { body } = require('express-validator');
const controller = require('./users.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];

// Customer: own profile
router.get('/me', authenticate, controller.getProfile);
router.put('/me', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
], controller.updateProfile);

// Admin: list and manage users
router.get('/', authenticate, authorize(...ADMINS), controller.listUsers);
router.get('/:id', authenticate, authorize(...ADMINS), controller.getUserById);
router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'), controller.updateUserStatus);

module.exports = router;
