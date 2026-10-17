const adminsService = require('../services/admins.service');
const { success, created, paginated } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getPermissionsList = asyncHandler(async (req, res) => {
  const result = adminsService.getPermissionsList();
  success(res, result, 'Permissions list retrieved');
});

const createAdmin = asyncHandler(async (req, res) => {
  const admin = await adminsService.createAdmin(req.body, req.user.id);
  created(res, admin, 'Admin user created successfully');
});

const listAdmins = asyncHandler(async (req, res) => {
  const result = await adminsService.listAdmins(req.query);
  paginated(res, result.admins, result.pagination, 'Admin users retrieved');
});

const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminsService.updateAdmin(req.params.id, req.body, req.user.id);
  success(res, admin, 'Admin user updated successfully');
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const admin = await adminsService.updateAdminStatus(req.params.id, status, req.user.id);
  success(res, admin, `Admin status updated to ${status}`);
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const result = await adminsService.deleteAdmin(req.params.id, req.user.id);
  success(res, result, 'Admin account removed');
});

module.exports = {
  getPermissionsList,
  createAdmin,
  listAdmins,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
};
