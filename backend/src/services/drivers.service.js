const mongoose = require('mongoose');
const { Driver } = require('../models/driver.model');
const { User } = require('../models/user.model');
const { DriverRegistrationSubmission } = require('../models/partner.model');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const cache = require('../utils/cache');

function invalidateDriverCache() {
  cache.invalidatePrefix('drivers:');
}

async function applyAsDriver(userId, data) {
  return registerDriver(userId, data);
}

/**
 * Register Driver Application (Stores in carzodrive_partners database)
 */
async function registerDriver(userId, data) {
  // Build documents list
  const docs = Array.isArray(data.documents) ? [...data.documents] : [];
  if (data.drivingLicenseDoc && !docs.some((d) => d.type === 'Driving License')) {
    docs.push({ type: 'Driving License', url: data.drivingLicenseDoc, name: 'Commercial Driving License', verified: false });
  }
  if (data.idProofDoc && !docs.some((d) => d.type === 'Aadhaar / Govt ID')) {
    docs.push({ type: 'Aadhaar / Govt ID', url: data.idProofDoc, name: 'Identity Proof', verified: false });
  }
  if (data.profilePhotoDoc && !docs.some((d) => d.type === 'Profile Photo')) {
    docs.push({ type: 'Profile Photo', url: data.profilePhotoDoc, name: 'Driver Portrait', verified: false });
  }
  if (data.addressProofDoc && !docs.some((d) => d.type === 'Address Proof')) {
    docs.push({ type: 'Address Proof', url: data.addressProofDoc, name: 'Address Document', verified: false });
  }

  const slug = `partner-driver-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const yearsExp = data.drivingExperience ? parseInt(String(data.drivingExperience), 10) || 5 : 5;
  const fullName = data.fullName || data.name || 'Driver Applicant';

  // Check if a registration already exists in carzodrive_partners for this user or phone
  let submission = null;
  if (userId) {
    submission = await DriverRegistrationSubmission.findOne({ userId });
  } else if (data.phone) {
    submission = await DriverRegistrationSubmission.findOne({ phone: data.phone });
  }

  if (submission) {
    submission.fullName = fullName;
    submission.name = fullName;
    submission.phone = data.phone || submission.phone;
    submission.email = data.email || submission.email;
    submission.city = data.city || submission.city;
    submission.dob = data.dob || submission.dob;
    submission.address = data.address || submission.address;
    submission.drivingExperience = yearsExp;
    submission.experienceYears = yearsExp;
    submission.experience = String(yearsExp);
    submission.licenseNumber = data.licenseNumber ? data.licenseNumber.toUpperCase() : submission.licenseNumber;
    submission.licenseType = data.licenseType || submission.licenseType;
    submission.vehicleType = data.vehicleType || submission.vehicleType;
    submission.languages = data.languages && data.languages.length > 0 ? data.languages : submission.languages;
    submission.serviceArea = [data.city || 'Bhubaneswar', 'Cuttack', 'Puri'];
    submission.photo = data.profilePhotoDoc || data.photo || submission.photo;
    submission.avatar = data.profilePhotoDoc || data.avatar || submission.avatar;
    submission.drivingLicenseDoc = data.drivingLicenseDoc || submission.drivingLicenseDoc;
    submission.idProofDoc = data.idProofDoc || submission.idProofDoc;
    submission.profilePhotoDoc = data.profilePhotoDoc || submission.profilePhotoDoc;
    submission.addressProofDoc = data.addressProofDoc || submission.addressProofDoc;
    submission.documents = docs.length > 0 ? docs : submission.documents;
    submission.status = 'PENDING';
    submission.isAvailable = false;
    await submission.save();
    return submission;
  }

  // Create new partner registration record in carzodrive_partners DB
  submission = await DriverRegistrationSubmission.create({
    id: slug,
    slug,
    userId: userId || null,
    fullName,
    name: fullName,
    phone: data.phone,
    email: data.email,
    city: data.city || 'Bhubaneswar',
    dob: data.dob,
    address: data.address || `${data.city || 'Bhubaneswar'}, Odisha`,
    drivingExperience: yearsExp,
    experience: String(yearsExp),
    experienceYears: yearsExp,
    licenseNumber: data.licenseNumber ? data.licenseNumber.toUpperCase() : `OD-${Date.now().toString(36).toUpperCase()}`,
    licenseType: data.licenseType || 'COMMERCIAL',
    vehicleType: data.vehicleType || 'CAB_SEDAN',
    languages: data.languages && data.languages.length > 0 ? data.languages : ['Odia', 'Hindi', 'English'],
    serviceArea: [data.city || 'Bhubaneswar', 'Cuttack', 'Puri'],
    photo: data.profilePhotoDoc || data.photo || null,
    avatar: data.profilePhotoDoc || data.avatar || null,
    drivingLicenseDoc: data.drivingLicenseDoc,
    idProofDoc: data.idProofDoc,
    profilePhotoDoc: data.profilePhotoDoc,
    addressProofDoc: data.addressProofDoc,
    documents: docs,
    status: 'PENDING',
    isAvailable: false,
    rating: 5.0,
    tripsCount: 0,
    hourlyRate: 120,
    dailyRate: 899,
  });

  return submission;
}

async function getMyDriverProfile(userId) {
  // Check partner submissions first
  let profile = await DriverRegistrationSubmission.findOne({ userId });
  if (!profile) {
    profile = await Driver.findOne({ userId });
  }
  if (!profile) {
    const err = new Error('Driver profile not found');
    err.statusCode = 404;
    throw err;
  }
  return profile;
}

async function updateDriverProfile(driverId, userId, data) {
  let driver = null;
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    driver = await DriverRegistrationSubmission.findById(driverId);
  }
  if (!driver) {
    driver = await DriverRegistrationSubmission.findOne({ id: driverId });
  }

  if (driver) {
    if (userId && driver.userId && String(driver.userId) !== String(userId)) {
      const err = new Error('You do not own this driver profile');
      err.statusCode = 403;
      throw err;
    }
    const protectedFields = ['status', 'approvedBy', 'approvedAt', 'isAvailable', 'rating'];
    if (userId) {
      protectedFields.forEach((f) => delete data[f]);
    }
    Object.assign(driver, data);
    await driver.save();
    return driver;
  }

  const legacyDriver = await Driver.findById(driverId);
  if (!legacyDriver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  Object.assign(legacyDriver, data);
  await legacyDriver.save();
  return legacyDriver;
}

/**
 * List drivers (Admin portal audits carzodrive_partners + live drivers)
 */
async function listDrivers(query = {}) {
  const cacheKey = `drivers:list:${JSON.stringify(query)}`;

  return cache.wrap(cacheKey, 60, async () => {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.status && query.status !== 'ALL') {
      filter.status = query.status;
    }
    if (query.isAvailable !== undefined) {
      filter.isAvailable = query.isAvailable === 'true';
    }
    if (query.serviceArea) {
      filter.serviceArea = { $in: [new RegExp(query.serviceArea, 'i')] };
    }

    // Fetch partner registrations with .lean() to eliminate Mongoose document overhead
    const partnerDrivers = await DriverRegistrationSubmission.find(filter).sort({ createdAt: -1 }).lean();

    // Fetch primary DB catalog drivers with .lean()
    const legacyDrivers = await Driver.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).lean();

    // Combine results with priority given to partner registrations
    const combined = [...partnerDrivers];
    legacyDrivers.forEach((ld) => {
      if (!combined.some((d) => d.licenseNumber === ld.licenseNumber || d.slug === ld.slug || d.id === ld.id || String(d._id) === String(ld._id))) {
        combined.push(ld);
      }
    });

function normalizeDriverDocuments(driverObj) {
  if (!driverObj) return driverObj;

  if (Array.isArray(driverObj.documents)) {
    driverObj.documents.forEach((doc) => {
      if (!doc || !doc.url) return;
      const lowerType = (doc.type || doc.name || '').toLowerCase();
      if (!driverObj.drivingLicenseDoc && (lowerType.includes('license') || lowerType.includes('dl'))) {
        driverObj.drivingLicenseDoc = doc.url;
      }
      if (!driverObj.idProofDoc && (lowerType.includes('id') || lowerType.includes('aadhaar') || lowerType.includes('pan') || lowerType.includes('voter'))) {
        driverObj.idProofDoc = doc.url;
      }
      if (!driverObj.profilePhotoDoc && (lowerType.includes('photo') || lowerType.includes('portrait') || lowerType.includes('avatar'))) {
        driverObj.profilePhotoDoc = doc.url;
      }
      if (!driverObj.addressProofDoc && (lowerType.includes('address') || lowerType.includes('bill') || lowerType.includes('rent'))) {
        driverObj.addressProofDoc = doc.url;
      }
    });
  }

  if (!Array.isArray(driverObj.documents) || driverObj.documents.length === 0) {
    driverObj.documents = [];
    if (driverObj.drivingLicenseDoc) {
      driverObj.documents.push({
        type: 'Commercial Driving License',
        url: driverObj.drivingLicenseDoc,
        name: 'Driving License Scan',
        verified: driverObj.status === 'APPROVED',
      });
    }
    if (driverObj.idProofDoc) {
      driverObj.documents.push({
        type: 'Government ID Proof',
        url: driverObj.idProofDoc,
        name: 'Aadhaar / Passport Scan',
        verified: driverObj.status === 'APPROVED',
      });
    }
    if (driverObj.profilePhotoDoc) {
      driverObj.documents.push({
        type: 'Profile Photo',
        url: driverObj.profilePhotoDoc,
        name: 'Driver Portrait',
        verified: driverObj.status === 'APPROVED',
      });
    }
    if (driverObj.addressProofDoc) {
      driverObj.documents.push({
        type: 'Address Proof',
        url: driverObj.addressProofDoc,
        name: 'Residential Address Scan',
        verified: driverObj.status === 'APPROVED',
      });
    }
  }

  return driverObj;
}

  const total = combined.length;
  const paginatedList = combined.slice(skip, skip + limit).map(normalizeDriverDocuments);

    return { drivers: paginatedList, pagination: buildPaginationMeta(total, page, limit) };
  });
}

async function getDriverById(driverId) {
  let driver = null;
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    driver = await DriverRegistrationSubmission.findById(driverId);
  }
  if (!driver) {
    driver = await DriverRegistrationSubmission.findOne({ $or: [{ id: driverId }, { slug: driverId }] });
  }

  if (driver) return normalizeDriverDocuments(driver.toObject ? driver.toObject() : driver);

  if (mongoose.Types.ObjectId.isValid(driverId)) {
    driver = await Driver.findById(driverId).populate('userId', 'name email phone');
  }
  if (!driver) {
    driver = await Driver.findOne({ id: driverId }).populate('userId', 'name email phone');
  }
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  return normalizeDriverDocuments(driver.toObject ? driver.toObject() : driver);
}

/**
 * Admin approves a driver:
 * 1. Updates verification in carzodrive_partners
 * 2. Automatically syncs/publishes verified driver into live carzodrive.drivers catalog
 */
async function approveDriver(driverId, adminId) {
  let submission = null;
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    submission = await DriverRegistrationSubmission.findById(driverId);
  }
  if (!submission) {
    submission = await DriverRegistrationSubmission.findOne({ $or: [{ id: driverId }, { slug: driverId }] });
  }

  if (submission) {
    submission.status = 'APPROVED';
    submission.isAvailable = true;
    submission.approvedBy = String(adminId || 'SuperAdmin');
    submission.approvedAt = new Date();
    submission.rejectionReason = undefined;
    submission.suspensionReason = undefined;
    if (submission.documents && submission.documents.length > 0) {
      submission.documents.forEach((d) => {
        d.verified = true;
      });
    }

    // Publish to live carzodrive.drivers collection
    let liveDriver = null;
    if (submission.publishedDriverId) {
      liveDriver = await Driver.findById(submission.publishedDriverId);
    }
    if (!liveDriver && submission.licenseNumber) {
      liveDriver = await Driver.findOne({ licenseNumber: submission.licenseNumber });
    }

    if (!liveDriver) {
      liveDriver = await Driver.create({
        id: submission.id || submission.slug,
        userId: submission.userId ? submission.userId : undefined,
        name: submission.fullName || submission.name,
        phone: submission.phone,
        email: submission.email,
        city: submission.city || 'Bhubaneswar',
        dob: submission.dob,
        experience: String(submission.experienceYears || submission.drivingExperience || 5),
        experienceYears: submission.experienceYears || submission.drivingExperience || 5,
        licenseNumber: submission.licenseNumber,
        licenseType: submission.licenseType || 'COMMERCIAL',
        vehicleType: submission.vehicleType || 'CAB_SEDAN',
        languages: submission.languages && submission.languages.length > 0 ? submission.languages : ['Odia', 'Hindi', 'English'],
        serviceArea: submission.serviceArea && submission.serviceArea.length > 0 ? submission.serviceArea : ['Bhubaneswar', 'Cuttack', 'Puri'],
        photo: submission.profilePhotoDoc || submission.photo || null,
        avatar: submission.profilePhotoDoc || submission.avatar || null,
        drivingLicenseDoc: submission.drivingLicenseDoc,
        idProofDoc: submission.idProofDoc,
        profilePhotoDoc: submission.profilePhotoDoc,
        addressProofDoc: submission.addressProofDoc,
        documents: submission.documents,
        status: 'APPROVED',
        isAvailable: true,
        rating: 5.0,
        tripsCount: 0,
        hourlyRate: submission.hourlyRate || 120,
        dailyRate: submission.dailyRate || 899,
        approvedBy: adminId || null,
        approvedAt: new Date(),
      });
    } else {
      liveDriver.status = 'APPROVED';
      liveDriver.isAvailable = true;
      liveDriver.documents = submission.documents;
      liveDriver.approvedBy = adminId || null;
      liveDriver.approvedAt = new Date();
      await liveDriver.save();
    }

    submission.publishedDriverId = String(liveDriver._id);
    await submission.save();
    return submission;
  }

  // Fallback: approve in primary DB
  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.status = 'APPROVED';
  driver.isAvailable = true;
  driver.approvedBy = adminId;
  driver.approvedAt = new Date();
  driver.rejectionReason = undefined;
  driver.suspensionReason = undefined;
  if (driver.documents && driver.documents.length > 0) {
    driver.documents.forEach((d) => {
      d.verified = true;
    });
  }
  await driver.save();
  return driver;
}

async function rejectDriver(driverId, adminId, reason) {
  let submission = null;
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    submission = await DriverRegistrationSubmission.findById(driverId);
  }
  if (!submission) {
    submission = await DriverRegistrationSubmission.findOne({ $or: [{ id: driverId }, { slug: driverId }] });
  }

  if (submission) {
    submission.status = 'REJECTED';
    submission.rejectionReason = reason || 'Verification documents incomplete or invalid';
    submission.isAvailable = false;
    await submission.save();

    if (submission.publishedDriverId) {
      await Driver.findByIdAndUpdate(submission.publishedDriverId, {
        status: 'REJECTED',
        isAvailable: false,
        rejectionReason: reason,
      });
    }
    return submission;
  }

  const driver = await Driver.findById(driverId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  driver.status = 'REJECTED';
  driver.rejectionReason = reason || 'Verification documents incomplete or invalid';
  driver.isAvailable = false;
  await driver.save();
  return driver;
}

async function suspendDriver(driverId, adminId, reason) {
  let submission = null;
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    submission = await DriverRegistrationSubmission.findById(driverId);
  }
  if (!submission) {
    submission = await DriverRegistrationSubmission.findOne({ $or: [{ id: driverId }, { slug: driverId }] });
  }

  if (submission) {
    submission.status = 'SUSPENDED';
    submission.suspensionReason = reason || 'Administrative review';
    submission.isAvailable = false;
    await submission.save();

    if (submission.publishedDriverId) {
      await Driver.findByIdAndUpdate(submission.publishedDriverId, {
        status: 'SUSPENDED',
        isAvailable: false,
        suspensionReason: reason,
      });
    }
    return submission;
  }

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

/**
 * Get available verified drivers for customers during booking (Strictly from live catalog)
 */
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

    try {
      const { Booking } = require('../models/booking.model');
      const busyDriverIds = await Booking.distinct('driverId', {
        driverId: { $in: drivers.map((d) => d._id) },
        status: { $in: ['CONFIRMED', 'ASSIGNED', 'ACTIVE'] },
        startDate: { $lt: end },
        endDate: { $gt: start },
      });
      const busySet = new Set(busyDriverIds.map(String));
      drivers = drivers.filter((d) => !busySet.has(String(d._id)));
    } catch (_) {
      // Booking model not available; skip booking check
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

/**
 * Super Admin directly creates and publishes a driver into the live fleet
 */
async function createDriverDirectly(data, adminId) {
  const {
    name,
    fullName,
    phone,
    email,
    city = 'Bhubaneswar',
    licenseNumber,
    licenseType = 'COMMERCIAL',
    vehicleType = 'CAB_SEDAN',
    experienceYears = 5,
    drivingExperience = 5,
    hourlyRate = 120,
    dailyRate = 799,
    photo,
    avatar,
    drivingLicenseDoc,
    idProofDoc,
    languages = ['Odia', 'Hindi', 'English'],
    serviceArea = ['Bhubaneswar', 'Cuttack', 'Puri'],
    title = 'Executive Driver & Verified Pilot',
  } = data;

  const driverName = (fullName || name || '').trim();
  if (!driverName) {
    const err = new Error('Driver name is required');
    err.statusCode = 400;
    throw err;
  }
  if (!phone) {
    const err = new Error('Driver phone number is required');
    err.statusCode = 400;
    throw err;
  }
  if (!licenseNumber) {
    const err = new Error('Driver license number is required');
    err.statusCode = 400;
    throw err;
  }

  const slug = `driver-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const yearsExp = parseInt(String(experienceYears || drivingExperience || 5), 10) || 5;

  const docs = Array.isArray(data.documents) ? [...data.documents] : [];
  if (drivingLicenseDoc && !docs.some((d) => d.type === 'Driving License')) {
    docs.push({ type: 'Driving License', url: drivingLicenseDoc, name: 'Commercial Driving License', verified: true });
  }
  if (idProofDoc && !docs.some((d) => d.type === 'Aadhaar / Govt ID')) {
    docs.push({ type: 'Aadhaar / Govt ID', url: idProofDoc, name: 'Identity Proof', verified: true });
  }

  // 1. Create in Live carzodrive.drivers catalog
  const liveDriver = await Driver.create({
    id: slug,
    name: driverName,
    title,
    phone: phone.trim(),
    email: email ? email.toLowerCase().trim() : undefined,
    city,
    licenseNumber: licenseNumber.toUpperCase().trim(),
    licenseType,
    vehicleType,
    experienceYears: yearsExp,
    experience: String(yearsExp),
    hourlyRate: Number(hourlyRate) || 120,
    dailyRate: Number(dailyRate) || 899,
    photo: photo || avatar || null,
    avatar: avatar || photo || null,
    drivingLicenseDoc: drivingLicenseDoc || null,
    idProofDoc: idProofDoc || null,
    documents: docs,
    languages: Array.isArray(languages) && languages.length > 0 ? languages : ['Odia', 'Hindi', 'English'],
    serviceArea: Array.isArray(serviceArea) && serviceArea.length > 0 ? serviceArea : [city, 'Cuttack', 'Puri'],
    status: 'APPROVED',
    isAvailable: true,
    rating: 5.0,
    tripsCount: 0,
    approvedBy: adminId || 'SuperAdmin',
    approvedAt: new Date(),
  });

  // 2. Also register in partner database (carzodrive_partners.driver_registrations) as pre-approved
  try {
    await DriverRegistrationSubmission.create({
      id: slug,
      slug,
      fullName: driverName,
      name: driverName,
      phone: phone.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      city,
      licenseNumber: licenseNumber.toUpperCase().trim(),
      licenseType,
      vehicleType,
      experienceYears: yearsExp,
      drivingExperience: yearsExp,
      hourlyRate: Number(hourlyRate) || 120,
      dailyRate: Number(dailyRate) || 899,
      photo: photo || avatar || null,
      avatar: avatar || photo || null,
      drivingLicenseDoc: drivingLicenseDoc || null,
      idProofDoc: idProofDoc || null,
      documents: docs,
      languages: Array.isArray(languages) && languages.length > 0 ? languages : ['Odia', 'Hindi', 'English'],
      serviceArea: Array.isArray(serviceArea) && serviceArea.length > 0 ? serviceArea : [city, 'Cuttack', 'Puri'],
      status: 'APPROVED',
      isAvailable: true,
      publishedDriverId: String(liveDriver._id),
      approvedBy: adminId || 'SuperAdmin',
      approvedAt: new Date(),
      approvalNotes: 'Directly enrolled into fleet by Super Admin',
    });
  } catch (syncErr) {
    console.warn('Partner driver registration sync warning:', syncErr.message);
  }

  return liveDriver;
}

