const vehiclesService = require('./vehicles.service');
const { success, created, badRequest, notFound, forbidden } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

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

// ─── Vendor ───────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/vehicles
 * Authenticated vendor — create a new vehicle listing.
 */
const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.createVehicle(req.user.id, req.body);
  return created(res, vehicle, 'Vehicle created and pending approval');
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
 * Authenticated vendor — update own vehicle. Ownership is verified in service.
 */
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.updateVehicle(req.params.id, req.user.id, req.body);
  return success(res, vehicle, 'Vehicle updated');
});

/**
 * PATCH /api/v1/vehicles/:id/publish
 * Authenticated vendor — toggle publish state.
 * Body: { isPublished: Boolean }
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
 * Body: { start, end, reason? }
 */
const blockPeriod = asyncHandler(async (req, res) => {
  const { start, end, reason } = req.body;
  if (!start || !end) {
    return badRequest(res, 'start and end dates are required');
  }

  // If caller is a VENDOR, verify ownership inside service; admins skip ownership check
  const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];
  const isAdmin = ADMIN_ROLES.includes(req.user.role);

  if (!isAdmin) {
    // Fetch the vehicle to check ownership before blocking
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
 * Query params: startDate, endDate
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
 * Query params: hours, estimatedKm
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
 * Body: { reason? }
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
};
