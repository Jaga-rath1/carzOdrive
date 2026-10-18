const mongoose = require('mongoose');
const { Booking } = require('../models/booking.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'STAFF_ADMIN', 'ADMIN'];

// Lazy-load models from MVC models
function Vehicle() { return require('../models/vehicle.model').Vehicle; }
function Bike() { return require('../models/bike.model').Bike; }
function Driver() { return require('../models/driver.model').Driver; }
function TourPackage() { return require('../models/package.model').TourPackage; }

// Validate that no overlapping confirmed booking exists for a resource
async function assertNoOverlap(filter) {
  const existing = await Booking.findOne({
    ...filter,
    status: { $in: ['CONFIRMED', 'ASSIGNED', 'ACTIVE'] },
  });
  if (existing) {
    const err = new Error('Resource is already booked for the selected dates');
    err.statusCode = 409;
    throw err;
  }
}

function addStatusHistory(booking, status, changedBy, note) {
  booking.statusHistory.push({
    status,
    changedBy,
    changedAt: new Date(),
    note,
  });
}

// ─── Payment Synchronization ───────────────────────────────────────────────
const { createOrSyncPaymentForBooking } = require('./bookingPaymentSync');

// ─── Self-Drive Car ────────────────────────────────────────────────────────

async function createSelfDriveCar(customerId, data) {
  const vehicle = await Vehicle().findOne({ _id: data.vehicleId, status: 'APPROVED', isPublished: true });
  if (!vehicle || !vehicle.serviceTypes.includes('SELF_DRIVE')) {
    const err = new Error('Vehicle not found or not available for self-drive');
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

  await assertNoOverlap({ vehicleId: data.vehicleId, startDate: { $lt: endDate }, endDate: { $gt: startDate } });

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const baseAmount = days * (vehicle.pricing?.selfDrive?.daily || vehicle.pricePerDay || 0);
  const securityDeposit = vehicle.depositNumeric || vehicle.securityDeposit || 0;
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

// ─── Self-Drive Bike ───────────────────────────────────────────────────────

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

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const baseAmount = days * (bike.pricing?.daily || bike.pricePerDay || 0);
  const securityDeposit = bike.depositNumeric || bike.pricing?.securityDeposit || 0;
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

// ─── Car with Driver ───────────────────────────────────────────────────────

async function createCarWithDriver(customerId, data) {
  const vehicle = await Vehicle().findOne({ _id: data.vehicleId, status: 'APPROVED', isPublished: true });
  if (!vehicle) {
    const err = new Error('Vehicle not found or not available');
    err.statusCode = 404;
    throw err;
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  await assertNoOverlap({ vehicleId: data.vehicleId, startDate: { $lt: endDate }, endDate: { $gt: startDate } });

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const baseAmount = days * (vehicle.pricing?.withDriver?.daily || vehicle.pricePerDay || 2499);
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

// ─── Driver Only ───────────────────────────────────────────────────────────

async function createDriverOnly(customerId, data) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const baseAmount = data.quotedAmount || days * 999;
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

// ─── Tour Package Booking ──────────────────────────────────────────────────

async function createTourPackageBooking(customerId, data) {
  const pkgId = data.packageId || data.vehicleId;
  const pkg = await TourPackage().findOne({
    $or: [{ _id: mongoose.Types.ObjectId.isValid(pkgId) ? pkgId : null }, { slug: pkgId }, { id: pkgId }].filter(Boolean),
    status: 'APPROVED',
  });
  if (!pkg) {
    const err = new Error('Tour package not found');
    err.statusCode = 404;
    throw err;
  }

  const tourDate = data.tourDate || data.startDate || data.pickupDate || new Date();
  const adults = Number(data.adults || data.pax || 2);
  const children = Number(data.children || 0);

  const adultPrice = pkg.pricing?.adultPrice || pkg.priceNumeric || 4999;
  const childPrice = pkg.pricing?.childPrice || Math.round(adultPrice * 0.5);
  const baseAmount = adults * adultPrice + children * childPrice;
  const taxes = Math.round(baseAmount * 0.05);
  const totalAmount = baseAmount + taxes;

  // If availableDates exist, update slot
  if (pkg.availableDates && pkg.availableDates.length > 0) {
    const dateSlot = pkg.availableDates.find(
      (d) => new Date(d.date).toDateString() === new Date(tourDate).toDateString()
    );
    if (dateSlot) {
      await TourPackage().updateOne(
        { _id: pkg._id, 'availableDates._id': dateSlot._id },
        { $inc: { 'availableDates.$.bookedCount': adults + children } }
      );
    }
  }

  const booking = await Booking.create({
    customerId: customerId || null,
    serviceType: 'TOUR_PACKAGE',
    packageId: pkg._id,
    vendorId: pkg.vendorId || null,
    vehicleName: pkg.name || pkg.title,
    vehicleImage: (pkg.images && pkg.images[0]) || pkg.image,
    startDate: new Date(tourDate),
    endDate: new Date(tourDate),
    pickupDate: typeof tourDate === 'string' ? tourDate : new Date(tourDate).toISOString().split('T')[0],
    pickupLocation: data.pickupLocation || pkg.pickupLocation || 'Bhubaneswar',
    dropoffLocation: data.dropoffLocation || pkg.dropLocation || 'Bhubaneswar',
    priceBreakdown: { baseAmount, taxes, totalAmount },
    totalAmount,
    paidAmount: data.paidAmount || 0,
    balanceAmount: totalAmount - (data.paidAmount || 0),
    guestName: data.guestName,
    guestPhone: data.guestPhone,
    guestEmail: data.guestEmail,
    guestNotes: data.notes || data.guestNotes,
    status: 'CONFIRMED',
    paymentStatus: data.paymentStatus || 'PAID',
    statusHistory: [{ status: 'CONFIRMED', changedBy: customerId || null, changedAt: new Date() }],
  });
  return booking;
}

// ─── Universal Booking (Modal / Checkout) ──────────────────────────────────

async function createUniversalBooking(customerId, data) {
  const payload = {
    customerId: customerId || null,
    ...data,
  };

  // If it is a tour package booking, ensure packageId is set
  if (
    data.serviceType === 'tour-packages' ||
    data.serviceType === 'tour-package' ||
    data.serviceType === 'TOUR_PACKAGE'
  ) {
    if (!payload.packageId && payload.vehicleId) {
      payload.packageId = payload.vehicleId;
    }
  }

  // Ensure total, paid, and balance amounts are properly computed
  const total = Number(payload.totalAmount || payload.priceBreakdown?.totalAmount || 0);
  let paid = Number(payload.paidAmount || 0);
  let balance = payload.balanceAmount !== undefined ? Number(payload.balanceAmount) : Math.max(0, total - paid);

  if (payload.paymentMode === 'full') {
    paid = total;
    balance = 0;
  } else if (payload.paymentMode === 'offline') {
    paid = 0;
    balance = total;
  } else if (payload.paymentMode === 'partial') {
    if (!paid) paid = Math.max(499, Math.round(total * 0.25));
    balance = Math.max(0, total - paid);
  }

  payload.totalAmount = total;
  payload.paidAmount = paid;
  payload.balanceAmount = balance;

  // Auto-generate transaction ID if not provided
  if (!payload.transactionId) {
    payload.transactionId = payload.paymentMode === 'offline' 
      ? 'PAY_ON_PICKUP'
      : `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  // Validate that vehicle or bike is not currently unavailable (count 0)
  let foundVehicle = null;
  let foundBike = null;

  if (payload.vehicleId && mongoose.Types.ObjectId.isValid(payload.vehicleId)) {
    foundVehicle = await Vehicle().findById(payload.vehicleId);
    if (foundVehicle) {
      const vCount = foundVehicle.availableCount ?? foundVehicle.count ?? (foundVehicle.isAvailable !== false ? 1 : 0);
      if (foundVehicle.isAvailable === false || vCount <= 0 || foundVehicle.availabilityStatus === 'UNAVAILABLE') {
        const err = new Error(`${foundVehicle.name || 'Vehicle'} has 0 available units and is currently unavailable.`);
        err.statusCode = 400;
        throw err;
      }
    }
  }

  if (payload.bikeId && mongoose.Types.ObjectId.isValid(payload.bikeId)) {
    foundBike = await Bike().findById(payload.bikeId);
    if (foundBike) {
      const bCount = foundBike.availableCount ?? foundBike.count ?? (foundBike.isAvailable !== false ? 1 : 0);
      if (foundBike.isAvailable === false || bCount <= 0 || foundBike.availabilityStatus === 'UNAVAILABLE') {
        const err = new Error(`${foundBike.name || 'Bike'} has 0 available units and is currently unavailable.`);
        err.statusCode = 400;
        throw err;
      }
    }
  }

  const booking = await Booking.create(payload);

  // Decrement vehicle inventory count upon booking
  if (foundVehicle) {
    const current = foundVehicle.availableCount ?? foundVehicle.count ?? 1;
    const newCount = Math.max(0, current - 1);
    foundVehicle.availableCount = newCount;
    if (newCount === 0) {
      foundVehicle.isAvailable = false;
      foundVehicle.availabilityStatus = 'UNAVAILABLE';
    }
    await foundVehicle.save();
  }

  // Decrement bike inventory count upon booking
  if (foundBike) {
    const current = foundBike.availableCount ?? foundBike.count ?? 1;
    const newCount = Math.max(0, current - 1);
    foundBike.availableCount = newCount;
    if (newCount === 0) {
      foundBike.isAvailable = false;
      foundBike.availabilityStatus = 'UNAVAILABLE';
    }
    await foundBike.save();
  }

  // Dynamically create and link corresponding Payment document
  const payment = await createOrSyncPaymentForBooking(booking);

  const populated = await Booking.findById(booking._id)
    .populate('customerId', 'name email phone')
    .populate('vehicleId')
    .populate('bikeId')
    .populate('driverId')
    .populate('packageId')
    .populate('paymentId');

  // Dispatched booking confirmation email via Nodemailer asynchronously
  const guestMail = payload.guestEmail || payload.email;
  if (guestMail && guestMail.includes('@')) {
    try {
      const { sendBookingConfirmationEmail } = require('../utils/mailer');
      sendBookingConfirmationEmail({
        email: guestMail,
        name: payload.guestName || 'Valued Guest',
        booking: populated || booking,
      }).catch((e) => console.error('Error dispatching confirmation email:', e?.message));
    } catch (e) {
      console.error('Nodemailer confirmation trigger error:', e?.message);
    }
  }

  return populated || booking;
}


// ─── Get & List Bookings ───────────────────────────────────────────────────

async function getBooking(bookingId, userId, userRole) {
  let booking = null;
  if (mongoose.Types.ObjectId.isValid(bookingId)) {
    booking = await Booking.findById(bookingId)
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('bikeId')
      .populate('driverId')
      .populate('packageId')
      .populate('paymentId');
  }
  if (!booking) {
    booking = await Booking.findOne({ bookingNumber: bookingId })
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('bikeId')
      .populate('driverId')
      .populate('packageId')
      .populate('paymentId');
  }
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  // Auto-heal payment link if legacy booking didn't have one
  if (!booking.paymentId) {
    await createOrSyncPaymentForBooking(booking);
    booking = await Booking.findById(booking._id)
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('bikeId')
      .populate('driverId')
      .populate('packageId')
      .populate('paymentId');
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
  if (query.status && query.status !== 'ALL') filter.status = query.status;
  if (query.serviceType && query.serviceType !== 'ALL') filter.serviceType = query.serviceType;
  if (query.paymentStatus && query.paymentStatus !== 'ALL') filter.paymentStatus = query.paymentStatus;
  if (query.paymentMode && query.paymentMode !== 'ALL') filter.paymentMode = query.paymentMode;

  if (query.search || query.q) {
    const s = new RegExp(query.search || query.q, 'i');
    filter.$or = [
      { bookingNumber: s },
      { guestName: s },
      { guestPhone: s },
      { guestEmail: s },
      { vehicleName: s },
      { transactionId: s },
    ];
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'name make model brand image')
      .populate('bikeId', 'name make model brand image')
      .populate('driverId', 'name phone')
      .populate('packageId', 'name title image')
      .populate('paymentId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Booking.countDocuments(filter),
  ]);
  return { bookings, pagination: buildPaginationMeta(total, page, limit) };
}

// ─── Status Update ─────────────────────────────────────────────────────────

const TRANSITIONS = {
  PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['ASSIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
  ASSIGNED: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
};

async function updateBookingStatus(bookingId, newStatus, userId, userRole, note, paymentStatus) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const isAdmin = ADMIN_ROLES.includes(userRole);
  const allowed = TRANSITIONS[booking.status] || [];
  if (!isAdmin && !allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
    err.statusCode = 400;
    throw err;
  }

  booking.status = newStatus;
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
    if (paymentStatus === 'PAID') {
      booking.paidAmount = booking.totalAmount || booking.paidAmount;
      booking.balanceAmount = 0;
    }
  }
  addStatusHistory(booking, newStatus, userId, note);
  await booking.save();

  // Restore inventory if booking was cancelled
  if (newStatus === 'CANCELLED') {
    if (booking.vehicleId) {
      const v = await Vehicle().findById(booking.vehicleId);
      if (v) {
        v.availableCount = (v.availableCount || 0) + 1;
        v.isAvailable = true;
        v.availabilityStatus = 'AVAILABLE';
        await v.save();
      }
    }
    if (booking.bikeId) {
      const b = await Bike().findById(booking.bikeId);
      if (b) {
        b.availableCount = (b.availableCount || 0) + 1;
        b.isAvailable = true;
        b.availabilityStatus = 'AVAILABLE';
        await b.save();
      }
    }
  }

  // Dynamically sync linked Payment record
  await createOrSyncPaymentForBooking(booking);

  const updated = await Booking.findById(booking._id).populate('paymentId');
  return updated || booking;
}


async function assignDriver(bookingId, driverId, adminId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  const driver = await Driver().findOne({ _id: driverId, status: 'APPROVED' });
  if (!driver) {
    const err = new Error('Driver not available');
    err.statusCode = 404;
    throw err;
  }

  booking.driverId = driverId;
  booking.status = 'ASSIGNED';
  addStatusHistory(booking, 'ASSIGNED', adminId, `Driver ${driver.name} assigned`);
  await booking.save();
  return booking;
}

async function getBookingByCode(bookingCode) {
  const isObjectId = mongoose.Types.ObjectId.isValid(bookingCode);
  const filter = isObjectId
    ? { $or: [{ bookingNumber: bookingCode }, { _id: bookingCode }] }
    : { bookingNumber: bookingCode };

  let booking = await Booking.findOne(filter)
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

  // Auto-heal payment link if not present
  if (!booking.paymentId) {
    await createOrSyncPaymentForBooking(booking);
    booking = await Booking.findById(booking._id)
      .populate('customerId', 'name email phone')
      .populate('vehicleId')
      .populate('bikeId')
      .populate('driverId')
      .populate('packageId')
      .populate('paymentId');
  }

  return booking;
}

async function lookupBookings(query) {
  const filter = {};
  if (query.phone) filter.guestPhone = new RegExp(query.phone.replace(/[^0-9]/g, '').slice(-10), 'i');
  if (query.email) filter.guestEmail = query.email.toLowerCase().trim();
  if (query.code) {
    filter.$or = [
      { bookingNumber: query.code.trim().toUpperCase() },
      { transactionId: query.code.trim() },
    ];
  }
  if (!filter.guestPhone && !filter.guestEmail && !filter.$or) {
    return [];
  }
  const bookings = await Booking.find(filter)
    .populate('customerId', 'name email phone')
    .populate('vehicleId', 'name make model brand image')
    .populate('bikeId', 'name make model brand image')
    .populate('driverId', 'name phone')
    .populate('packageId', 'name title image')
    .populate('paymentId')
    .sort({ createdAt: -1 })
    .limit(20);

  // Auto-heal payment links for returned bookings
  for (const b of bookings) {
    if (!b.paymentId) {
      createOrSyncPaymentForBooking(b).catch(() => {});
    }
  }

  return bookings;
}

async function updateBooking(bookingId, updateData) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  Object.assign(booking, updateData);
  await booking.save();

  // Dynamically sync linked Payment record
  await createOrSyncPaymentForBooking(booking);

  const updated = await Booking.findById(booking._id)
    .populate('customerId', 'name email phone')
    .populate('vehicleId')
    .populate('packageId')
    .populate('paymentId');

  return updated || booking;
}

async function deleteBooking(bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  const PaymentModel = require('../models/payment.model').Payment;
  await PaymentModel.deleteMany({ bookingId: booking._id });
  await Booking.findByIdAndDelete(bookingId);
  return { message: 'Booking and linked payment record deleted successfully' };
}

module.exports = {
  createSelfDriveCar,
  createSelfDriveBike,
  createCarWithDriver,
  createDriverOnly,
  createTourPackageBooking,
  createUniversalBooking,
  getBooking,
  listBookings,
  updateBookingStatus,
  assignDriver,
  getBookingByCode,
  lookupBookings,
  updateBooking,
  deleteBooking,
};
