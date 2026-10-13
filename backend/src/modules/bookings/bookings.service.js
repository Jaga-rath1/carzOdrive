const mongoose = require('mongoose');
const { Booking } = require('./bookings.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN'];

// Lazy-load models to avoid circular deps
function Vehicle() { return require('../vehicles/vehicles.model').Vehicle; }
function Bike() { return require('../bikes/bikes.model').Bike; }
function Driver() { return require('../drivers/drivers.model').Driver; }
function TourPackage() { return require('../packages/packages.model').TourPackage; }

// Validate that no overlapping confirmed booking exists for a resource
async function assertNoOverlap(filter) {
  const existing = await Booking.findOne({
    ...filter,
    status: { $in: ['CONFIRMED', 'ASSIGNED', 'ACTIVE'] },
  });
  if (existing) {
    const err = new Error('Resource is not available for the selected dates');
    err.statusCode = 409;
    throw err;
  }
}

function addStatusHistory(booking, status, userId, note) {
  booking.statusHistory.push({ status, changedBy: userId, changedAt: new Date(), note });
}

async function createSelfDriveCar(customerId, data) {
  const vehicle = await Vehicle().findOne({ _id: data.vehicleId, status: 'APPROVED', isPublished: true });
  if (!vehicle) {
    const err = new Error('Vehicle not found or not available');
    err.statusCode = 404;
    throw err;
  }
  if (!vehicle.serviceTypes.includes('SELF_DRIVE')) {
    const err = new Error('Vehicle does not support self-drive');
    err.statusCode = 400;
    throw err;
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  if (endDate <= startDate) {
    const err = new Error('End date must be after start date');
    err.statusCode = 400;
    throw err;
  }

  await assertNoOverlap({ vehicleId: data.vehicleId, startDate: { $lt: endDate }, endDate: { $gt: startDate } });

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const baseAmount = days * (vehicle.pricing?.selfDrive?.daily || 0);
  const securityDeposit = vehicle.securityDeposit || 0;
  const taxes = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + securityDeposit + taxes;

  const booking = await Booking.create({
    customerId,
    serviceType: 'SELF_DRIVE_CAR',
    vehicleId: vehicle._id,
    vendorId: vehicle.vendorId,
    startDate,
    endDate,
    pickupLocation: data.pickupLocation,
    dropoffLocation: data.dropoffLocation || data.pickupLocation,
    priceBreakdown: { baseAmount, securityDeposit, taxes, totalAmount },
    customerNotes: data.notes,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedBy: customerId, changedAt: new Date() }],
  });
  return booking;
}

async function createSelfDriveBike(customerId, data) {
  const bike = await Bike().findOne({ _id: data.bikeId, status: 'APPROVED', isPublished: true });
  if (!bike) {
    const err = new Error('Bike not found or not available');
    err.statusCode = 404;
    throw err;
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  if (endDate <= startDate) {
    const err = new Error('End date must be after start date');
    err.statusCode = 400;
    throw err;
  }

  await assertNoOverlap({ bikeId: data.bikeId, startDate: { $lt: endDate }, endDate: { $gt: startDate } });

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const baseAmount = days * (bike.pricing?.daily || 0);
  const securityDeposit = bike.pricing?.securityDeposit || 0;
  const taxes = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + securityDeposit + taxes;

  const booking = await Booking.create({
    customerId,
    serviceType: 'SELF_DRIVE_BIKE',
    bikeId: bike._id,
    vendorId: bike.vendorId,
    startDate,
    endDate,
    pickupLocation: data.pickupLocation,
    priceBreakdown: { baseAmount, securityDeposit, taxes, totalAmount },
    customerNotes: data.notes,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedBy: customerId, changedAt: new Date() }],
  });
  return booking;
}

