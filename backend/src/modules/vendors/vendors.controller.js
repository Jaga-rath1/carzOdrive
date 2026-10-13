const vendorsService = require('./vendors.service');
const { success, created, paginated, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const applyAsVendor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const vendor = await vendorsService.applyAsVendor(req.user.id, req.body);
  return created(res, vendor, 'Vendor application submitted successfully');
});

const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorsService.getMyVendorProfile(req.user.id);
  return success(res, vendor, 'Vendor profile retrieved');
});

const updateVendorProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const vendor = await vendorsService.updateVendorProfile(req.user.id, req.body);
  return success(res, vendor, 'Vendor profile updated');
});

const listVendors = asyncHandler(async (req, res) => {
  const result = await vendorsService.listVendors(req.query);
  return paginated(res, result.vendors, result.pagination, 'Vendors retrieved');
});

const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await vendorsService.getVendorById(req.params.id);
  return success(res, vendor, 'Vendor retrieved');
});

const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorsService.approveVendor(req.params.id, req.user.id);
  return success(res, vendor, 'Vendor approved');
});

const rejectVendor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const { reason } = req.body;
  const vendor = await vendorsService.rejectVendor(req.params.id, req.user.id, reason);
  return success(res, vendor, 'Vendor rejected');
});

const suspendVendor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());

  const { reason } = req.body;
  const vendor = await vendorsService.suspendVendor(req.params.id, req.user.id, reason);
  return success(res, vendor, 'Vendor suspended');
});

const reactivateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorsService.reactivateVendor(req.params.id, req.user.id);
  return success(res, vendor, 'Vendor reactivated');
});

module.exports = {
  applyAsVendor,
  getMyVendorProfile,
  updateVendorProfile,
  listVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  suspendVendor,
  reactivateVendor,
};
