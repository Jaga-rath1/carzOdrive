const mongoose = require('mongoose');
const { Bike } = require('../models/bike.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const cache = require('../utils/cache');

const PUBLIC_BIKE_FIELDS = {
  id: 1,
  slug: 1,
  name: 1,
  brand: 1,
  make: 1,
  model: 1,
  type: 1,
  category: 1,
  vehicleType: 1,
  bikeType: 1,
  year: 1,
  buyingYear: 1,
  color: 1,
  tagline: 1,
  image: 1,
  images: 1,
  secondaryImages: 1,
  gallery: 1,
  pricePerDay: 1,
  pricePerHour: 1,
  priceNumeric: 1,
  priceDisplay: 1,
  deposit: 1,
  depositNumeric: 1,
  extraKmCharge: 1,
  rating: 1,
  reviewsCount: 1,
  isAvailable: 1,
  availabilityStatus: 1,
  availableCount: 1,
  quantity: 1,
  badge: 1,
  isFeatured: 1,
  engineCapacity: 1,
  engineCC: 1,
  power: 1,
  torque: 1,
  mileage: 1,
  topSpeed: 1,
  dryWeight: 1,
  transmission: 1,
  fuelType: 1,
  brakes: 1,
  specs: 1,
  features: 1,
  gearIncluded: 1,
  inclusions: 1,
  rules: 1,
  location: 1,
  pricing: 1,
  status: 1,
  isPublished: 1,
  createdAt: 1,
  updatedAt: 1,
};

function invalidateBikeCache() {
  cache.invalidatePrefix('bikes:');
}

async function createBike(vendorId, data) {
  const status = data.status || 'APPROVED';
  const isPublished = data.isPublished !== undefined ? data.isPublished : true;
  const bike = await Bike.create({ vendorId: vendorId || null, status, isPublished, ...data });
  invalidateBikeCache();
  return bike;
}

async function listBikes(query) {
  const cacheKey = `bikes:public:${JSON.stringify(query)}`;

  return cache.wrap(cacheKey, 60, async () => {
    const { page, limit, skip } = getPagination(query);
    const filter = {
      status: 'APPROVED',
      isPublished: true,
    };

    if (query.isAvailable !== undefined) {
      filter.isAvailable = query.isAvailable === 'true' || query.isAvailable === true;
    }

    if (query.city) {
      filter['location.city'] = new RegExp(query.city, 'i');
    }
    if (query.bikeType) {
      filter.bikeType = query.bikeType.toUpperCase();
    }
    if (query.category) {
      filter.category = new RegExp(query.category, 'i');
    }
    if (query.brand) {
      filter.brand = new RegExp(query.brand, 'i');
    }
    if (query.isFeatured !== undefined) {
      filter.isFeatured = query.isFeatured === 'true' || query.isFeatured === true;
    }
    if (query.search || query.q) {
      const searchRegex = new RegExp(query.search || query.q, 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { make: searchRegex },
        { model: searchRegex },
        { category: searchRegex },
      ];
    }

    const [bikes, total] = await Promise.all([
      Bike.find(filter, PUBLIC_BIKE_FIELDS)
        .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Bike.countDocuments(filter),
    ]);

    return { bikes, pagination: buildPaginationMeta(total, page, limit) };
  });
}

async function listVendorBikes(vendorId, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { vendorId };

  if (query.status) filter.status = query.status;
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === 'true';

  const [bikes, total] = await Promise.all([
    Bike.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
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
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Bike.countDocuments(filter),
  ]);

  return { bikes, pagination: buildPaginationMeta(total, page, limit) };
}

async function getBikeById(bikeIdOrSlug) {
  const cacheKey = `bikes:detail:${bikeIdOrSlug}`;

  return cache.wrap(cacheKey, 60, async () => {
    const isObjectId = mongoose.Types.ObjectId.isValid(bikeIdOrSlug);
    const filter = isObjectId
      ? { $or: [{ _id: bikeIdOrSlug }, { slug: bikeIdOrSlug }, { id: bikeIdOrSlug }] }
      : { $or: [{ slug: bikeIdOrSlug }, { id: bikeIdOrSlug }] };

    let bike = await Bike.findOne(filter).lean();
    if (!bike && !isObjectId) {
      bike = await Bike.findOne({
        $or: [{ slug: bikeIdOrSlug }, { id: bikeIdOrSlug }, { name: new RegExp(bikeIdOrSlug, 'i') }],
      }).lean();
    }

    if (!bike) {
      const err = new Error('Bike not found');
      err.statusCode = 404;
      throw err;
    }
    return bike;
  });
}

async function updateBike(bikeId, vendorId, data) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  if (vendorId !== null) {
    if (bike.vendorId && String(bike.vendorId) !== String(vendorId)) {
      const err = new Error('You do not own this bike');
      err.statusCode = 403;
      throw err;
    }
    const protectedFields = ['status', 'approvedBy', 'approvedAt', 'isPublished', 'vendorId'];
    protectedFields.forEach((f) => delete data[f]);
  }

  if (data.pricePerDay && !data.priceNumeric) {
    data.priceNumeric = Number(data.pricePerDay);
  }
  if (data.depositNumeric) {
    data.pricing = {
      ...(bike.pricing || {}),
      ...(data.pricing || {}),
      securityDeposit: Number(data.depositNumeric),
    };
  }

  Object.assign(bike, data);
  await bike.save();
  invalidateBikeCache();
  return bike.toObject ? bike.toObject() : bike;
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
  invalidateBikeCache();
  return bike.toObject ? bike.toObject() : bike;
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
  invalidateBikeCache();
  return bike.toObject ? bike.toObject() : bike;
}

async function togglePublish(bikeId, vendorId, isPublished) {
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }

  const ownerMatch = vendorId ? String(bike.vendorId) === String(vendorId) : true;
  if (!ownerMatch) {
    const err = new Error('You do not own this bike');
    err.statusCode = 403;
    throw err;
  }

  bike.isPublished = Boolean(isPublished);
  await bike.save();
  invalidateBikeCache();
  return bike.toObject ? bike.toObject() : bike;
}

async function deleteBike(bikeId, vendorId) {
  const filter = { _id: bikeId };
  if (vendorId) filter.vendorId = vendorId;
  const bike = await Bike.findOneAndDelete(filter);
  if (!bike) {
    const err = new Error('Bike not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  invalidateBikeCache();
  return true;
}

module.exports = {
  createBike,
  listBikes,
  listVendorBikes,
  listAdminBikes,
  getBikeById,
  updateBike,
  deleteBike,
  approveBike,
  rejectBike,
  togglePublish,
  invalidateBikeCache,
};
