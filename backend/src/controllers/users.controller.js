const usersService = require('../services/users.service');
const { success, paginated } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const user = await usersService.getProfile(req.user.id);
  success(res, user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body);
  success(res, user, 'Profile updated');
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await usersService.listUsers(req.query);
  return paginated(res, result.users, result.pagination, 'Users retrieved');
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  success(res, user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await usersService.updateUserStatus(req.params.id, status, req.user.id);
  success(res, user, `User ${status.toLowerCase()}`);
});

module.exports = { getProfile, updateProfile, listUsers, getUserById, updateUserStatus };
