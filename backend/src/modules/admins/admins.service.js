const { User, ROLES } = require('../auth/auth.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];

async function createAdmin(data, creatorId) {
  if (!ADMIN_ROLES.includes(data.role)) {
    const err = new Error('Invalid admin role');
    err.statusCode = 400;
    throw err;
  }
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const err = new Error('Email already exists');
    err.statusCode = 409;
    throw err;
  }
  const admin = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    role: data.role,
  });
  return admin.toSafeObject();
}

async function listAdmins(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { role: { $in: ADMIN_ROLES } };
  if (query.role && ADMIN_ROLES.includes(query.role)) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [{ name: new RegExp(query.search, 'i') }, { email: new RegExp(query.search, 'i') }];
  }
  const [admins, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return { admins, pagination: buildPaginationMeta(total, page, limit) };
}

async function updateAdminStatus(adminId, status) {
  const admin = await User.findOneAndUpdate(
    { _id: adminId, role: { $in: ADMIN_ROLES } },
    { status },
    { new: true }
  );
  if (!admin) {
    const err = new Error('Admin not found');
    err.statusCode = 404;
    throw err;
  }
  return admin.toSafeObject();
}

module.exports = { createAdmin, listAdmins, updateAdminStatus };
