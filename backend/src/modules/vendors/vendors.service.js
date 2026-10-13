const Vendor = require('./vendors.model');
const { User } = require('../auth/auth.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

function AppError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const ALLOWED_UPDATE_FIELDS = [
  'businessName',
  'contactPhone',
  'contactEmail',
  'address',
  'description',
  'documents',
];

async function applyAsVendor(userId, data) {
  const existing = await Vendor.findOne({ userId });
  if (existing) {
    throw AppError('You have already applied as a vendor', 409);
  }

  const vendor = await Vendor.create({
    userId,
    businessName: data.businessName,
    vendorType: data.vendorType,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    address: data.address,
    description: data.description,
    documents: data.documents || [],
  });

  await User.findByIdAndUpdate(userId, { vendorId: vendor._id });

  return vendor;
}

async function getMyVendorProfile(userId) {
  const vendor = await Vendor.findOne({ userId });
  if (!vendor) {
    throw AppError('Vendor profile not found', 404);
  }
  return vendor;
}

async function updateVendorProfile(userId, data) {
  const vendor = await Vendor.findOne({ userId });
  if (!vendor) {
    throw AppError('Vendor profile not found', 404);
  }

  const updates = {};
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  const updated = await Vendor.findByIdAndUpdate(vendor._id, updates, { new: true, runValidators: true });
  return updated;
}

async function listVendors(query) {
  const { page, limit, skip } = getPagination(query);

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.vendorType) filter.vendorType = query.vendorType;
  if (query.search) {
    filter.$or = [
      { businessName: new RegExp(query.search, 'i') },
      { contactEmail: new RegExp(query.search, 'i') },
      { contactPhone: new RegExp(query.search, 'i') },
    ];
  }

  const [vendors, total] = await Promise.all([
    Vendor.find(filter)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Vendor.countDocuments(filter),
  ]);

  return { vendors, pagination: buildPaginationMeta(total, page, limit) };
}

async function getVendorById(vendorId) {
  const vendor = await Vendor.findById(vendorId).populate('userId', 'name email');
  if (!vendor) {
    throw AppError('Vendor not found', 404);
  }
  return vendor;
}

async function approveVendor(vendorId, adminId) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw AppError('Vendor not found', 404);
  }

  vendor.status = 'APPROVED';
  vendor.approvedBy = adminId;
  vendor.approvedAt = new Date();
  vendor.rejectionReason = undefined;
  await vendor.save();

  await User.findByIdAndUpdate(vendor.userId, { role: 'VENDOR' });

  return vendor;
}

async function rejectVendor(vendorId, adminId, reason) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw AppError('Vendor not found', 404);
  }

  vendor.status = 'REJECTED';
  vendor.rejectedBy = adminId;
  vendor.rejectedAt = new Date();
  vendor.rejectionReason = reason;
  await vendor.save();

  return vendor;
}

async function suspendVendor(vendorId, adminId, reason) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw AppError('Vendor not found', 404);
  }

  vendor.status = 'SUSPENDED';
  vendor.suspensionReason = reason;
  await vendor.save();

  await User.findByIdAndUpdate(vendor.userId, { status: 'SUSPENDED' });

  return vendor;
}

async function reactivateVendor(vendorId, adminId) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw AppError('Vendor not found', 404);
  }

  vendor.status = 'APPROVED';
  vendor.suspensionReason = undefined;
  await vendor.save();

  await User.findByIdAndUpdate(vendor.userId, { status: 'ACTIVE' });

  return vendor;
}

module.exports = {
  applyAsVendor,
  getMyVendorProfile,
  updateVendorProfile,
  listVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  suspendVendor,
  reactivateVendor,
};
