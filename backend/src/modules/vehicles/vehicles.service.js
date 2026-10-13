const { Vehicle } = require('./vehicles.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

/**
 * Create a vehicle for a vendor.
 */
async function createVehicle(vendorId, data) {
  const vehicle = await Vehicle.create({ ...data, vendorId, status: 'PENDING', isPublished: false });
  return vehicle;
}

/**
 * Public search — only APPROVED + isPublished + isAvailable vehicles.
 * Supports filter: city, vehicleType, seats (min), serviceType, fuelType, transmission.
 */
async function listVehicles(query) {
  const { page, limit, skip } = getPagination(query);

  const filter = {
    status: 'APPROVED',
    isPublished: true,
    isAvailable: true,
  };

  if (query.city) filter['location.city'] = { $regex: query.city, $options: 'i' };
  if (query.vehicleType) filter.vehicleType = query.vehicleType;
  if (query.seats) filter.seats = { $gte: parseInt(query.seats, 10) };
  if (query.serviceType) filter.serviceTypes = query.serviceType;
  if (query.fuelType) filter.fuelType = query.fuelType;
  if (query.transmission) filter.transmission = query.transmission;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .populate('vendorId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Vehicle.countDocuments(filter),
  ]);

  return { vehicles, pagination: buildPaginationMeta(total, page, limit) };
}

/**
 * List all vehicles belonging to a specific vendor.
 */
async function listVendorVehicles(vendorId, query) {
  const { page, limit, skip } = getPagination(query);

  const filter = { vendorId };
  if (query.status) filter.status = query.status;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Vehicle.countDocuments(filter),
  ]);

  return { vehicles, pagination: buildPaginationMeta(total, page, limit) };
}

/**
 * Admin list — all vehicles, filterable by status and/or vendorId.
 */
async function listAdminVehicles(query) {
  const { page, limit, skip } = getPagination(query);

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.vendorId) filter.vendorId = query.vendorId;
  if (query.city) filter['location.city'] = { $regex: query.city, $options: 'i' };
  if (query.vehicleType) filter.vehicleType = query.vehicleType;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .populate('vendorId', 'name email phone')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Vehicle.countDocuments(filter),
  ]);

  return { vehicles, pagination: buildPaginationMeta(total, page, limit) };
}

/**
 * Get a single vehicle by id, populating vendor info.
 */
async function getVehicleById(vehicleId) {
  const vehicle = await Vehicle.findById(vehicleId).populate('vendorId', 'name email phone');
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }
  return vehicle;
}

/**
 * Update a vehicle — verifies the caller owns the vehicle (vendorId match).
 * Pass vendorId = null to skip ownership check (admin use case).
 */
async function updateVehicle(vehicleId, vendorId, data) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  if (vendorId !== null && vehicle.vendorId?.toString() !== vendorId.toString()) {
    const err = new Error('You do not own this vehicle');
    err.statusCode = 403;
    throw err;
  }

  // Prevent vendors from changing approval-controlled fields
  const restricted = ['status', 'approvedBy', 'approvedAt', 'isPublished', 'vendorId'];
  restricted.forEach((field) => delete data[field]);

  Object.assign(vehicle, data);
  await vehicle.save();
  return vehicle;
}

/**
 * Approve a vehicle — sets status APPROVED. Vehicle can now be published.
 */
async function approveVehicle(vehicleId, adminId) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }
  if (vehicle.status === 'APPROVED') {
    const err = new Error('Vehicle is already approved');
    err.statusCode = 400;
    throw err;
  }

  vehicle.status = 'APPROVED';
  vehicle.approvedBy = adminId;
  vehicle.approvedAt = new Date();
  vehicle.rejectionReason = undefined;
  await vehicle.save();
  return vehicle;
}

/**
 * Reject a vehicle — sets status REJECTED and stores the reason.
 */
async function rejectVehicle(vehicleId, adminId, reason) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  vehicle.status = 'REJECTED';
  vehicle.approvedBy = adminId;
  vehicle.approvedAt = new Date();
  vehicle.rejectionReason = reason || 'No reason provided';
  vehicle.isPublished = false;
  await vehicle.save();
  return vehicle;
}

/**
 * Toggle published state — only APPROVED vehicles may be published.
 */
async function togglePublish(vehicleId, vendorId, isPublished) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  if (vehicle.vendorId?.toString() !== vendorId.toString()) {
    const err = new Error('You do not own this vehicle');
    err.statusCode = 403;
    throw err;
  }

  if (isPublished && vehicle.status !== 'APPROVED') {
    const err = new Error('Only approved vehicles can be published');
    err.statusCode = 400;
    throw err;
  }

  vehicle.isPublished = isPublished;
  await vehicle.save();
  return vehicle;
}

