const TourPackage = require('./packages.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

// ─── Create ────────────────────────────────────────────────────────────────

async function createPackage(vendorId, data) {
  const pkg = await TourPackage.create({ vendorId: vendorId || null, ...data });
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
  const pkg = await TourPackage.findById(packageId)
    .populate('vendorId', 'businessName email phone')
    .populate('approvedBy', 'name email');
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
  if (pkg.status === 'APPROVED') {
    const err = new Error('Package is already approved');
    err.statusCode = 400;
    throw err;
  }

  pkg.status = 'APPROVED';
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
  pkg.approvedBy = adminId;
  pkg.approvedAt = new Date();
  pkg.rejectionReason = reason || 'No reason provided';
  await pkg.save();
  return pkg;
}

// ─── Publish toggle ────────────────────────────────────────────────────────

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
    const err = new Error('Only approved packages can be published');
    err.statusCode = 400;
    throw err;
  }

  pkg.isPublished = isPublished;
  await pkg.save();
  return pkg;
}

// ─── Availability helpers ──────────────────────────────────────────────────

async function checkDateAvailability(packageId, date, paxCount) {
  const pkg = await TourPackage.findById(packageId).select('availableDates minPax maxPax');
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }

  const targetDate = new Date(date);
  const slot = pkg.availableDates.find(
    (d) => d.date.toDateString() === targetDate.toDateString()
  );

  if (!slot) {
    return { available: false, reason: 'Date not offered for this package' };
  }

  const remaining = slot.capacity - slot.bookedCount;

  if (paxCount && paxCount > remaining) {
    return { available: false, remaining, reason: 'Not enough capacity for requested pax count' };
  }

  if (pkg.maxPax && paxCount > pkg.maxPax) {
    return { available: false, remaining, reason: 'Pax count exceeds package maximum' };
  }

  return { available: true, remaining, capacity: slot.capacity, bookedCount: slot.bookedCount };
}

// ─── Price calculation ────────────────────────────────────────────────────

async function calculatePackagePrice(packageId, date, adults = 1, children = 0, infants = 0) {
  const pkg = await TourPackage.findById(packageId).select('pricing availableDates minPax maxPax');
  if (!pkg) {
    const err = new Error('Package not found');
    err.statusCode = 404;
    throw err;
  }

  const totalPax = adults + children + infants;

  if (pkg.minPax && totalPax < pkg.minPax) {
    const err = new Error(`Minimum ${pkg.minPax} passengers required`);
    err.statusCode = 400;
    throw err;
  }
  if (pkg.maxPax && totalPax > pkg.maxPax) {
    const err = new Error(`Maximum ${pkg.maxPax} passengers allowed`);
    err.statusCode = 400;
    throw err;
  }

  const adultAmount = pkg.pricing.adultPrice * adults;
  const childAmount = (pkg.pricing.childPrice || 0) * children;
  const infantAmount = (pkg.pricing.infantPrice || 0) * infants;
  const baseAmount = adultAmount + childAmount + infantAmount;

  // Apply best group discount
  let discountPercent = 0;
  if (pkg.pricing.groupDiscount && pkg.pricing.groupDiscount.length > 0) {
    const applicable = pkg.pricing.groupDiscount
      .filter((g) => totalPax >= g.minPax)
      .sort((a, b) => b.discountPercent - a.discountPercent);
    if (applicable.length > 0) {
      discountPercent = applicable[0].discountPercent;
    }
  }

  const discountAmount = (baseAmount * discountPercent) / 100;
  const total = baseAmount - discountAmount;

  return {
    adults,
    children,
    infants,
    adultUnitPrice: pkg.pricing.adultPrice,
    childUnitPrice: pkg.pricing.childPrice || 0,
    infantUnitPrice: pkg.pricing.infantPrice || 0,
    baseAmount,
    discounts: { percent: discountPercent, amount: discountAmount },
    total,
  };
}

// ─── Capacity management ──────────────────────────────────────────────────

async function decrementCapacity(packageId, date, count) {
  const targetDate = new Date(date);

  const result = await TourPackage.findOneAndUpdate(
    {
      _id: packageId,
      availableDates: {
        $elemMatch: {
          date: targetDate,
          $expr: { $lte: [{ $add: ['$availableDates.$[elem].bookedCount', count] }, '$availableDates.$[elem].capacity'] },
        },
      },
    },
    { $inc: { 'availableDates.$[elem].bookedCount': count } },
    {
      arrayFilters: [{ 'elem.date': targetDate }],
      new: true,
    }
  );

  if (!result) {
    // Fallback: attempt atomic increment without the capacity check expression (handles edge cases)
    const pkg = await TourPackage.findById(packageId).select('availableDates');
    if (!pkg) {
      const err = new Error('Package not found');
      err.statusCode = 404;
      throw err;
    }

    const slot = pkg.availableDates.find(
      (d) => d.date.toDateString() === targetDate.toDateString()
    );

    if (!slot) {
      const err = new Error('Date slot not found on package');
      err.statusCode = 404;
      throw err;
    }

    if (slot.bookedCount + count > slot.capacity) {
      const err = new Error('Insufficient capacity for this date');
      err.statusCode = 409;
      throw err;
    }

    const updated = await TourPackage.findOneAndUpdate(
      { _id: packageId, 'availableDates.date': targetDate },
      { $inc: { 'availableDates.$.bookedCount': count } },
      { new: true }
    );

    if (!updated) {
      const err = new Error('Failed to decrement capacity');
      err.statusCode = 500;
      throw err;
    }
    return updated;
  }

  return result;
}

async function incrementCapacity(packageId, date, count) {
  const targetDate = new Date(date);

  const result = await TourPackage.findOneAndUpdate(
    { _id: packageId, 'availableDates.date': targetDate },
    { $inc: { 'availableDates.$.bookedCount': -count } },
    { new: true }
  );

  if (!result) {
    const err = new Error('Package or date slot not found');
    err.statusCode = 404;
    throw err;
  }

  return result;
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
  togglePublish,
  checkDateAvailability,
  calculatePackagePrice,
  decrementCapacity,
  incrementCapacity,
};
