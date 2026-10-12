const { validationResult } = require('express-validator');
const packagesService = require('./packages.service');
const { success, created, paginated, badRequest, notFound } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];

// ─── Public ────────────────────────────────────────────────────────────────

const listPackages = asyncHandler(async (req, res) => {
  const result = await packagesService.listPackages(req.query);
  return paginated(res, result.packages, result.pagination, 'Packages retrieved');
});

const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await packagesService.getPackageById(req.params.id);
  return success(res, pkg, 'Package retrieved');
});

const checkAvailability = asyncHandler(async (req, res) => {
  const { date, pax } = req.query;
  if (!date) return badRequest(res, 'date query param is required');
  const result = await packagesService.checkDateAvailability(
    req.params.id,
    date,
    pax ? parseInt(pax, 10) : undefined
  );
  return success(res, result, 'Availability checked');
});

// ─── Vendor / Admin create ─────────────────────────────────────────────────

const createPackage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const isAdmin = ADMIN_ROLES.includes(req.user.role);
  // Admins can create platform packages (vendorId = null); vendors use their own vendorId
  const vendorId = isAdmin ? (req.body.vendorId || null) : req.user.vendorId;

  const pkg = await packagesService.createPackage(vendorId, req.body);
  return created(res, pkg, 'Package created');
});

// ─── Vendor mine ───────────────────────────────────────────────────────────

const listVendorPackages = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendorId;
  if (!vendorId) return badRequest(res, 'Vendor profile not found for this user');
  const result = await packagesService.listVendorPackages(vendorId, req.query);
  return paginated(res, result.packages, result.pagination, 'Vendor packages retrieved');
});

// ─── Update ────────────────────────────────────────────────────────────────

const updatePackage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const isAdmin = ADMIN_ROLES.includes(req.user.role);
  const vendorId = isAdmin ? null : req.user.vendorId;
  const pkg = await packagesService.updatePackage(req.params.id, vendorId, req.body, isAdmin);
  return success(res, pkg, 'Package updated');
});

// ─── Publish toggle ────────────────────────────────────────────────────────

const togglePublish = asyncHandler(async (req, res) => {
  const { isPublished } = req.body;
  if (typeof isPublished !== 'boolean') return badRequest(res, 'isPublished (boolean) is required');

  const isAdmin = ADMIN_ROLES.includes(req.user.role);
  const vendorId = isAdmin ? null : req.user.vendorId;
  const pkg = await packagesService.togglePublish(req.params.id, vendorId, isPublished, isAdmin);
  return success(res, pkg, `Package ${isPublished ? 'published' : 'unpublished'}`);
});

// ─── Admin all ─────────────────────────────────────────────────────────────

const listAdminPackages = asyncHandler(async (req, res) => {
  const result = await packagesService.listAdminPackages(req.query);
  return paginated(res, result.packages, result.pagination, 'All packages retrieved');
});

// ─── Approve / Reject ──────────────────────────────────────────────────────

const approvePackage = asyncHandler(async (req, res) => {
  const pkg = await packagesService.approvePackage(req.params.id, req.user.id);
  return success(res, pkg, 'Package approved');
});

const rejectPackage = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const pkg = await packagesService.rejectPackage(req.params.id, req.user.id, reason);
  return success(res, pkg, 'Package rejected');
});

module.exports = {
  listPackages,
  getPackageById,
  checkAvailability,
  createPackage,
  listVendorPackages,
  updatePackage,
  togglePublish,
  listAdminPackages,
  approvePackage,
  rejectPackage,
};
