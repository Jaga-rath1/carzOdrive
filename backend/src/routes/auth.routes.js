const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number');

// POST /api/v1/auth/register
router.post(
  '/register',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    passwordRules,
    body('phone')
      .optional({ checkFalsy: true })
      .customSanitizer((v) => (typeof v === 'string' ? v.replace(/[\s\-]/g, '') : v))
      .matches(/^(\+?[0-9]{10,13})$/)
      .withMessage('Valid mobile number required (10-12 digits)'),
  ]),
  controller.register
);

// GET /api/v1/auth/me
router.get('/me', authenticate, controller.getMe);

// POST /api/v1/auth/login
router.post(
  '/login',
  validate([
    body('email').trim().notEmpty().withMessage('Please enter your registered email address or phone number'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  controller.login
);

// POST /api/v1/auth/admin-login (Strictly restricted to Admin/Staff roles)
router.post(
  '/admin-login',
  validate([
    body('email').trim().notEmpty().withMessage('Please enter your administrator email or phone'),
    body('password').notEmpty().withMessage('Admin password is required'),
  ]),
  controller.adminLogin
);


// POST /api/v1/auth/refresh
router.post('/refresh', controller.refreshToken);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, controller.logout);

// POST /api/v1/auth/forgot-password
router.post(
  '/forgot-password',
  validate([
    body('email').trim().notEmpty().withMessage('Please enter your registered email address or mobile number'),
  ]),
  controller.forgotPassword
);

// POST /api/v1/auth/reset-password
router.post(
  '/reset-password',
  validate([
    body('token').notEmpty().withMessage('Token is required'),
    passwordRules,
  ]),
  controller.resetPassword
);

// POST /api/v1/auth/change-password
router.post(
  '/change-password',
  authenticate,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ]),
  controller.changePassword
);

module.exports = router;
