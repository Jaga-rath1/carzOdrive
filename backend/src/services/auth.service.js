const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models/user.model');
const { env } = require('../config/env');
const { sendPasswordResetOtp } = require('../utils/mailer');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'STAFF_ADMIN', 'ADMIN', 'FLEET_MANAGER'];

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
}

function buildTokenPayload(user) {
  let perms = user.permissions || [];
  if (user.role === 'SUPER_ADMIN') {
    perms = [
      'manage_cars',
      'manage_bikes',
      'manage_drivers',
      'manage_bookings',
      'manage_staff',
      'manage_rates',
      'view_analytics',
      'manage_packages',
    ];
  }
  return {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
    permissions: perms,
  };
}

async function register(data) {
  const cleanEmail = (data.email || '').toLowerCase().trim();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    const err = new Error('An account with this email already exists. Please sign in instead.');
    err.statusCode = 409;
    throw err;
  }
  const user = await User.create({
    name: (data.name || '').trim(),
    email: cleanEmail,
    password: data.password,
    phone: data.phone ? String(data.phone).trim() : undefined,
    role: 'CUSTOMER',
  });
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  return { user: user.toSafeObject(), accessToken, refreshToken };
}

async function login(identifier, password, options = {}) {
  if (!identifier || !password) {
    const err = new Error('Please enter both your email/phone and password');
    err.statusCode = 400;
    throw err;
  }

  const raw = String(identifier).trim();
  const cleanEmail = raw.toLowerCase();
  const digitsOnly = raw.replace(/[^0-9]/g, '');

  const queryOr = [{ email: cleanEmail }];
  if (digitsOnly.length >= 10) {
    const last10 = digitsOnly.slice(-10);
    queryOr.push({ phone: last10 });
    queryOr.push({ phone: `+91${last10}` });
  }

  const user = await User.findOne({ $or: queryOr }).select('+password +refreshToken');
  if (!user) {
    const err = new Error(`No registered account found with "${raw}". Please verify your email or click "Create Account".`);
    err.statusCode = 401;
    throw err;
  }

  if (user.status === 'SUSPENDED') {
    const err = new Error('Your account is currently suspended. Please contact CARZODRIVE support.');
    err.statusCode = 403;
    throw err;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    const err = new Error('Incorrect password. Please re-check your password or click "Forgot Password" to reset it.');
    err.statusCode = 401;
    throw err;
  }

  // If this is regular customer login, strictly reject administrator accounts
  if (!options.allowAdmin && ADMIN_ROLES.includes(user.role)) {
    const err = new Error('Access Denied: This login page is exclusively for CARZODRIVE Customers. Administrators must sign in through the Admin Portal at /admin/login.');
    err.statusCode = 403;
    throw err;
  }

  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  return { user: user.toSafeObject(), accessToken, refreshToken };
}


async function refresh(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, env.jwt.refreshSecret);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    const err = new Error('Refresh token invalid');
    err.statusCode = 401;
    throw err;
  }
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const newRefresh = signRefreshToken(payload);
  user.refreshToken = newRefresh;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken: newRefresh };
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
}

async function initiatePasswordReset(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    const err = new Error(`No registered account found with email: ${cleanEmail}. Please check the email address or create a new account.`);
    err.statusCode = 404;
    throw err;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');

  user.passwordResetToken = hashed;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const mailResult = await sendPasswordResetOtp({
    email: user.email,
    name: user.name,
    otp,
  });

  return { otp, email: user.email, mailResult };
}

async function resetPassword({ token, email, password }) {
  if (!token) {
    const err = new Error('Verification OTP is required');
    err.statusCode = 400;
    throw err;
  }

  const cleanToken = String(token).trim();
  const hashed = crypto.createHash('sha256').update(cleanToken).digest('hex');

  const query = {
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  };

  if (email) {
    query.email = email.toLowerCase().trim();
  }

  const user = await User.findOne(query).select('+password');
  if (!user) {
    const err = new Error('Invalid or expired OTP verification code. Please request a new code.');
    err.statusCode = 400;
    throw err;
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();
  return true;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }
  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();
  return true;
}

async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toSafeObject ? user.toSafeObject() : user;
}

async function adminLogin(identifier, password) {
  const result = await login(identifier, password, { allowAdmin: true });
  const user = result.user;
  if (!ADMIN_ROLES.includes(user.role)) {
    const err = new Error('Access Denied: This login portal is strictly reserved for CARZODRIVE Administrators. Regular customer accounts must sign in at /login.');
    err.statusCode = 403;
    throw err;
  }
  return result;
}

module.exports = {
  register,
  login,
  adminLogin,
  refresh,
  logout,
  initiatePasswordReset,
  resetPassword,
  changePassword,
  getUserById,
};

