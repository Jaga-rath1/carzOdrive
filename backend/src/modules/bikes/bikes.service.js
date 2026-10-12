const Bike = require('./bikes.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

async function createBike(vendorId, data) {
  const bike = await Bike.create({ vendorId: vendorId || null, ...data });
  return bike;
}

async function listBikes(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    status: 'APPROVED',
    isPublished: true,
    isAvailable: true,
  };

  if (query.city) {
    filter['location.city'] = new RegExp(query.city, 'i');
  }
  if (query.bikeType) {
    filter.bikeType = query.bikeType;
  }
  if (query.minPrice) {
    filter['pricing.daily'] = { ...filter['pricing.daily'], $gte: Number(query.minPrice) };
  }
  if (query.maxPrice) {
    filter['pricing.daily'] = { ...filter['pricing.daily'], $lte: Number(query.maxPrice) };
  }

  const [bikes, total] = await Promise.all([
    Bike.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Bike.countDocuments(filter),
  ]);

  return { bikes, pagination: buildPaginationMeta(total, page, limit) };
}

async function listVendorBikes(vendorId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { vendorId };

  if (query.status) filter.status = query.status;
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === 'true';

  const [bikes, total] = await Promise.all([
    Bike.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Bike.countDocuments(filter),
  ]);

  return { bikes, pagination: buildPaginationMeta(total, page, limit) };
}

async function listAdminBikes(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.vendorId) filter.vendorId = query.vendorId;
  if (query.city) filter['location.city'] = new RegExp(query.city, 'i');
  if (query.bikeType) filter.bikeType = query.bikeType;

  const [bikes, total] = await Promise.all([
    Bike.find(filter)
      .populate('vendorId', 'businessName contactEmail')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Bike.countDocuments(filter),
  ]);

  return { bikes, pagination: buildPaginationMeta(total, page, limit) };
}

async function getBikeById(bikeId) {
  const bike = await Bike.findById(bikeId).populate('vendorId', 'businessName contactEmail contactPhone');
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }
  return bike;
}

async function updateBike(bikeId, vendorId, data) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  const ownerMatch = vendorId ? String(bike.vendorId) === String(vendorId) : bike.vendorId === null;
  if (!ownerMatch) {
    const err = new Error('You do not own this bike');
    err.statusCode = 403;
    throw err;
  }

  // Fields that only admin can change should not be updated by vendor
  const protectedFields = ['status', 'approvedBy', 'approvedAt', 'isPublished'];
  protectedFields.forEach((f) => delete data[f]);

  Object.assign(bike, data);
  await bike.save();
  return bike;
}

async function approveBike(bikeId, adminId) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }
  bike.status = 'APPROVED';
  bike.approvedBy = adminId;
  bike.approvedAt = new Date();
  bike.rejectionReason = undefined;
  await bike.save();
  return bike;
}

async function rejectBike(bikeId, adminId, reason) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }
  bike.status = 'REJECTED';
  bike.rejectionReason = reason || 'No reason provided';
  bike.isPublished = false;
  await bike.save();
  return bike;
}

async function togglePublish(bikeId, vendorId, isPublished) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  const ownerMatch = vendorId ? String(bike.vendorId) === String(vendorId) : bike.vendorId === null;
  if (!ownerMatch) {
    const err = new Error('You do not own this bike');
    err.statusCode = 403;
    throw err;
  }

  if (bike.status !== 'APPROVED') {
    const err = new Error('Only approved bikes can be published');
    err.statusCode = 400;
    throw err;
  }

  bike.isPublished = Boolean(isPublished);
  await bike.save();
  return bike;
}

async function checkAvailability(bikeId, startDate, endDate) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  if (!bike.isAvailable || bike.status !== 'APPROVED' || !bike.isPublished) {
    return { available: false, reason: 'Bike is not currently available' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const hasBlockedOverlap = bike.blockedPeriods.some(
    (period) => start < period.end && end > period.start
  );

  if (hasBlockedOverlap) {
    return { available: false, reason: 'Bike is blocked during the requested period' };
  }

  // Check active bookings overlap — requires Booking model; done via a loose import to avoid circular deps
  let hasBookingOverlap = false;
  try {
    const Booking = require('../bookings/bookings.model');
    const overlappingBooking = await Booking.findOne({
      resourceId: bikeId,
      resourceType: 'BIKE',
      status: { $in: ['PENDING', 'CONFIRMED', 'ONGOING'] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });
    hasBookingOverlap = Boolean(overlappingBooking);
  } catch (_) {
    // Booking model not available; skip booking check
  }

  if (hasBookingOverlap) {
    return { available: false, reason: 'Bike is already booked for this period' };
  }

  return { available: true };
}

async function calculateBikePrice(bikeId, startDate, endDate) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    const err = new Error('End date must be after start date');
    err.statusCode = 400;
    throw err;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((end - start) / msPerDay);

  let baseAmount;
  if (days >= 30 && bike.pricing.monthly > 0) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    baseAmount = months * bike.pricing.monthly + remainingDays * bike.pricing.daily;
  } else if (days >= 7 && bike.pricing.weekly > 0) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    baseAmount = weeks * bike.pricing.weekly + remainingDays * bike.pricing.daily;
  } else {
    baseAmount = days * bike.pricing.daily;
  }

  const securityDeposit = bike.pricing.securityDeposit || 0;
  const total = baseAmount + securityDeposit;

  return { days, baseAmount, securityDeposit, total };
}

module.exports = {
  createBike,
  listBikes,
  listVendorBikes,
  listAdminBikes,
  getBikeById,
  updateBike,
  approveBike,
  rejectBike,
  togglePublish,
  checkAvailability,
  calculateBikePrice,
};