async function createCarWithDriver(customerId, data) {
  const vehicle = await Vehicle().findOne({ _id: data.vehicleId, status: 'APPROVED', isPublished: true });
  if (!vehicle || !vehicle.serviceTypes.includes('WITH_DRIVER')) {
    const err = new Error('Vehicle not available for with-driver service');
    err.statusCode = 404;
    throw err;
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  await assertNoOverlap({ vehicleId: data.vehicleId, startDate: { $lt: endDate }, endDate: { $gt: startDate } });

  const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
  const baseAmount = hours * (vehicle.pricing?.withDriver?.hourly || 0);
  const taxes = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + taxes;

  const booking = await Booking.create({
    customerId,
    serviceType: 'CAR_WITH_DRIVER',
    vehicleId: vehicle._id,
    vendorId: vehicle.vendorId,
    startDate,
    endDate,
    pickupLocation: data.pickupLocation,
    dropoffLocation: data.dropoffLocation,
    priceBreakdown: { baseAmount, taxes, totalAmount },
    customerNotes: data.notes,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedBy: customerId, changedAt: new Date() }],
  });
  return booking;
}

async function createDriverOnly(customerId, data) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
  // Base rate for driver-only: flat calculation; will be updated by admin quotation flow
  const baseAmount = data.quotedAmount || hours * 200; // default 200/hr
  const taxes = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + taxes;

  const booking = await Booking.create({
    customerId,
    serviceType: 'DRIVER_ONLY',
    quotationId: data.quotationId,
    startDate,
    endDate,
    pickupLocation: data.pickupLocation,
    dropoffLocation: data.dropoffLocation,
    priceBreakdown: { baseAmount, taxes, totalAmount },
    customerNotes: data.notes,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedBy: customerId, changedAt: new Date() }],
  });
  return booking;
}

async function createTourPackageBooking(customerId, data) {
  const pkg = await TourPackage().findOne({ _id: data.packageId, status: 'APPROVED', isPublished: true });
  if (!pkg) {
    const err = new Error('Tour package not found');
    err.statusCode = 404;
    throw err;
  }

  const tourDate = new Date(data.tourDate);
  const dateSlot = pkg.availableDates.find(
    (d) => d.date.toDateString() === tourDate.toDateString()
  );
  if (!dateSlot) {
    const err = new Error('Tour date not available');
    err.statusCode = 400;
    throw err;
  }

  const adults = data.adults || 1;
  const children = data.children || 0;
  const infants = data.infants || 0;
  const totalPax = adults + children;

  if (dateSlot.capacity - dateSlot.bookedCount < totalPax) {
    const err = new Error('Not enough capacity for the selected date');
    err.statusCode = 409;
    throw err;
  }

  const baseAmount = adults * pkg.pricing.adultPrice + children * (pkg.pricing.childPrice || 0);
  const taxes = Math.round(baseAmount * 0.05);
  const totalAmount = baseAmount + taxes;

  // Decrement capacity atomically
  await TourPackage().updateOne(
    { _id: pkg._id, 'availableDates._id': dateSlot._id, 'availableDates.bookedCount': { $lte: dateSlot.capacity - totalPax } },
    { $inc: { 'availableDates.$.bookedCount': totalPax } }
  );

  const booking = await Booking.create({
    customerId,
    serviceType: 'TOUR_PACKAGE',
    packageId: pkg._id,
    vendorId: pkg.vendorId,
    startDate: tourDate,
    endDate: new Date(tourDate.getTime() + pkg.duration.days * 24 * 60 * 60 * 1000),
    tourDate,
    travelers: data.travelers || [],
    priceBreakdown: { baseAmount, taxes, totalAmount },
    customerNotes: data.notes,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedBy: customerId, changedAt: new Date() }],
  });
  return booking;
}

async function getBooking(bookingId, userId, userRole) {
  const filter = { _id: bookingId };
  if (!ADMIN_ROLES.includes(userRole) && userRole !== 'VENDOR') filter.customerId = userId;
  const booking = await Booking.findOne(filter)
    .populate('customerId', 'name email phone')
    .populate('vehicleId')
    .populate('bikeId')
    .populate('driverId')
    .populate('packageId')
    .populate('paymentId');
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  return booking;
}

async function listBookings(query, userId, userRole) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (!ADMIN_ROLES.includes(userRole)) {
    if (userRole === 'VENDOR') filter.vendorId = query.vendorId || userId;
    else filter.customerId = userId;
  }
  if (query.status) filter.status = query.status;
  if (query.serviceType) filter.serviceType = query.serviceType;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('customerId', 'name email')
      .populate('vehicleId', 'make model')
      .populate('bikeId', 'make model')
      .populate('driverId', 'name')
      .populate('packageId', 'name')
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Booking.countDocuments(filter),
  ]);
  return { bookings, pagination: buildPaginationMeta(total, page, limit) };
}

