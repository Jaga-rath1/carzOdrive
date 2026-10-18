/**
 * CarzoDrive Platform System-Wide Constants
 * Production-grade enums and configuration tokens
 */

const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  OPERATIONS_ADMIN: 'OPERATIONS_ADMIN',
  FINANCE_ADMIN: 'FINANCE_ADMIN',
  SUPPORT_ADMIN: 'SUPPORT_ADMIN',
  STAFF_ADMIN: 'STAFF_ADMIN',
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
  VENDOR: 'VENDOR',
});

const PERMISSIONS = Object.freeze([
  { id: 'manage_cars', label: 'Manage Cars Fleet', description: 'Add, update, publish and deactivate rental cars' },
  { id: 'manage_bikes', label: 'Manage Bikes Fleet', description: 'Add, update and oversee scooty & bike inventory' },
  { id: 'manage_drivers', label: 'Manage Drivers & Chauffeurs', description: 'Approve, verify, audit and assign driver pilots' },
  { id: 'manage_packages', label: 'Manage Tour Packages', description: 'Create and update Odisha tour itineraries and pricing' },
  { id: 'manage_bookings', label: 'Manage Bookings & Vouchers', description: 'Review, modify and dispatch customer reservations' },
  { id: 'manage_staff', label: 'Manage Staff & Roles', description: 'Grant admin panel access and configure granular permissions' },
  { id: 'manage_rates', label: 'Manage Rates & Pricing', description: 'Configure daily rates, seasonal markups, and security deposits' },
  { id: 'manage_vendors', label: 'Manage Vendors & Hosts', description: 'Review, verify and onboard vehicle hosts and partners' },
  { id: 'approve_vendor_fleet', label: 'Approve Vendor Fleet', description: 'Audit RC, insurance and approve vendor cars and bikes' },
  { id: 'view_analytics', label: 'View Financial Analytics', description: 'Access revenue reports, transaction logs and performance metrics' },
]);

const SERVICE_TYPES = Object.freeze({
  SELF_DRIVE_CAR: 'self-drive-car',
  CAR_WITH_DRIVER: 'car-with-driver',
  SELF_DRIVE_BIKE: 'self-drive-bike',
  DRIVER_ONLY: 'driver-only',
  TOUR_PACKAGE: 'tour-packages',
});

const BOOKING_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ASSIGNED: 'ASSIGNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
});

const PAYMENT_MODES = Object.freeze({
  FULL: 'full',
  PARTIAL: 'partial',
  OFFLINE: 'offline',
});

const PAYMENT_STATUSES = Object.freeze({
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  OFFLINE_PENDING: 'OFFLINE_PENDING',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
});

const PAGINATION_DEFAULTS = Object.freeze({
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
});

module.exports = {
  ROLES,
  PERMISSIONS,
  SERVICE_TYPES,
  BOOKING_STATUSES,
  PAYMENT_MODES,
  PAYMENT_STATUSES,
  PAGINATION_DEFAULTS,
};
