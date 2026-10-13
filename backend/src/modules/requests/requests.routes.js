const express = require('express');
const { body } = require('express-validator');
const controller = require('./requests.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];
const VALID_STATUSES = ['UNDER_REVIEW', 'CONTACTED', 'APPROVED', 'REJECTED'];

// POST /requests — public or authenticated; submit a vehicle/partner supply request
router.post(
  '/',
  (req, res, next) => {
    // Attempt to authenticate but don't block if no token present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authenticate(req, res, next);
    }
    return next();
  },
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('vehicleType').optional().isString(),
    body('message').optional().isString().isLength({ max: 3000 }),
  ],
  controller.submitRequest
);

// GET /requests — admin list all requests with optional status filter
router.get(
  '/',
  authenticate,
  authorize(...ADMINS),
  controller.listRequests
);

// GET /requests/:id — admin get single request
router.get(
  '/:id',
  authenticate,
  authorize(...ADMINS),
  controller.getRequestById
);

// PATCH /requests/:id/status — admin update status
router.patch(
  '/:id/status',
  authenticate,
  authorize(...ADMINS),
  [
    body('status').isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
    body('notes').optional().isString().isLength({ max: 2000 }),
  ],
  controller.updateRequestStatus
);

module.exports = router;
