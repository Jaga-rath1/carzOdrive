const svc = require('../services/settings.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getDiscountSettings = asyncHandler(async (req, res) => {
  const discount = await svc.getDiscountSettings();
  success(res, discount, 'Discount settings retrieved');
});

const updateDiscountSettings = asyncHandler(async (req, res) => {
  const discount = await svc.updateDiscountSettings(req.body, req.user?.id);
  success(res, discount, 'Discount settings updated successfully');
});

const getDriverSettings = asyncHandler(async (req, res) => {
  const driverSettings = await svc.getDriverSettings();
  success(res, driverSettings, 'Driver settings retrieved');
});

const updateDriverSettings = asyncHandler(async (req, res) => {
  const driverSettings = await svc.updateDriverSettings(req.body, req.user?.id);
  success(res, driverSettings, 'Driver pricing & registration settings updated successfully');
});

module.exports = {
  getDiscountSettings,
  updateDiscountSettings,
  getDriverSettings,
  updateDriverSettings,
};
