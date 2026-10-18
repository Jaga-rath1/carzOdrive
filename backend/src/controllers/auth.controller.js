const authService = require('../services/auth.service');
const { success, created, badRequest } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  created(res, result, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  success(res, result, 'Login successful');
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.adminLogin(email, password);
  success(res, result, 'Admin login successful');
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
  await authService.initiatePasswordReset(req.body.email);
  const email = req.body.email;

  return success(
    res,
    { email },
    'A 6-digit OTP verification code has been dispatched to your email address.'
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;
  await authService.resetPassword({ token, email, password });
  success(res, null, 'Password reset successful. You can now sign in with your new password.');
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  success(res, null, 'Password changed');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  success(res, user, 'User profile retrieved');
});

module.exports = { register, login, adminLogin, refreshToken, logout, forgotPassword, resetPassword, changePassword, getMe };

