const { User, ROLES } = require('../models/user.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'OPERATIONS_ADMIN',
  'FINANCE_ADMIN',
  'SUPPORT_ADMIN',
  'STAFF_ADMIN',
];

const PERMISSIONS = [
  {
    id: 'manage_cars',
    name: 'Cars Fleet Management',
    description: 'Add cars, update specs, modify pricing, toggle availability, and delete vehicles',
    category: 'Fleet Operations',
  },
  {
    id: 'manage_bikes',
    name: 'Bikes Fleet Management',
    description: 'Add bikes/scooters, manage rental tariffs, and control inventory status',
    category: 'Fleet Operations',
  },
  {
    id: 'manage_drivers',
    name: 'Driver Verification & Approvals',
    description: 'Review chauffeur KYC, verify licenses, and approve or reject driver applicants',
    category: 'Chauffeur Operations',
  },
  {
    id: 'manage_bookings',
    name: 'Bookings & Reservations',
    description: 'Oversee vehicle reservations, update trip statuses, and manage bookings',
    category: 'Reservations',
  },
  {
    id: 'manage_staff',
    name: 'Staff & Access Control',
    description: 'Add team members, assign operational roles, and toggle module permissions',
    category: 'Administration',
  },
  {
    id: 'manage_rates',
    name: 'Pricing & Tour Packages',
    description: 'Manage rental price cards, security deposits, and tour itineraries',
    category: 'Financial & Commercial',
  },
  {
    id: 'manage_packages',
    name: 'Tours & Travels Packages',
    description: 'Curate Odisha tourism packages, circuits, itineraries, and pricing',
    category: 'Travel Operations',
  },
  {
    id: 'view_analytics',
    name: 'Executive Analytics & Reports',
    description: 'Access fleet performance, revenue reports, driver payouts, and platform KPIs',
    category: 'Financial & Commercial',
  },
];

const ROLE_DEFINITIONS = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Master unrestricted access to all modules, staff management, and system settings',
    defaultPermissions: [
      'manage_cars',
      'manage_bikes',
      'manage_drivers',
      'manage_bookings',
      'manage_staff',
      'manage_rates',
      'manage_packages',
      'view_analytics',
    ],
  },
  OPERATIONS_ADMIN: {
    label: 'Operations Manager',
    description: 'Oversees car & bike inventory, chauffeur registrations, packages and active trips',
    defaultPermissions: ['manage_cars', 'manage_bikes', 'manage_drivers', 'manage_bookings', 'manage_packages'],
  },
  SUPPORT_ADMIN: {
    label: 'Support & Verification Specialist',
    description: 'Driver approval processing and customer booking support',
    defaultPermissions: ['manage_drivers', 'manage_bookings'],
  },
  FINANCE_ADMIN: {
    label: 'Finance & Analytics Admin',
    description: 'Monitors revenues, financial reports, rate structures, and payment reconciliations',
    defaultPermissions: ['view_analytics', 'manage_rates', 'manage_bookings'],
  },
  STAFF_ADMIN: {
    label: 'Custom Staff / Sub-Admin',
    description: 'Tailored staff account with specific granular permissions assigned by administrator',
    defaultPermissions: [],
  },
};

function getPermissionsList() {
  return {
    permissions: PERMISSIONS,
    roles: ROLE_DEFINITIONS,
  };
}

async function createAdmin(data, creatorId) {
  if (!ADMIN_ROLES.includes(data.role)) {
    const err = new Error(`Invalid admin role: ${data.role}`);
    err.statusCode = 400;
    throw err;
  }
  const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
  if (existing) {
    const err = new Error('Email already registered for another user');
    err.statusCode = 409;
    throw err;
  }

  let permissions = Array.isArray(data.permissions) ? data.permissions : [];
  if (permissions.length === 0 && ROLE_DEFINITIONS[data.role]) {
    permissions = [...ROLE_DEFINITIONS[data.role].defaultPermissions];
  }
  if (data.role === 'SUPER_ADMIN') {
    permissions = [...ROLE_DEFINITIONS.SUPER_ADMIN.defaultPermissions];
  }

  const admin = await User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password,
    phone: data.phone ? data.phone.trim() : undefined,
    role: data.role,
    permissions,
    status: data.status || 'ACTIVE',
  });

  return admin.toSafeObject ? admin.toSafeObject() : admin;
}