/**
 * Add a blocked period to a vehicle.
 */
async function blockPeriod(vehicleId, start, end, reason) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate >= endDate) {
    const err = new Error('Block period start must be before end');
    err.statusCode = 400;
    throw err;
  }

  vehicle.blockedPeriods.push({ start: startDate, end: endDate, reason });
  await vehicle.save();
  return vehicle;
}

/**
 * Check availability for a vehicle between startDate and endDate.
 * Returns { available: Boolean, conflicts: [] }
 */
async function checkAvailability(vehicleId, startDate, endDate) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check blocked periods
  const blockedConflict = vehicle.blockedPeriods.find(
    (period) => start < period.end && end > period.start
  );
  if (blockedConflict) {
    return {
      available: false,
      reason: 'blocked',
      conflict: { start: blockedConflict.start, end: blockedConflict.end, reason: blockedConflict.reason },
    };
  }

  // Check active bookings
  let Booking;
  try {
    Booking = require('../bookings/bookings.model').Booking;
  } catch {
    // Bookings module not yet available — skip booking conflict check
    return { available: true };
  }

  const bookingConflict = await Booking.findOne({
    vehicleId,
    status: { $in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
    startDate: { $lt: end },
    endDate: { $gt: start },
  });

  if (bookingConflict) {
    return {
      available: false,
      reason: 'booked',
      conflict: { start: bookingConflict.startDate, end: bookingConflict.endDate },
    };
  }

  return { available: true };
}

/**
 * Calculate self-drive price for a vehicle over a date range.
 * Returns { days, hours, baseAmount, securityDeposit, total }
 */
async function calculateSelfDrivePrice(vehicleId, startDate, endDate) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  const pricing = vehicle.pricing?.selfDrive || {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end - start;

  if (durationMs <= 0) {
    const err = new Error('End date must be after start date');
    err.statusCode = 400;
    throw err;
  }

  const totalHours = durationMs / (1000 * 60 * 60);
  const days = Math.floor(totalHours / 24);
  const remainingHours = Math.ceil(totalHours % 24);

  let baseAmount = 0;

  if (days >= 30 && pricing.monthly) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    baseAmount = months * pricing.monthly;
    if (remainingDays > 0 && pricing.daily) baseAmount += remainingDays * pricing.daily;
    else if (remainingDays > 0 && pricing.hourly) baseAmount += remainingDays * 24 * pricing.hourly;
  } else if (days >= 7 && pricing.weekly) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    baseAmount = weeks * pricing.weekly;
    if (remainingDays > 0 && pricing.daily) baseAmount += remainingDays * pricing.daily;
    else if (remainingDays > 0 && pricing.hourly) baseAmount += remainingDays * 24 * pricing.hourly;
  } else if (days >= 1 && pricing.daily) {
    baseAmount = days * pricing.daily;
    if (remainingHours > 0 && pricing.hourly) baseAmount += remainingHours * pricing.hourly;
  } else if (pricing.hourly) {
    baseAmount = Math.ceil(totalHours) * pricing.hourly;
  }

  const securityDeposit = vehicle.securityDeposit || 0;
  const total = baseAmount + securityDeposit;

  return { days, hours: Math.ceil(totalHours), baseAmount, securityDeposit, total };
}

/**
 * Calculate with-driver price.
 * Returns { hours, baseAmount, perKmAmount, total }
 */
async function calculateWithDriverPrice(vehicleId, hours, estimatedKm) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  const pricing = vehicle.pricing?.withDriver || {};
  const hrs = parseFloat(hours) || 0;
  const km = parseFloat(estimatedKm) || 0;

  let baseAmount = 0;
  if (hrs >= 24 && pricing.daily) {
    const days = Math.floor(hrs / 24);
    const remainingHours = hrs % 24;
    baseAmount = days * pricing.daily;
    if (remainingHours > 0 && pricing.hourly) baseAmount += remainingHours * pricing.hourly;
  } else if (pricing.hourly) {
    baseAmount = hrs * pricing.hourly;
  }

  const perKmAmount = km > 0 && pricing.perKm ? km * pricing.perKm : 0;
  const total = baseAmount + perKmAmount;

  return { hours: hrs, estimatedKm: km, baseAmount, perKmAmount, total };
}

module.exports = {
  createVehicle,
  listVehicles,
  listVendorVehicles,
  listAdminVehicles,
  getVehicleById,
  updateVehicle,
  approveVehicle,
  rejectVehicle,
  togglePublish,
  blockPeriod,
  checkAvailability,
  calculateSelfDrivePrice,
  calculateWithDriverPrice,
};
