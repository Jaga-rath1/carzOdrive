const mongoose = require('mongoose');
const { Booking } = require('../bookings/bookings.model');
const { User } = require('../auth/auth.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

// Lazy-load models to avoid circular dependencies
function Vendor() { return require('../vendors/vendors.model').Vendor; }
function Vehicle() { return require('../vehicles/vehicles.model').Vehicle; }
function Bike() { return require('../bikes/bikes.model').Bike; }
function Driver() { return require('../drivers/drivers.model').Driver; }
function TourPackage() { return require('../packages/packages.model').TourPackage; }
function Payment() { return require('../payments/payments.model').Payment; }

async function getOverallStats() {
  const [
    totalUsers,
    totalCustomers,
    totalVendors,
    totalVendorsPending,
    bookingsByStatus,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'CUSTOMER' }),
    User.countDocuments({ role: 'VENDOR' }),
    Vendor().countDocuments({ status: 'PENDING' }),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$priceBreakdown.totalAmount' },
          totalBookings: { $sum: 1 },
        },
      },
    ]),
  ]);

  const bookingStatusMap = {};
  bookingsByStatus.forEach((b) => { bookingStatusMap[b._id] = b.count; });

  const revenue = revenueResult[0] || { totalRevenue: 0, totalBookings: 0 };

  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      vendors: totalVendors,
      vendorsPendingApproval: totalVendorsPending,
    },
    bookings: bookingStatusMap,
    revenue: {
      totalRevenue: revenue.totalRevenue,
      paidBookings: revenue.totalBookings,
    },
  };
}

async function getBookingReport(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.serviceType) filter.serviceType = query.serviceType;
  if (query.vendorId) filter.vendorId = new mongoose.Types.ObjectId(query.vendorId);

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'make model registrationNumber')
      .populate('bikeId', 'make model registrationNumber')
      .populate('driverId', 'name phone')
      .populate('packageId', 'name')
      .populate('vendorId', 'businessName')
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Booking.countDocuments(filter),
  ]);

  return { bookings, pagination: buildPaginationMeta(total, page, limit) };
}

async function getRevenueReport(query) {
  const matchFilter = { paymentStatus: 'PAID' };

  if (query.startDate || query.endDate) {
    matchFilter.createdAt = {};
    if (query.startDate) matchFilter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) matchFilter.createdAt.$lte = new Date(query.endDate);
  }
  if (query.serviceType) matchFilter.serviceType = query.serviceType;

  // Period grouping: 'day' or 'month' (default: month)
  const period = query.period === 'day' ? 'day' : 'month';

  const dateFormat = period === 'day'
    ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
    : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

  const [totalResult, byServiceType, byPeriod] = await Promise.all([
    Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$priceBreakdown.totalAmount' },
          totalBookings: { $sum: 1 },
          averageRevenue: { $avg: '$priceBreakdown.totalAmount' },
        },
      },
    ]),
    Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$serviceType',
          revenue: { $sum: '$priceBreakdown.totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]),
    Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: dateFormat,
          revenue: { $sum: '$priceBreakdown.totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totals = totalResult[0] || { totalRevenue: 0, totalBookings: 0, averageRevenue: 0 };

  return {
    summary: {
      totalRevenue: totals.totalRevenue,
      totalBookings: totals.totalBookings,
      averageBookingValue: Math.round(totals.averageRevenue || 0),
    },
    byServiceType: byServiceType.map((s) => ({
      serviceType: s._id,
      revenue: s.revenue,
      bookings: s.count,
    })),
    byPeriod: byPeriod.map((p) => ({
      period: p._id,
      revenue: p.revenue,
      bookings: p.count,
    })),
  };
}

async function getPendingApprovals() {
  const [
    pendingVendors,
    pendingVehicles,
    pendingBikes,
    pendingDrivers,
    pendingPackages,
  ] = await Promise.all([
    Vendor().countDocuments({ status: 'PENDING' }),
    Vehicle().countDocuments({ status: 'PENDING' }),
    Bike().countDocuments({ status: 'PENDING' }),
    Driver().countDocuments({ status: 'PENDING' }),
    TourPackage().countDocuments({ status: 'PENDING' }),
  ]);

  return {
    vendors: pendingVendors,
    vehicles: pendingVehicles,
    bikes: pendingBikes,
    drivers: pendingDrivers,
    packages: pendingPackages,
    total: pendingVendors + pendingVehicles + pendingBikes + pendingDrivers + pendingPackages,
  };
}

async function getVendorReport(vendorId) {
  const vendor = await Vendor().findById(vendorId);
  if (!vendor) {
    const err = new Error('Vendor not found');
    err.statusCode = 404;
    throw err;
  }

  const vendorObjId = new mongoose.Types.ObjectId(vendorId);

  const [bookingStats, revenueResult, vehicleCount, bikeCount, driverCount, packageCount] =
    await Promise.all([
      Booking.aggregate([
        { $match: { vendorId: vendorObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { vendorId: vendorObjId, paymentStatus: 'PAID' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$priceBreakdown.totalAmount' },
            totalBookings: { $sum: 1 },
          },
        },
      ]),
      Vehicle().countDocuments({ vendorId: vendorObjId }),
      Bike().countDocuments({ vendorId: vendorObjId }),
      Driver().countDocuments({ vendorId: vendorObjId }),
      TourPackage().countDocuments({ vendorId: vendorObjId }),
    ]);

  const bookingStatusMap = {};
  bookingStats.forEach((b) => { bookingStatusMap[b._id] = b.count; });

  const rev = revenueResult[0] || { totalRevenue: 0, totalBookings: 0 };

  return {
    vendor: {
      id: vendor._id,
      businessName: vendor.businessName,
      vendorType: vendor.vendorType,
      status: vendor.status,
    },
    inventory: {
      vehicles: vehicleCount,
      bikes: bikeCount,
      drivers: driverCount,
      packages: packageCount,
    },
    bookings: bookingStatusMap,
    revenue: {
      totalRevenue: rev.totalRevenue,
      paidBookings: rev.totalBookings,
    },
  };
}

async function getRefundReport(query) {
  const matchFilter = { method: 'REFUND' };

  if (query.startDate || query.endDate) {
    matchFilter.createdAt = {};
    if (query.startDate) matchFilter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) matchFilter.createdAt.$lte = new Date(query.endDate);
  }
  if (query.status) matchFilter.status = query.status;

  const [summaryResult, byMethod, byStatus] = await Promise.all([
    Payment().aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalRefunded: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    Booking.aggregate([
      { $match: { paymentStatus: 'REFUNDED' } },
      {
        $group: {
          _id: null,
          totalRefundAmount: { $sum: '$refundAmount' },
          count: { $sum: 1 },
        },
      },
    ]),
    Payment().aggregate([
      { $match: { method: 'REFUND' } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  const summary = summaryResult[0] || { totalRefunded: 0, count: 0 };
  const bookingRefunds = byMethod[0] || { totalRefundAmount: 0, count: 0 };

  const statusMap = {};
  byStatus.forEach((s) => { statusMap[s._id] = { count: s.count, totalAmount: s.totalAmount }; });

  return {
    summary: {
      totalRefundTransactions: summary.count,
      totalRefundedAmount: summary.totalRefunded,
      totalRefundedBookings: bookingRefunds.count,
      totalRefundedFromBookings: bookingRefunds.totalRefundAmount,
    },
    byStatus: statusMap,
  };
}

module.exports = {
  getOverallStats,
  getBookingReport,
  getRevenueReport,
  getPendingApprovals,
  getVendorReport,
  getRefundReport,
};
