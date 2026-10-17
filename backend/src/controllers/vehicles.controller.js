const vehiclesService = require('../services/vehicles.service');
const { success, created, badRequest, notFound, forbidden } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/vehicles
 * Public search for available, approved, published vehicles.
 */
const listVehicles = asyncHandler(async (req, res) => {
  const { vehicles, pagination } = await vehiclesService.listVehicles(req.query);
  return res.status(200).json({ success: true, message: 'Vehicles retrieved', data: vehicles, pagination });
});

/**
 * GET /api/v1/vehicles/:id
 * Public — get a single vehicle by id.
 */
const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.getVehicleById(req.params.id);
  return success(res, vehicle, 'Vehicle retrieved');
});

/**
 * GET /api/v1/vehicles/:id/availability
 * Public — check availability for a date range.
 * Query params: startDate, endDate (ISO strings)
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return badRequest(res, 'startDate and endDate are required');
  }
  const result = await vehiclesService.checkAvailability(req.params.id, startDate, endDate);
  return success(res, result, 'Availability checked');
});

// ─── Vendor / Admin ────────────────────────────────────────────────────────────

/**
 * POST /api/v1/vehicles
 * Authenticated vendor or admin — create a new vehicle listing.
 */
const createVehicle = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN'].includes(req.user.role);
  const data = {
    ...req.body,
    status: isAdmin ? (req.body.status || 'APPROVED') : 'PENDING',
    isPublished: isAdmin ? (req.body.isPublished !== undefined ? req.body.isPublished : true) : false,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    approvedBy: isAdmin ? req.user.id : undefined,
    approvedAt: isAdmin ? new Date() : undefined,
  };
  const vehicle = await vehiclesService.createVehicle(isAdmin ? null : req.user.id, data);
  return created(res, vehicle, 'Vehicle created successfully');
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'].includes(req.user.role);
  await vehiclesService.deleteVehicle(req.params.id, isAdmin ? null : req.user.id);
  return success(res, null, 'Vehicle deleted successfully');
});

/**
 * GET /api/v1/vehicles/vendor/mine
 * Authenticated vendor — list own vehicles.
 */
const listMyVehicles = asyncHandler(async (req, res) => {
  const { vehicles, pagination } = await vehiclesService.listVendorVehicles(req.user.id, req.query);
  return res.status(200).json({ success: true, message: 'Your vehicles retrieved', data: vehicles, pagination });
});

/**
 * PUT /api/v1/vehicles/:id
 * Authenticated vendor or admin — update vehicle. Ownership verified in service.
 */
const updateVehicle = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN'].includes(req.user.role) || (req.user.permissions && req.user.permissions.includes('manage_cars'));
  const vehicle = await vehiclesService.updateVehicle(req.params.id, isAdmin ? null : req.user.id, req.body);
  return success(res, vehicle, 'Vehicle updated');
});

/**
 * PATCH /api/v1/vehicles/:id/publish
 * Authenticated vendor — toggle publish state.
 */
const togglePublish = asyncHandler(async (req, res) => {
  if (typeof req.body.isPublished !== 'boolean') {
    return badRequest(res, 'isPublished (boolean) is required');
  }
  const vehicle = await vehiclesService.togglePublish(req.params.id, req.user.id, req.body.isPublished);
  const msg = vehicle.isPublished ? 'Vehicle published' : 'Vehicle unpublished';
  return success(res, vehicle, msg);
});

/**
 * POST /api/v1/vehicles/:id/block
 * Authenticated vendor or admin — add a blocked period.
 */
const blockPeriod = asyncHandler(async (req, res) => {
  const { start, end, reason } = req.body;
  if (!start || !end) {
    return badRequest(res, 'start and end dates are required');
  }

  const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];
  const isAdmin = ADMIN_ROLES.includes(req.user.role);

  if (!isAdmin) {
    const existing = await vehiclesService.getVehicleById(req.params.id);
    if (existing.vendorId?._id?.toString() !== req.user.id && existing.vendorId?.toString() !== req.user.id) {
      return forbidden(res, 'You do not own this vehicle');
    }
  }

  const vehicle = await vehiclesService.blockPeriod(req.params.id, start, end, reason);
  return success(res, vehicle, 'Period blocked successfully');
});

/**
 * GET /api/v1/vehicles/:id/price/self-drive
 * Public — calculate self-drive pricing.
 */
const calcSelfDrivePrice = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return badRequest(res, 'startDate and endDate are required');
  }
  const result = await vehiclesService.calculateSelfDrivePrice(req.params.id, startDate, endDate);
  return success(res, result, 'Self-drive price calculated');
});

/**
 * GET /api/v1/vehicles/:id/price/with-driver
 * Public — calculate with-driver pricing.
 */
const calcWithDriverPrice = asyncHandler(async (req, res) => {
  const { hours, estimatedKm } = req.query;
  if (!hours) {
    return badRequest(res, 'hours is required');
  }
  const result = await vehiclesService.calculateWithDriverPrice(req.params.id, hours, estimatedKm || 0);
  return success(res, result, 'With-driver price calculated');
});

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/vehicles/admin/all
 * Admin — list all vehicles with optional filters.
 */
const listAllVehicles = asyncHandler(async (req, res) => {
  const { vehicles, pagination } = await vehiclesService.listAdminVehicles(req.query);
  return res.status(200).json({ success: true, message: 'All vehicles retrieved', data: vehicles, pagination });
});

/**
 * POST /api/v1/vehicles/:id/approve
 * Admin — approve a vehicle listing.
 */
const approveVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.approveVehicle(req.params.id, req.user.id);
  return success(res, vehicle, 'Vehicle approved');
});

/**
 * POST /api/v1/vehicles/:id/reject
 * Admin — reject a vehicle listing.
 */
const rejectVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.rejectVehicle(req.params.id, req.user.id, req.body.reason);
  return success(res, vehicle, 'Vehicle rejected');
});

module.exports = {
  listVehicles,
  getVehicle,
  checkAvailability,
  createVehicle,
  listMyVehicles,
  updateVehicle,
  togglePublish,
  blockPeriod,
  calcSelfDrivePrice,
  calcWithDriverPrice,
  listAllVehicles,
  approveVehicle,
  rejectVehicle,
  deleteVehicle,
};
