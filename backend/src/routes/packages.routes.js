const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/packages.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];

const normalizePackageBody = (req, res, next) => {
  if (!req.body.name && req.body.title) {
    req.body.name = req.body.title;
  }
  if (!req.body.title && req.body.name) {
    req.body.title = req.body.name;
  }
  if ((!req.body.pricing || !req.body.pricing.adultPrice) && req.body.priceNumeric) {
    req.body.pricing = {
      adultPrice: Number(req.body.priceNumeric),
      childPrice: Math.round(Number(req.body.priceNumeric) * 0.5),
      infantPrice: 0,
    };
  }
  next();
};

const packageBodyValidators = [
  body('name').trim().notEmpty().withMessage('name or title is required'),
  body('destination').trim().notEmpty().withMessage('destination is required'),
  body('pricing.adultPrice').optional().isNumeric(),
  body('priceNumeric').optional().isNumeric(),
  body('pricing.childPrice').optional().isNumeric(),
  body('pricing.infantPrice').optional().isNumeric(),
  body('minPax').optional().isInt({ min: 1 }),
  body('maxPax').optional().isInt({ min: 1 }),
];

// ─── Public routes ─────────────────────────────────────────────────────────

// GET /api/v1/packages — public search
router.get('/', controller.listPackages);

// GET /api/v1/packages/vendor/mine — authenticate, VENDOR
// Must be registered before /:id to avoid conflict
router.get(
  '/vendor/mine',
  authenticate,
  authorize('VENDOR'),
  controller.listVendorPackages
);

// GET /api/v1/packages/admin/all — authenticate, admin
router.get(
  '/admin/all',
  authenticate,
  authorize(...ADMIN_ROLES, 'manage_packages'),
  controller.listAdminPackages
);

// GET /api/v1/packages/:id — public
router.get('/:id', controller.getPackageById);

// GET /api/v1/packages/:id/availability — public
router.get('/:id/availability', controller.checkAvailability);

// ─── Authenticated routes ──────────────────────────────────────────────────

// POST /api/v1/packages — authenticate, VENDOR or admin
router.post(
  '/',
  authenticate,
  authorize('VENDOR', ...ADMIN_ROLES, 'manage_packages'),
  normalizePackageBody,
  validate(packageBodyValidators),
  controller.createPackage
);

// PUT /api/v1/packages/:id — authenticate, VENDOR or admin
router.put(
  '/:id',
  authenticate,
  authorize('VENDOR', ...ADMIN_ROLES, 'manage_packages'),
  normalizePackageBody,
  validate([
    body('name').optional().trim().notEmpty(),
    body('title').optional().trim().notEmpty(),
    body('destination').optional().trim().notEmpty(),
    body('pricing.adultPrice').optional().isNumeric(),
    body('priceNumeric').optional().isNumeric(),
    body('pricing.childPrice').optional().isNumeric(),
    body('pricing.infantPrice').optional().isNumeric(),
    body('minPax').optional().isInt({ min: 1 }),
    body('maxPax').optional().isInt({ min: 1 }),
  ]),
  controller.updatePackage
);

// DELETE /api/v1/packages/:id — authenticate, VENDOR or admin
router.delete(
  '/:id',
  authenticate,
  authorize('VENDOR', ...ADMIN_ROLES, 'manage_packages'),
  controller.deletePackage
);

// PATCH /api/v1/packages/:id/publish — authenticate, VENDOR or admin
router.patch(
  '/:id/publish',
  authenticate,
  authorize('VENDOR', ...ADMIN_ROLES, 'manage_packages'),
  validate([
    body('isPublished').isBoolean().withMessage('isPublished must be a boolean'),
  ]),
  controller.togglePublish
);

// POST /api/v1/packages/:id/approve — authenticate, SUPER_ADMIN or OPERATIONS_ADMIN
router.post(
  '/:id/approve',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_packages'),
  controller.approvePackage
);

// POST /api/v1/packages/:id/reject — authenticate, SUPER_ADMIN or OPERATIONS_ADMIN
router.post(
  '/:id/reject',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'manage_packages'),
  validate([
    body('reason').optional().trim(),
  ]),
  controller.rejectPackage
);

module.exports = router;
