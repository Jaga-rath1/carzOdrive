const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { unauthorized, forbidden } = require('../utils/response');

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'OPERATIONS_ADMIN',
  'FINANCE_ADMIN',
  'SUPPORT_ADMIN',
  'STAFF_ADMIN',
  'ADMIN',
  'FLEET_MANAGER',
];

const ROLE_PERMISSIONS_MAP = {
  SUPER_ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_staff',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
    'manage_settings',
  ],
  ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_staff',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
    'manage_settings',
  ],
  OPERATIONS_ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
  ],
  FINANCE_ADMIN: [
    'manage_bookings',
    'manage_rates',
    'view_analytics',
  ],
  SUPPORT_ADMIN: [
    'manage_bookings',
    'manage_drivers',
  ],
  STAFF_ADMIN: [],
  VENDOR: ['manage_vendor_fleet'],
  DRIVER: ['manage_driver_rides'],
  CUSTOMER: [],
};

const PERMISSION_ROLES_MAP = {
  manage_cars: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  manage_bikes: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  manage_drivers: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'ADMIN'],
  manage_bookings: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'ADMIN'],
  manage_packages: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  manage_staff: ['SUPER_ADMIN', 'ADMIN'],
  manage_rates: ['SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  view_analytics: ['SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  manage_vendors: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  approve_vendor_fleet: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'ADMIN'],
  manage_settings: ['SUPER_ADMIN', 'ADMIN'],
};

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;

    // Reject suspended accounts immediately
    if (req.user.status === 'SUSPENDED') {
      return forbidden(res, 'Account suspended. Please contact CARZODRIVE administration.');
    }

    // Enterprise RBAC: Hydrate permissions from role + token
    const userRole = (req.user.role || '').toUpperCase();
    const roleDefaultPerms = ROLE_PERMISSIONS_MAP[userRole] || [];
    const explicitPerms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    req.user.permissions = Array.from(new Set([...roleDefaultPerms, ...explicitPerms]));

    return next();
  } catch (err) {
    return unauthorized(res, err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token');
  }
}

function authorize(...rolesOrPerms) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    const userRole = (req.user.role || '').toUpperCase();

    // 1. Super Admin has unrestricted platform master access
    if (userRole === 'SUPER_ADMIN') return next();

    if (!rolesOrPerms.length) return next();

    // Normalize targets to uppercase
    const targets = rolesOrPerms.map((t) => String(t).trim());

    // 2. Generic 'ADMIN' match for any admin role
    if (targets.some((t) => t.toUpperCase() === 'ADMIN') && ADMIN_ROLES.includes(userRole)) {
      return next();
    }

    // 3. Direct role match (case-insensitive)
    if (targets.some((r) => r.toUpperCase() === userRole)) {
      return next();
    }

    // 4. Direct permission match from hydrated permissions
    const userPerms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (targets.some((item) => userPerms.includes(item))) {
      return next();
    }

    // 5. Bidirectional Mapping: If endpoint accepts specific roles, check if user's permissions map to those roles
    for (const perm of userPerms) {
      const allowedRoles = PERMISSION_ROLES_MAP[perm] || [];
      if (allowedRoles.some((r) => targets.some((target) => target.toUpperCase() === r.toUpperCase()))) {
        return next();
      }
    }

    return forbidden(res, 'Insufficient permissions. You do not have access to this resource.');
  };
}

// Middleware that checks if user owns the resource or is an admin role
function ownerOrAdmin(paramKey = 'id') {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    const userRole = (req.user.role || '').toUpperCase();
    const isAdmin = ADMIN_ROLES.includes(userRole);
    const isOwner = req.user.id === req.params[paramKey];
    if (!isAdmin && !isOwner) return forbidden(res, 'Access restricted to resource owner or platform administrators.');
    return next();
  };
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    const userRole = (req.user.role || '').toUpperCase();
    const roleDefaultPerms = ROLE_PERMISSIONS_MAP[userRole] || [];
    const explicitPerms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    req.user.permissions = Array.from(new Set([...roleDefaultPerms, ...explicitPerms]));
  } catch {
    // Continue as unauthenticated guest
  }
  return next();
}

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  ownerOrAdmin,
  ADMIN_ROLES,
  ROLE_PERMISSIONS_MAP,
  PERMISSION_ROLES_MAP,
};

