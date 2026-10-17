const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { unauthorized, forbidden } = require('../utils/response');

const PERMISSION_ROLES_MAP = {
  manage_cars: ['OPERATIONS_ADMIN'],
  manage_bikes: ['OPERATIONS_ADMIN'],
  manage_drivers: ['OPERATIONS_ADMIN', 'SUPPORT_ADMIN'],
  manage_bookings: ['OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN'],
  manage_packages: ['OPERATIONS_ADMIN', 'SUPER_ADMIN'],
  manage_staff: ['SUPER_ADMIN'],
  manage_rates: ['FINANCE_ADMIN', 'OPERATIONS_ADMIN'],
  view_analytics: ['FINANCE_ADMIN', 'OPERATIONS_ADMIN'],
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
    if (!req.user.permissions) {
      req.user.permissions = [];
    }
    return next();
  } catch (err) {
    return unauthorized(res, err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token');
  }
}

function authorize(...rolesOrPerms) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    // Super admin has master access across all platform operations
    if (req.user.role === 'SUPER_ADMIN') return next();

    if (!rolesOrPerms.length) return next();

    // 1. Direct role match
    if (rolesOrPerms.includes(req.user.role)) return next();

    // 2. Direct permission match
    const userPerms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (rolesOrPerms.some((item) => userPerms.includes(item))) return next();

    // 3. Permission-to-Role mapped check
    for (const perm of userPerms) {
      const allowedRoles = PERMISSION_ROLES_MAP[perm] || [];
      if (allowedRoles.some((r) => rolesOrPerms.includes(r))) {
        return next();
      }
    }

    return forbidden(res, 'Insufficient permissions');
  };
}

// Middleware that checks if user owns the resource or is an admin role
function ownerOrAdmin(paramKey = 'id') {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    const isAdmin = [
      'SUPER_ADMIN',
      'OPERATIONS_ADMIN',
      'FINANCE_ADMIN',
      'SUPPORT_ADMIN',
      'STAFF_ADMIN',
    ].includes(req.user.role);
    const isOwner = req.user.id === req.params[paramKey];
    if (!isAdmin && !isOwner) return forbidden(res);
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
  } catch {
    // Continue as unauthenticated guest
  }
  return next();
}

module.exports = { authenticate, optionalAuth, authorize, ownerOrAdmin };