// Valid state transitions
const TRANSITIONS = {
  PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['ASSIGNED', 'ACTIVE', 'CANCELLED'],
  ASSIGNED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
};

async function updateBookingStatus(bookingId, newStatus, userId, userRole, note) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const allowed = TRANSITIONS[booking.status] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
    err.statusCode = 400;
    throw err;
  }

  // Non-admins can only cancel their own bookings
  if (!ADMIN_ROLES.includes(userRole) && newStatus !== 'CANCELLED') {
    const err = new Error('Insufficient permissions to update booking status');
    err.statusCode = 403;
    throw err;
  }
  if (newStatus === 'CANCELLED' && !ADMIN_ROLES.includes(userRole) && booking.customerId.toString() !== userId) {
    const err = new Error('Not authorized');
    err.statusCode = 403;
    throw err;
  }

  addStatusHistory(booking, newStatus, userId, note);
  booking.status = newStatus;

  if (newStatus === 'ACTIVE') booking.actualStartDate = new Date();
  if (newStatus === 'COMPLETED') booking.actualEndDate = new Date();
  if (newStatus === 'CANCELLED') {
    booking.cancelledBy = userId;
    booking.cancelledAt = new Date();
    booking.cancellationReason = note;
    // Restore tour capacity if applicable
    if (booking.serviceType === 'TOUR_PACKAGE' && booking.packageId) {
      const pax = booking.travelers?.length || 1;
      await TourPackage().updateOne(
        { _id: booking.packageId, 'availableDates.date': booking.tourDate },
        { $inc: { 'availableDates.$.bookedCount': -pax } }
      );
    }
  }

  await booking.save();
  return booking;
}

async function assignDriver(bookingId, driverId, adminId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  if (!['CONFIRMED', 'ASSIGNED'].includes(booking.status)) {
    const err = new Error('Booking must be CONFIRMED to assign driver');
    err.statusCode = 400;
    throw err;
  }
  const driver = await Driver().findOne({ _id: driverId, status: 'APPROVED', isAvailable: true });
  if (!driver) {
    const err = new Error('Driver not available');
    err.statusCode = 404;
    throw err;
  }

  // Check driver overlap
  await assertNoOverlap({ driverId, startDate: { $lt: booking.endDate }, endDate: { $gt: booking.startDate } });

  booking.driverId = driverId;
  booking.status = 'ASSIGNED';
  addStatusHistory(booking, 'ASSIGNED', adminId, `Driver ${driverId} assigned`);
  await booking.save();

  driver.currentAssignment = bookingId;
  driver.isAvailable = false;
  await driver.save();

  return booking;
}

async function recordPickupInspection(bookingId, inspection, userId) {
  const booking = await Booking.findOne({ _id: bookingId, status: 'ACTIVE' });
  if (!booking) {
    const err = new Error('Booking not active');
    err.statusCode = 400;
    throw err;
  }
  booking.pickupInspection = { ...inspection, inspectedAt: new Date() };
  await booking.save();
  return booking;
}

async function recordReturnInspection(bookingId, inspection, adminId) {
  const booking = await Booking.findOne({ _id: bookingId, status: 'ACTIVE' });
  if (!booking) {
    const err = new Error('Booking not active');
    err.statusCode = 400;
    throw err;
  }
  booking.returnInspection = { ...inspection, inspectedAt: new Date() };
  if (inspection.extraCharges) {
    booking.priceBreakdown.extraCharges = inspection.extraCharges;
    booking.priceBreakdown.totalAmount += inspection.extraCharges;
  }
  await booking.save();
  return booking;
}

module.exports = {
  createSelfDriveCar, createSelfDriveBike, createCarWithDriver, createDriverOnly, createTourPackageBooking,
  getBooking, listBookings, updateBookingStatus, assignDriver,
  recordPickupInspection, recordReturnInspection,
};
