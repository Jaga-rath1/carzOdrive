const { User } = require('../models/user.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { buildSafeRegex } = require('../utils/regex');

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toSafeObject ? user.toSafeObject() : user;
}

async function updateProfile(userId, data) {
  const allowed = ['name', 'phone', 'drivingLicenseNumber', 'city', 'address', 'avatar'];
  const updates = {};
  allowed.forEach((key) => {
    if (data[key] !== undefined) updates[key] = data[key];
  });
  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toSafeObject ? user.toSafeObject() : user;
}

async function listUsers(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.role) filter.role = query.role;
  if (query.search) {
    const searchRegex = buildSafeRegex(query.search);
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return { users, pagination: buildPaginationMeta(total, page, limit) };
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

async function updateUserStatus(userId, status, adminId) {
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toSafeObject ? user.toSafeObject() : user;
}

module.exports = { getProfile, updateProfile, listUsers, getUserById, updateUserStatus };
