const driverService = require('./drivers.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, created, paginated, badRequest } = require('../../utils/response');

const applyAsDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.applyAsDriver(req.user.id, req.body);
  return created(res, driver, 'Driver application submitted successfully');
});

const getMyProfile = asyncHandler(async (req, res) => {
  const driver = await driverService.getMyDriverProfile(req.user.id);
  return success(res, driver, 'Driver profile retrieved successfully');
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const driver = await driverService.getMyDriverProfile(req.user.id);
  const updated = await driverService.updateDriverProfile(String(driver._id), req.user.id, req.body);
  return success(res, updated, 'Driver profile updated successfully');
});

const listDrivers = asyncHandler(async (req, res) => {
  const { drivers, pagination } = await driverService.listDrivers(req.query);
  return paginated(res, drivers, pagination, 'Drivers retrieved successfully');
});

const getAvailableDrivers = asyncHandler(async (req, res) => {
  const { city, startDate, endDate } = req.query;
  const drivers = await driverService.getAvailableDrivers(city, startDate, endDate);
  return success(res, drivers, 'Available drivers retrieved successfully');
});

const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);
  return success(res, driver, 'Driver retrieved successfully');
});

const approveDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.approveDriver(req.params.id, req.user.id);
  return success(res, driver, 'Driver approved successfully');
});

const rejectDriver = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const driver = await driverService.rejectDriver(req.params.id, req.user.id, reason);
  return success(res, driver, 'Driver rejected successfully');
});

const suspendDriver = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const driver = await driverService.suspendDriver(req.params.id, req.user.id, reason);
  return success(res, driver, 'Driver suspended successfully');
});

module.exports = {
  applyAsDriver,
  getMyProfile,
  updateMyProfile,
  listDrivers,
  getAvailableDrivers,
  getDriverById,
  approveDriver,
  rejectDriver,
  suspendDriver,
};
