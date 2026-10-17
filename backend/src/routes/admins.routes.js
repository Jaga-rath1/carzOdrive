const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/admins.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// Allow Super Admin or any staff member granted 'manage_staff' permission
router.use(authenticate, authorize('SUPER_ADMIN', 'manage_staff'));

// Dynamic permissions catalog & role defaults
router.get('/permissions', controller.getPermissionsList);

// List all admin and staff members with pagination & filtering
router.get('/', controller.listAdmins);

// Create new admin / staff user with assigned role & custom permissions
router.post(
  '/',
  validate([
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role')
      .isIn([
        'SUPER_ADMIN',
        'OPERATIONS_ADMIN',
        'FINANCE_ADMIN',
        'SUPPORT_ADMIN',
        'STAFF_ADMIN',
      ])
      .withMessage('Valid admin role is required'),
    body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Invalid phone number'),
    body('permissions').optional().isArray().withMessage('Permissions must be an array of keys'),
  ]),
  controller.createAdmin
);

// Update existing admin details, role, permissions, status, or reset password
router.put(
  '/:id',
  validate([
    body('name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('role')
      .optional()
      .isIn([
        'SUPER_ADMIN',
        'OPERATIONS_ADMIN',
        'FINANCE_ADMIN',
        'SUPPORT_ADMIN',
        'STAFF_ADMIN',
      ])
      .withMessage('Invalid admin role'),
    body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Invalid phone number'),
    body('permissions').optional().isArray().withMessage('Permissions must be an array'),
    body('status').optional().isIn(['ACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE or SUSPENDED'),
    body('password').optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ]),
  controller.updateAdmin
);

// Quick status toggle
router.patch(
  '/:id/status',
  validate([
    body('status').isIn(['ACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE or SUSPENDED'),
  ]),
  controller.updateAdminStatus
);

// Remove staff member account
router.delete('/:id', controller.deleteAdmin);

module.exports = router;
