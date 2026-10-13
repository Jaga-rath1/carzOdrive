const usersService = require('./users.service');
const { success, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const getProfile = asyncHandler(async (req, res) => {
  const user = await usersService.getProfile(req.user.id);
  success(res, user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());
  const user = await usersService.updateProfile(req.user.id, req.body);
  success(res, user, 'Profile updated');
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await usersService.listUsers(req.query);
  res.json({ success: true, data: result.users, pagination: result.pagination });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  success(res, user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['ACTIVE', 'SUSPENDED'].includes(status)) return badRequest(res, 'Invalid status');
  const user = await usersService.updateUserStatus(req.params.id, status, req.user.id);
  success(res, user, `User ${status.toLowerCase()}`);
});

module.exports = { getProfile, updateProfile, listUsers, getUserById, updateUserStatus };
