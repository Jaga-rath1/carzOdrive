const authService = require('./auth.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequest(res, 'Validation failed', errors.array());
    return false;
  }
  return true;
}

const register = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const result = await authService.register(req.body);
  created(res, result, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  success(res, result, 'Login successful');
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return badRequest(res, 'Refresh token required');
  const result = await authService.refresh(refreshToken);
  success(res, result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  success(res, null, 'Logged out');
});

const forgotPassword = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  await authService.initiatePasswordReset(req.body.email);
  // Always return success to avoid email enumeration
  success(res, null, 'If that email exists, a reset link has been sent');
});

const resetPassword = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  success(res, null, 'Password reset successful');
});

const changePassword = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  success(res, null, 'Password changed');
});

module.exports = { register, login, refreshToken, logout, forgotPassword, resetPassword, changePassword };
