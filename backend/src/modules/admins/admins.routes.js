const express = require('express');
const { body } = require('express-validator');
const controller = require('./admins.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('SUPER_ADMIN'));

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN']),
  body('phone').optional().isMobilePhone(),
], controller.createAdmin);

router.get('/', controller.listAdmins);
router.patch('/:id/status', controller.updateAdminStatus);

module.exports = router;
