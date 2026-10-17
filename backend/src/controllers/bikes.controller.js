const bikeService = require('../services/bikes.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, paginated, notFound, badRequest, forbidden } = require('../utils/response');

const getPublicBikes = asyncHandler(async (req, res) => {
  const { bikes, pagination } = await bikeService.listBikes(req.query);
  return paginated(res, bikes, pagination, 'Bikes retrieved successfully');
});

const getPublicBikeById = asyncHandler(async (req, res) => {
  const bike = await bikeService.getBikeById(req.params.id);
  return success(res, bike, 'Bike retrieved successfully');
});

const createBike = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN'].includes(req.user.role);
  const data = {
    ...req.body,
    status: isAdmin ? (req.body.status || 'APPROVED') : 'PENDING',
    isPublished: isAdmin ? (req.body.isPublished !== undefined ? req.body.isPublished : true) : false,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    approvedBy: isAdmin ? req.user.id : undefined,
    approvedAt: isAdmin ? new Date() : undefined,
  };
  const vendorId = isAdmin ? null : (req.user.vendorId || null);
  const bike = await bikeService.createBike(vendorId, data);
  return created(res, bike, 'Bike created successfully');
});

const deleteBike = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'].includes(req.user.role);
  await bikeService.deleteBike(req.params.id, isAdmin ? null : req.user.vendorId);
  return success(res, null, 'Bike deleted successfully');
});

const getVendorBikes = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendorId;
  if (!vendorId) return badRequest(res, 'Vendor profile not found for this user');
  const { bikes, pagination } = await bikeService.listVendorBikes(vendorId, req.query);
  return paginated(res, bikes, pagination, 'Your bikes retrieved successfully');
});

const updateBike = asyncHandler(async (req, res) => {
  const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN'].includes(req.user.role) || (req.user.permissions && req.user.permissions.includes('manage_bikes'));
  const vendorId = isAdmin ? null : (req.user.vendorId || req.user.id);
  const bike = await bikeService.updateBike(req.params.id, vendorId, req.body);
  return success(res, bike, 'Bike updated successfully');
});

const togglePublish = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendorId || null;
  const { isPublished } = req.body;
  if (isPublished === undefined) return badRequest(res, 'isPublished field is required');
  const bike = await bikeService.togglePublish(req.params.id, vendorId, isPublished);
  return success(res, bike, `Bike ${bike.isPublished ? 'published' : 'unpublished'} successfully`);
});

const getAdminBikes = asyncHandler(async (req, res) => {
  const { bikes, pagination } = await bikeService.listAdminBikes(req.query);
  return paginated(res, bikes, pagination, 'All bikes retrieved successfully');
});

const approveBike = asyncHandler(async (req, res) => {
  const bike = await bikeService.approveBike(req.params.id, req.user.id);
  return success(res, bike, 'Bike approved successfully');
});

const rejectBike = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const bike = await bikeService.rejectBike(req.params.id, req.user.id, reason);
  return success(res, bike, 'Bike rejected successfully');
});

const checkBikeAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) return badRequest(res, 'startDate and endDate are required');
  const result = await bikeService.checkAvailability(req.params.id, startDate, endDate);
  return success(res, result, 'Availability checked');
});

const getBikePriceEstimate = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) return badRequest(res, 'startDate and endDate are required');
  const pricing = await bikeService.calculateBikePrice(req.params.id, startDate, endDate);
  return success(res, pricing, 'Price calculated successfully');
});

module.exports = {
  getPublicBikes,
  getPublicBikeById,
  createBike,
  getVendorBikes,
  updateBike,
  togglePublish,
  getAdminBikes,
  approveBike,
  rejectBike,
  deleteBike,
  checkBikeAvailability,
  getBikePriceEstimate,
};
