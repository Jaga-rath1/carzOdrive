const Driver = require('./drivers.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

async function applyAsDriver(userId, data) {
  const existing = await Driver.findOne({ userId });
  if (existing) {
    const err = new Error('Driver profile already exists for this user');
    err.statusCode = 409;
    throw err;
  }
  const driver = await Driver.create({ userId, ...data });
  return driver;
}

async function getMyDriverProfile(userId) {
  const driver = await Driver.findOne({ userId }).populate('vendorId', 'businessName');
  if (!driver) {
    const err = new Error('Driver profile not found');
    err.statusCode = 404;
    throw err;
  }
  return driver;
}

async function updateDriverProfile(driverId, userId, data) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }

  if (String(driver.userId) !== String(userId)) {
    const err = new Error('You do not own this driver profile');
    err.statusCode = 403;
    throw err;
  }

  // Protect admin-only fields
  const protectedFields = ['status', 'approvedBy', 'approvedAt', 'isAvailable', 'currentAssignment', 'rating'];
  protectedFields.forEach((f) => delete data[f]);

  Object.assign(driver, data);
  await driver.save();
  return driver;
}

async function listDrivers(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.isAvailable !== undefined) filter.isAvailable = query.isAvailable === 'true';
  if (query.serviceArea) filter.serviceArea = { $in: [new RegExp(query.serviceArea, 'i')] };
  if (query.vendorId) filter.vendorId = query.vendorId;

  const [drivers, total] = await Promise.all([
    Driver.find(filter)
      .populate('userId', 'name email')
      .populate('vendorId', 'businessName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Driver.countDocuments(filter),
  ]);

  return { drivers, pagination: buildPaginationMeta(total, page, limit) };
}

async function getDriverById(driverId) {
  const driver = await Driver.findById(driverId)
    .populate('userId', 'name email phone')
    .populate('vendorId', 'businessName contactEmail');
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  return driver;
}

async function approveDriver(driverId, adminId) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.status = 'APPROVED';
  driver.approvedBy = adminId;
  driver.approvedAt = new Date();
  driver.rejectionReason = undefined;
  driver.suspensionReason = undefined;
  await driver.save();
  return driver;
}

async function rejectDriver(driverId, adminId, reason) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.status = 'REJECTED';
  driver.rejectionReason = reason || 'No reason provided';
  driver.isAvailable = false;
  await driver.save();
  return driver;
}

async function suspendDriver(driverId, adminId, reason) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.status = 'SUSPENDED';
  driver.suspensionReason = reason || 'No reason provided';
  driver.isAvailable = false;
  await driver.save();
  return driver;
}

async function getAvailableDrivers(city, startDate, endDate) {
  const filter = {
    status: 'APPROVED',
    isAvailable: true,
  };

  if (city) {
    filter.serviceArea = { $elemMatch: { $regex: new RegExp(city, 'i') } };
  }

  let drivers = await Driver.find(filter)
    .populate('userId', 'name email phone')
    .sort({ 'rating.average': -1 });

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter out drivers assigned to bookings in the requested period
    try {
      const Booking = require('../bookings/bookings.model');
      const busyDriverIds = await Booking.distinct('driverId', {
        driverId: { $in: drivers.map((d) => d._id) },
        status: { $in: ['CONFIRMED', 'ONGOING'] },
        startDate: { $lt: end },
        endDate: { $gt: start },
      });
      const busySet = new Set(busyDriverIds.map(String));
      drivers = drivers.filter((d) => !busySet.has(String(d._id)));
    } catch (_) {
      // Booking model not available; skip booking overlap check
    }
  }

  return drivers;
}

async function assignDriver(driverId, bookingId) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  if (!driver.isAvailable) {
    const err = new Error('Driver is not available');
    err.statusCode = 409;
    throw err;
  }
  driver.currentAssignment = bookingId;
  driver.isAvailable = false;
  await driver.save();
  return driver;
}

async function releaseDriver(driverId) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.currentAssignment = null;
  driver.isAvailable = true;
  await driver.save();
  return driver;
}

module.exports = {
  applyAsDriver,
  getMyDriverProfile,
  updateDriverProfile,
  listDrivers,
  getDriverById,
  approveDriver,
  rejectDriver,
  suspendDriver,
  getAvailableDrivers,
  assignDriver,
  releaseDriver,
};
