const mongoose = require('mongoose');
const TourPackage = require('../models/package.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

// ─── Create ────────────────────────────────────────────────────────────────

async function createPackage(vendorId, data) {
  if (!data.name && data.title) data.name = data.title;
  if (!data.title && data.name) data.title = data.name;
  if (!data.pricing || !data.pricing.adultPrice) {
    const p = Number(data.priceNumeric || data.startingPrice || 4999);
    data.pricing = {
      adultPrice: p,
      childPrice: Math.round(p * 0.5),
      infantPrice: 0,
    };
  }
  const status = data.status || 'APPROVED';
  const isPublished = data.isPublished !== undefined ? data.isPublished : true;
  const isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;

  const pkg = await TourPackage.create({
    vendorId: vendorId || null,
    status,
    isPublished,
    isAvailable,
    ...data,
  });
  return pkg;
}

// ─── Public listing ────────────────────────────────────────────────────────

async function listPackages(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { status: 'APPROVED', isPublished: true };

  if (query.destination) {
    filter.destination = new RegExp(query.destination, 'i');
  }

  if (query.days) {
    filter['duration.days'] = parseInt(query.days, 10);
  }

  if (query.minPrice || query.maxPrice) {
    filter['pricing.adultPrice'] = {};
    if (query.minPrice) filter['pricing.adultPrice'].$gte = Number(query.minPrice);
    if (query.maxPrice) filter['pricing.adultPrice'].$lte = Number(query.maxPrice);
  }

  if (query.category) {
    filter.category = new RegExp(query.category, 'i');
  }

  if (query.odishaTheme) {
    filter.odishaTheme = new RegExp(query.odishaTheme, 'i');
  }

  const [packages, total] = await Promise.all([
    TourPackage.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    TourPackage.countDocuments(filter),
  ]);

  return { packages, pagination: buildPaginationMeta(total, page, limit) };
}

// ─── Vendor listing ────────────────────────────────────────────────────────

async function listVendorPackages(vendorId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { vendorId };

  if (query.status) filter.status = query.status;
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === 'true';

  const [packages, total] = await Promise.all([
    TourPackage.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    TourPackage.countDocuments(filter),
  ]);

  return { packages, pagination: buildPaginationMeta(total, page, limit) };
}

// ─── Admin listing ─────────────────────────────────────────────────────────

async function listAdminPackages(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.vendorId) filter.vendorId = query.vendorId;
  if (query.destination) filter.destination = new RegExp(query.destination, 'i');
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === 'true';

  const [packages, total] = await Promise.all([
    TourPackage.find(filter)
      .populate('vendorId', 'businessName email')
      .populate('approvedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    TourPackage.countDocuments(filter),
  ]);

  return { packages, pagination: buildPaginationMeta(total, page, limit) };
}

// ─── Get one ───────────────────────────────────────────────────────────────

async function getPackageById(packageId) {
  let pkg = null;
  if (mongoose.Types.ObjectId.isValid(packageId)) {
    pkg = await TourPackage.findById(packageId).populate('approvedBy', 'name email');
  }
  if (!pkg) {
    pkg = await TourPackage.findOne({
      $or: [{ slug: packageId }, { id: packageId }],
    }).populate('approvedBy', 'name email');
  }
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }
  return pkg;
}

// ─── Update ────────────────────────────────────────────────────────────────

async function updatePackage(packageId, vendorId, data, isAdmin = false) {
  const pkg = await TourPackage.findById(packageId);
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }

  if (!isAdmin && String(pkg.vendorId) !== String(vendorId)) {
    const err = new Error('Forbidden: you do not own this package');
    err.statusCode = 403;
    throw err;
  }

  // Editing a package resets approval status to PENDING (unless admin)
  if (!isAdmin && pkg.status === 'APPROVED') {
    data.status = 'PENDING';
    data.isPublished = false;
    data.approvedBy = undefined;
    data.approvedAt = undefined;
  }

  Object.assign(pkg, data);
  await pkg.save();
  return pkg;
}

// ─── Approve / Reject ──────────────────────────────────────────────────────

async function approvePackage(packageId, adminId) {
  const pkg = await TourPackage.findById(packageId);
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }
  pkg.status = 'APPROVED';
  pkg.isPublished = true;
  pkg.approvedBy = adminId;
  pkg.approvedAt = new Date();
  pkg.rejectionReason = undefined;
  await pkg.save();
  return pkg;
}

async function rejectPackage(packageId, adminId, reason) {
  const pkg = await TourPackage.findById(packageId);
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }
  pkg.status = 'REJECTED';
  pkg.isPublished = false;
  pkg.rejectionReason = reason;
  await pkg.save();
  return pkg;
}

// ─── Delete ────────────────────────────────────────────────────────────────

async function deletePackage(packageId, vendorId, isAdmin = false) {
  const pkg = await TourPackage.findById(packageId);
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isAdmin && String(pkg.vendorId) !== String(vendorId)) {
    const err = new Error('Forbidden: you do not own this package');
    err.statusCode = 403;
    throw err;
  }
  await TourPackage.deleteOne({ _id: packageId });
  return { message: 'Package deleted successfully' };
}

// ─── Toggle publish ────────────────────────────────────────────────────────

async function togglePublish(packageId, vendorId, isPublished, isAdmin = false) {
  const pkg = await TourPackage.findById(packageId);
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isAdmin && String(pkg.vendorId) !== String(vendorId)) {
    const err = new Error('Forbidden: you do not own this package');
    err.statusCode = 403;
    throw err;
  }
  if (isPublished && pkg.status !== 'APPROVED') {
    const err = new Error('Cannot publish a package that is not approved');
    err.statusCode = 400;
    throw err;
  }
  pkg.isPublished = isPublished;
  await pkg.save();
  return pkg;
}

// ─── Check availability ────────────────────────────────────────────────────

async function checkDateAvailability(packageId, dateStr, pax = 1) {
  const pkg = await getPackageById(packageId);
  const targetDate = new Date(dateStr);
  const slot = (pkg.availableDates || []).find(
    (d) => new Date(d.date).toDateString() === targetDate.toDateString()
  );
  if (!slot) {
    return { available: true, remainingCapacity: 20 };
  }
  const remaining = slot.capacity - slot.bookedCount;
  return { available: remaining >= pax, remainingCapacity: Math.max(0, remaining) };
}

module.exports = {
  createPackage,
  listPackages,
  listVendorPackages,
  listAdminPackages,
  getPackageById,
  updatePackage,
  approvePackage,
  rejectPackage,
  deletePackage,
  togglePublish,
  checkDateAvailability,
};
