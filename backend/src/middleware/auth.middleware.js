const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { unauthorized, forbidden } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    return next();
  } catch (err) {
    return unauthorized(res, err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token');
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    if (roles.length && !roles.includes(req.user.role)) {
      return forbidden(res, 'Insufficient permissions');
    }
    return next();
  };
}

// Middleware that checks if user owns the resource or is an admin role
function ownerOrAdmin(paramKey = 'id') {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'].includes(req.user.role);
    const isOwner = req.user.id === req.params[paramKey];
    if (!isAdmin && !isOwner) return forbidden(res);
    return next();
  };
}

module.exports = { authenticate, authorize, ownerOrAdmin };
