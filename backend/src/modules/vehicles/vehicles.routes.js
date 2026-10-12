const express = require('express');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const controller = require('./vehicles.controller');

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/v1/vehicles — public search
router.get('/', controller.listVehicles);

// IMPORTANT: Static segments (/vendor/mine, /admin/all) must appear before /:id
// so that Express does not mistakenly treat them as id parameters.

// ─── Vendor routes ────────────────────────────────────────────────────────────

// GET /api/v1/vehicles/vendor/mine — authenticated vendor, list own vehicles
router.get('/vendor/mine', authenticate, authorize('VENDOR'), controller.listMyVehicles);

// POST /api/v1/vehicles — authenticated vendor, create vehicle
router.post('/', authenticate, authorize('VENDOR'), controller.createVehicle);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// GET /api/v1/vehicles/admin/all — admin list all vehicles
router.get(
  '/admin/all',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'),
  controller.listAllVehicles
);

// ─── Public parameterised routes ─────────────────────────────────────────────

// GET /api/v1/vehicles/:id — public, get single vehicle
router.get('/:id', controller.getVehicle);

// GET /api/v1/vehicles/:id/availability — public, check date-range availability
router.get('/:id/availability', controller.checkAvailability);

// GET /api/v1/vehicles/:id/price/self-drive — public, calculate self-drive price
router.get('/:id/price/self-drive', controller.calcSelfDrivePrice);

// GET /api/v1/vehicles/:id/price/with-driver — public, calculate with-driver price
router.get('/:id/price/with-driver', controller.calcWithDriverPrice);

// ─── Vendor parameterised routes ─────────────────────────────────────────────

// PUT /api/v1/vehicles/:id — authenticated vendor, update vehicle (ownership checked in service)
router.put('/:id', authenticate, authorize('VENDOR'), controller.updateVehicle);

// PATCH /api/v1/vehicles/:id/publish — authenticated vendor, toggle publish
router.patch('/:id/publish', authenticate, authorize('VENDOR'), controller.togglePublish);

// POST /api/v1/vehicles/:id/block — authenticated vendor OR admin, add blocked period
router.post(
  '/:id/block',
  authenticate,
  authorize('VENDOR', 'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'),
  controller.blockPeriod
);

// ─── Admin parameterised routes ───────────────────────────────────────────────

// POST /api/v1/vehicles/:id/approve — SUPER_ADMIN or OPERATIONS_ADMIN
router.post(
  '/:id/approve',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'),
  controller.approveVehicle
);

// POST /api/v1/vehicles/:id/reject — SUPER_ADMIN or OPERATIONS_ADMIN
router.post(
  '/:id/reject',
  authenticate,
  authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'),
  controller.rejectVehicle
);

module.exports = router;
