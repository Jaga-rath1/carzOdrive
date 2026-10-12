const adminsService = require('./admins.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const createAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());
  const admin = await adminsService.createAdmin(req.body, req.user.id);
  created(res, admin, 'Admin created');
});

const listAdmins = asyncHandler(async (req, res) => {
  const result = await adminsService.listAdmins(req.query);
  res.json({ success: true, data: result.admins, pagination: result.pagination });
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['ACTIVE', 'SUSPENDED'].includes(status)) return badRequest(res, 'Invalid status');
  const admin = await adminsService.updateAdminStatus(req.params.id, status);
  success(res, admin, `Admin ${status.toLowerCase()}`);
});

module.exports = { createAdmin, listAdmins, updateAdminStatus };
