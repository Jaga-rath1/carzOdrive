const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];

// Customer: own profile
router.get('/me', authenticate, controller.getProfile);
router.put(
  '/me',
  authenticate,
  validate([
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  ]),
  controller.updateProfile
);

// Admin: list and manage users
router.get('/', authenticate, authorize(...ADMINS), controller.listUsers);
router.get('/:id', authenticate, authorize(...ADMINS), controller.getUserById);
router.patch(
  '/:id/status',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'),
  validate([
    body('status').isIn(['ACTIVE', 'SUSPENDED']).withMessage('status must be ACTIVE or SUSPENDED'),
  ]),
  controller.updateUserStatus
);

module.exports = router;
