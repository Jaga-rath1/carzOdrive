const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('./auth.model');
const { env } = require('../../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
}

function buildTokenPayload(user) {
  return { id: user._id.toString(), role: user.role, email: user.email };
}

async function register(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
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

async function login(email, password) {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  if (user.status === 'SUSPENDED') {
    const err = new Error('Account suspended');
    err.statusCode = 403;
    throw err;
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
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
  const user = await User.findOne({ email });
  if (!user) return; // Don't reveal if email exists
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetToken = hashed;
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 min
  await user.save({ validateBeforeSave: false });
  // In production: send email with reset link containing `token`
  return token;
}

async function resetPassword(token, newPassword) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');
  if (!user) {
    const err = new Error('Token is invalid or has expired');
    err.statusCode = 400;
    throw err;
  }
  user.password = newPassword;
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

module.exports = { register, login, refresh, logout, initiatePasswordReset, resetPassword, changePassword };
