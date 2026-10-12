const express = require('express');
const { body } = require('express-validator');
const controller = require('./vendors.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];
const MANAGE_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'];

// POST /api/v1/vendors/apply — authenticated CUSTOMER applies as vendor
router.post(
  '/apply',
  authenticate,
  authorize('CUSTOMER'),
  [
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    body('vendorType')
      .isIn(['CAR', 'BIKE', 'DRIVER', 'TOUR'])
      .withMessage('vendorType must be one of CAR, BIKE, DRIVER, TOUR'),
    body('contactPhone').optional().trim(),
    body('contactEmail').optional().isEmail().normalizeEmail().withMessage('Invalid contact email'),
    body('address').optional().trim(),
    body('description').optional().trim(),
    body('documents').optional().isArray().withMessage('documents must be an array'),
    body('documents.*.type').if(body('documents').exists()).notEmpty().withMessage('Document type is required'),
    body('documents.*.url').if(body('documents').exists()).notEmpty().withMessage('Document URL is required'),
  ],
  controller.applyAsVendor
);

// GET /api/v1/vendors/me — authenticated VENDOR gets own profile
router.get('/me', authenticate, authorize('VENDOR'), controller.getMyVendorProfile);

// PUT /api/v1/vendors/me — authenticated VENDOR updates own profile
router.put(
  '/me',
  authenticate,
  authorize('VENDOR'),
  [
    body('businessName').optional().trim().notEmpty().withMessage('Business name cannot be empty'),
    body('contactPhone').optional().trim(),
    body('contactEmail').optional().isEmail().normalizeEmail().withMessage('Invalid contact email'),
    body('address').optional().trim(),
    body('description').optional().trim(),
    body('documents').optional().isArray().withMessage('documents must be an array'),
    body('documents.*.type').if(body('documents').exists()).notEmpty().withMessage('Document type is required'),
    body('documents.*.url').if(body('documents').exists()).notEmpty().withMessage('Document URL is required'),
  ],
  controller.updateVendorProfile
);

// GET /api/v1/vendors — admin paginated list
router.get('/', authenticate, authorize(...ADMIN_ROLES), controller.listVendors);

// GET /api/v1/vendors/:id — admin get vendor by id
router.get('/:id', authenticate, authorize(...ADMIN_ROLES), controller.getVendorById);

// POST /api/v1/vendors/:id/approve — approve vendor
router.post('/:id/approve', authenticate, authorize(...MANAGE_ROLES), controller.approveVendor);

// POST /api/v1/vendors/:id/reject — reject vendor
router.post(
  '/:id/reject',
  authenticate,
  authorize(...MANAGE_ROLES),
  [body('reason').trim().notEmpty().withMessage('Rejection reason is required')],
  controller.rejectVendor
);

// POST /api/v1/vendors/:id/suspend — suspend vendor
router.post(
  '/:id/suspend',
  authenticate,
  authorize(...MANAGE_ROLES),
  [body('reason').trim().notEmpty().withMessage('Suspension reason is required')],
  controller.suspendVendor
);

// POST /api/v1/vendors/:id/reactivate — reactivate vendor
router.post('/:id/reactivate', authenticate, authorize(...MANAGE_ROLES), controller.reactivateVendor);

module.exports = router;
