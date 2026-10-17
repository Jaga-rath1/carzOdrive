const mongoose = require('mongoose');
const { Vehicle } = require('../models/vehicle.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

/**
 * Create a vehicle for a vendor or admin.
 */
async function createVehicle(vendorId, data) {
  const status = data.status || 'APPROVED';
  const isPublished = data.isPublished !== undefined ? data.isPublished : (status === 'APPROVED');
  const vehicle = await Vehicle.create({
    vendorId: vendorId || null,
    status,
    isPublished,
    ...data,
  });
  return vehicle;
}

/**
 * Public search — only APPROVED + isPublished + isAvailable vehicles.
 */
async function listVehicles(query) {
  const { page, limit, skip } = getPagination(query);

  const filter = {
    status: 'APPROVED',
    isPublished: true,
    isAvailable: true,
  };

  if (query.city) filter['location.city'] = { $regex: query.city, $options: 'i' };
  if (query.vehicleType) filter.vehicleType = query.vehicleType.toUpperCase();
  if (query.category) filter.category = query.category.toLowerCase();
  if (query.brand) filter.brand = { $regex: query.brand, $options: 'i' };
  if (query.seats) filter.seats = { $gte: parseInt(query.seats, 10) };
  if (query.serviceType) filter.serviceTypes = { $in: [query.serviceType, query.serviceType.toUpperCase(), query.serviceType.toLowerCase()] };
  if (query.fuelType) filter.fuelType = { $regex: query.fuelType, $options: 'i' };
  if (query.transmission) filter.transmission = { $regex: query.transmission, $options: 'i' };
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === 'true' || query.isFeatured === true;

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

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
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
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Vehicle.countDocuments(filter),
  ]);

  return { vehicles, pagination: buildPaginationMeta(total, page, limit) };
}

/**
 * Get a single vehicle by id or slug, populating vendor info.
 */
async function getVehicleById(vehicleIdOrSlug) {
  const isObjectId = mongoose.Types.ObjectId.isValid(vehicleIdOrSlug);
  const filter = isObjectId ? { $or: [{ _id: vehicleIdOrSlug }, { slug: vehicleIdOrSlug }, { id: vehicleIdOrSlug }] } : { $or: [{ slug: vehicleIdOrSlug }, { id: vehicleIdOrSlug }] };

  let vehicle = await Vehicle.findOne(filter);
  if (!vehicle && !isObjectId) {
    vehicle = await Vehicle.findOne({
      $or: [{ slug: vehicleIdOrSlug }, { id: vehicleIdOrSlug }, { name: new RegExp(vehicleIdOrSlug, 'i') }]
    });
  }

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

  // Prevent vendors from changing approval-controlled fields (Admins can change them)
  if (vendorId !== null) {
    const restricted = ['status', 'approvedBy', 'approvedAt', 'isPublished', 'vendorId'];
    restricted.forEach((field) => delete data[field]);
  }

  if (data.pricePerDay && !data.priceNumeric) {
    data.priceNumeric = Number(data.pricePerDay);
  }
  if (data.depositNumeric && !data.securityDeposit) {
    data.securityDeposit = Number(data.depositNumeric);
  }

  Object.assign(vehicle, data);
  await vehicle.save();
  return vehicle;
}

/**
 * Approve a vehicle.
 */
async function approveVehicle(vehicleId, adminId) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
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
 * Reject a vehicle.
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
 * Toggle published state.
 */
async function togglePublish(vehicleId, vendorId, isPublished) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }
  if (vendorId && vehicle.vendorId?.toString() !== vendorId.toString()) {
    const err = new Error('You do not own this vehicle');
    err.statusCode = 403;
    throw err;
  }
  vehicle.isPublished = isPublished;
  await vehicle.save();
  return vehicle;
}

/**
 * Delete vehicle (Admin or Owner Vendor).
 */
async function deleteVehicle(vehicleId, vendorId) {
  const filter = { _id: vehicleId };
  if (vendorId) filter.vendorId = vendorId;
  const vehicle = await Vehicle.findOneAndDelete(filter);
  if (!vehicle) {
    const err = new Error('Vehicle not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  return true;
}

module.exports = {
  createVehicle,
  listVehicles,
  listVendorVehicles,
  listAdminVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  approveVehicle,
  rejectVehicle,
  togglePublish,
};