/**
 * Super Admin permanently deletes a driver from both live fleet and partner registry
 */
async function deleteDriver(driverId) {
  let deletedFromMain = null;
  let deletedFromPartner = null;

  if (mongoose.Types.ObjectId.isValid(driverId)) {
    deletedFromMain = await Driver.findByIdAndDelete(driverId);
    deletedFromPartner = await DriverRegistrationSubmission.findByIdAndDelete(driverId);
  }
  if (!deletedFromMain) {
    deletedFromMain = await Driver.findOneAndDelete({ $or: [{ id: driverId }, { slug: driverId }] });
  }
  if (!deletedFromPartner) {
    deletedFromPartner = await DriverRegistrationSubmission.findOneAndDelete({
      $or: [{ id: driverId }, { slug: driverId }, { publishedDriverId: String(driverId) }]
    });
  }

  // Cross-delete if publishedDriverId was mapped
  if (deletedFromPartner?.publishedDriverId) {
    await Driver.findByIdAndDelete(deletedFromPartner.publishedDriverId).catch(() => {});
  }
  if (deletedFromMain?._id) {
    await DriverRegistrationSubmission.deleteMany({ publishedDriverId: String(deletedFromMain._id) }).catch(() => {});
  }

  return { success: true, message: 'Driver deleted successfully' };
}

module.exports = {
  applyAsDriver,
  registerDriver,
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
  createDriverDirectly,
  deleteDriver,
};
