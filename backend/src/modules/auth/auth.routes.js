const express = require('express');
const { body } = require('express-validator');
const controller = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number');

// POST /api/v1/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  passwordRules,
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
], controller.register);

// POST /api/v1/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], controller.login);

// POST /api/v1/auth/refresh
router.post('/refresh', controller.refreshToken);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, controller.logout);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], controller.forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', [
  body('token').notEmpty(),
  passwordRules,
], controller.resetPassword);

// POST /api/v1/auth/change-password
router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], controller.changePassword);

module.exports = router;