async function listAdmins(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = { role: { $in: ADMIN_ROLES } };

  if (query.role && ADMIN_ROLES.includes(query.role)) {
    filter.role = query.role;
  }
  if (query.status && ['ACTIVE', 'SUSPENDED', 'PENDING'].includes(query.status)) {
    filter.status = query.status;
  }
  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, 'i') },
      { email: new RegExp(query.search, 'i') },
      { phone: new RegExp(query.search, 'i') },
    ];
  }

  const [admins, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    admins: admins.map((a) => (a.toSafeObject ? a.toSafeObject() : a)),
    pagination: buildPaginationMeta(total, page, limit),
  };
}

async function updateAdmin(adminId, data, currentUserId) {
  const admin = await User.findOne({ _id: adminId, role: { $in: ADMIN_ROLES } });
  if (!admin) {
    const err = new Error('Admin user not found');
    err.statusCode = 404;
    throw err;
  }

  if (admin.role === 'SUPER_ADMIN' && data.role && data.role !== 'SUPER_ADMIN') {
    const superCount = await User.countDocuments({ role: 'SUPER_ADMIN', status: 'ACTIVE' });
    if (superCount <= 1) {
      const err = new Error('Cannot change role: platform must retain at least one active Super Admin');
      err.statusCode = 400;
      throw err;
    }
  }

  if (data.name) admin.name = data.name.trim();
  if (data.phone !== undefined) admin.phone = data.phone ? data.phone.trim() : '';
  if (data.role && ADMIN_ROLES.includes(data.role)) admin.role = data.role;
  if (Array.isArray(data.permissions)) {
    admin.permissions = data.permissions;
  }
  if (data.status && ['ACTIVE', 'SUSPENDED'].includes(data.status)) {
    if (adminId.toString() === currentUserId && data.status === 'SUSPENDED') {
      const err = new Error('You cannot suspend your own account');
      err.statusCode = 400;
      throw err;
    }
    admin.status = data.status;
  }
  if (data.password && data.password.trim().length >= 8) {
    admin.password = data.password.trim();
  }

  await admin.save();
  return admin.toSafeObject ? admin.toSafeObject() : admin;
}

async function updateAdminStatus(adminId, status, currentUserId) {
  if (adminId.toString() === currentUserId && status === 'SUSPENDED') {
    const err = new Error('You cannot suspend your own account');
    err.statusCode = 400;
    throw err;
  }

  const admin = await User.findOne({ _id: adminId, role: { $in: ADMIN_ROLES } });
  if (!admin) {
    const err = new Error('Admin user not found');
    err.statusCode = 404;
    throw err;
  }

  if (admin.role === 'SUPER_ADMIN' && status === 'SUSPENDED') {
    const superCount = await User.countDocuments({ role: 'SUPER_ADMIN', status: 'ACTIVE' });
    if (superCount <= 1) {
      const err = new Error('Cannot suspend the sole active Super Admin');
      err.statusCode = 400;
      throw err;
    }
  }

  admin.status = status;
  await admin.save();
  return admin.toSafeObject ? admin.toSafeObject() : admin;
}

async function deleteAdmin(adminId, currentUserId) {
  if (adminId.toString() === currentUserId) {
    const err = new Error('You cannot delete your own account');
    err.statusCode = 400;
    throw err;
  }

  const admin = await User.findOne({ _id: adminId, role: { $in: ADMIN_ROLES } });
  if (!admin) {
    const err = new Error('Admin user not found');
    err.statusCode = 404;
    throw err;
  }

  if (admin.role === 'SUPER_ADMIN') {
    const superCount = await User.countDocuments({ role: 'SUPER_ADMIN' });
    if (superCount <= 1) {
      const err = new Error('Cannot delete the sole Super Admin account');
      err.statusCode = 400;
      throw err;
    }
  }

  await User.findByIdAndDelete(adminId);
  return { success: true, message: 'Admin account removed successfully' };
}

module.exports = {
  createAdmin,
  listAdmins,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
  getPermissionsList,
  PERMISSIONS,
  ROLE_DEFINITIONS,
  ADMIN_ROLES,
};
