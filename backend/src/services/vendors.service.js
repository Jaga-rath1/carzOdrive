const mongoose = require('mongoose');
const { Vehicle } = require('../models/vehicle.model');
const { Bike } = require('../models/bike.model');
const { User } = require('../models/user.model');
const { PartnerCarSubmission, PartnerBikeSubmission } = require('../models/partner.model');
const { ROLES } = require('../config/constants');

/**
 * Find or create a Vendor user account for the submitting owner
 */
async function findOrCreateVendorUser({ name, phone, email, city }) {
  let user = null;
  if (email) {
    user = await User.findOne({ email: email.toLowerCase().trim() });
  } else if (phone) {
    user = await User.findOne({ phone: phone.trim() });
  }

  if (!user) {
    const randomPassword = 'Vnd-' + Math.random().toString(36).slice(-8) + 'X!';
    user = await User.create({
      name: name || 'Partner Host',
      email: email ? email.toLowerCase().trim() : `${phone.replace(/[^0-9]/g, '')}@vendor.carzodrive.com`,
      phone: phone ? phone.trim() : undefined,
      password: randomPassword,
      role: ROLES.VENDOR || 'VENDOR',
      status: 'ACTIVE',
      city: city || 'Bhubaneswar',
      vendorProfile: {
        businessName: name,
        kycStatus: 'PENDING',
        totalVehicles: 1,
        totalEarnings: 0,
      },
    });
  } else {
    if (user.role === 'CUSTOMER') {
      user.role = ROLES.VENDOR || 'VENDOR';
    }
    if (!user.vendorProfile) {
      user.vendorProfile = {
        businessName: name || user.name,
        kycStatus: 'PENDING',
        totalVehicles: 1,
        totalEarnings: 0,
      };
    } else {
      user.vendorProfile.totalVehicles = (user.vendorProfile.totalVehicles || 0) + 1;
    }
    await user.save();
  }
  return user;
}

/**
 * Attach a car from "Rent Your Car" (Stores in carzodrive_partners database)
 */
async function attachCar(ownerData, vehicleData) {
  const user = await findOrCreateVendorUser(ownerData);

  const priceDaily = parseInt(String(vehicleData.expectedDailyPrice || 2500).replace(/[^0-9]/g, ''), 10) || 2500;
  const brand = vehicleData.vehicleBrand || vehicleData.brand || 'Host Vehicle';
  const model = vehicleData.vehicleModel || vehicleData.model || 'Rental Car';
  const fullName = `${brand} ${model}`;
  const slug = `partner-car-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  // Build structured documents array
  const carDocs = Array.isArray(vehicleData.documents) ? [...vehicleData.documents] : [];
  if (vehicleData.rcDocumentUrl && !carDocs.some((d) => d.type === 'RC Document')) {
    carDocs.push({ type: 'RC Document', url: vehicleData.rcDocumentUrl, name: 'Vehicle Registration Certificate (RC)', verified: false });
  }
  if (vehicleData.insuranceDocumentUrl && !carDocs.some((d) => d.type === 'Insurance Policy')) {
    carDocs.push({ type: 'Insurance Policy', url: vehicleData.insuranceDocumentUrl, name: 'Valid Insurance Certificate', verified: false });
  }
  if (vehicleData.idProofUrl && !carDocs.some((d) => d.type === 'Owner ID Proof')) {
    carDocs.push({ type: 'Owner ID Proof', url: vehicleData.idProofUrl, name: 'Owner Government ID / PAN', verified: false });
  }
  if (vehicleData.image && !carDocs.some((d) => d.type === 'Vehicle Photo')) {
    carDocs.push({ type: 'Vehicle Photo', url: vehicleData.image, name: 'Car Exterior Photo', verified: false });
  }

  // Save to carzodrive_partners database
  const submission = await PartnerCarSubmission.create({
    id: slug,
    slug,
    vendorId: user._id,
    ownerName: ownerData.ownerName || ownerData.name,
    ownerPhone: ownerData.phone,
    ownerEmail: ownerData.email,
    city: ownerData.city || 'Bhubaneswar',
    address: vehicleData.address || `${ownerData.city || 'Bhubaneswar'} Partner Hub`,
    vehicleBrand: brand,
    vehicleModel: model,
    name: fullName,
    vehicleNumber: vehicleData.vehicleNumber ? vehicleData.vehicleNumber.toUpperCase() : undefined,
    vehicleType: vehicleData.vehicleType || 'Executive Sedan',
    manufacturingYear: parseInt(vehicleData.manufacturingYear, 10) || 2023,
    expectedDailyPrice: priceDaily,
    fuelType: vehicleData.fuelType || 'Petrol',
    transmission: vehicleData.transmission || 'Manual',
    seats: parseInt(vehicleData.seats, 10) || 5,
    color: vehicleData.color || 'Standard',
    features: [
      'Comprehensive Partner Insurance Cover',
      'Dual Front Airbags & ABS with EBD',
      'High-Efficiency Climate Control AC',
      'Factory Infotainment Audio System',
    ],
    notes: vehicleData.notes || 'Submitted via Rent Your Car web portal',
    image: vehicleData.image || '/images/vehicles/swift-2026-grey.jpg',
    secondaryImages: vehicleData.image ? [vehicleData.image] : [],
    rcDocumentUrl: vehicleData.rcDocumentUrl || null,
    insuranceDocumentUrl: vehicleData.insuranceDocumentUrl || null,
    idProofUrl: vehicleData.idProofUrl || null,
    documents: carDocs,
    status: 'PENDING_APPROVAL',
    isAvailable: false,
    isPublished: false,
    approvalNotes: vehicleData.notes || 'Submitted via Rent Your Car partner portal',
  });

  return { vehicle: submission, vendor: user.toSafeObject ? user.toSafeObject() : user };
}

/**
 * Attach a bike from "Rent Your Bike" (Stores in carzodrive_partners database)
 */
async function attachBike(ownerData, bikeData) {
  const user = await findOrCreateVendorUser(ownerData);

  const priceDaily = parseInt(String(bikeData.expectedDailyPrice || 799).replace(/[^0-9]/g, ''), 10) || 799;
  const brand = bikeData.bikeBrand || bikeData.brand || 'Host Two-Wheeler';
  const model = bikeData.bikeModel || bikeData.model || 'Rental Bike';
  const fullName = `${brand} ${model}`;
  const slug = `partner-bike-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  // Build structured documents array
  const bikeDocs = Array.isArray(bikeData.documents) ? [...bikeData.documents] : [];
  if (bikeData.rcDocumentUrl && !bikeDocs.some((d) => d.type === 'RC Document')) {
    bikeDocs.push({ type: 'RC Document', url: bikeData.rcDocumentUrl, name: 'Bike Registration Certificate (RC)', verified: false });
  }
  if (bikeData.insuranceDocumentUrl && !bikeDocs.some((d) => d.type === 'Insurance Policy')) {
    bikeDocs.push({ type: 'Insurance Policy', url: bikeData.insuranceDocumentUrl, name: 'Two-Wheeler Insurance Policy', verified: false });
  }
  if (bikeData.idProofUrl && !bikeDocs.some((d) => d.type === 'Owner ID Proof')) {
    bikeDocs.push({ type: 'Owner ID Proof', url: bikeData.idProofUrl, name: 'Owner Identity Proof', verified: false });
  }
  if (bikeData.image && !bikeDocs.some((d) => d.type === 'Vehicle Photo')) {
    bikeDocs.push({ type: 'Vehicle Photo', url: bikeData.image, name: 'Bike Photo', verified: false });
  }

  // Save to carzodrive_partners database
  const submission = await PartnerBikeSubmission.create({
    id: slug,
    slug,
    vendorId: user._id,
    ownerName: ownerData.ownerName || ownerData.name,
    ownerPhone: ownerData.phone,
    ownerEmail: ownerData.email,
    city: ownerData.city || 'Bhubaneswar',
    address: bikeData.address || `${ownerData.city || 'Bhubaneswar'} Partner Hub`,
    bikeBrand: brand,
    bikeModel: model,
    name: fullName,
    bikeNumber: bikeData.bikeNumber ? bikeData.bikeNumber.toUpperCase() : undefined,
    bikeType: bikeData.bikeType || 'Commuter Motorcycle',
    manufacturingYear: parseInt(bikeData.manufacturingYear, 10) || 2023,
    expectedDailyPrice: priceDaily,
    fuelType: bikeData.fuelType || 'Petrol',
    engineCc: `${bikeData.engineCC || 125}cc`,
    engineCC: parseInt(bikeData.engineCC, 10) || 125,
    notes: bikeData.notes || 'Submitted via Rent Your Bike web portal',
    image: bikeData.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
    secondaryImages: bikeData.image ? [bikeData.image] : [],
    rcDocumentUrl: bikeData.rcDocumentUrl || null,
    insuranceDocumentUrl: bikeData.insuranceDocumentUrl || null,
    idProofUrl: bikeData.idProofUrl || null,
    documents: bikeDocs,
    status: 'PENDING_APPROVAL',
    isAvailable: false,
    isPublished: false,
    approvalNotes: bikeData.notes || 'Submitted via Rent Your Bike partner portal',
  });

  return { bike: submission, vendor: user.toSafeObject ? user.toSafeObject() : user };
}

/**
 * Get all vehicles attached by a vendor (Aggregates from partner DB + primary catalog)
 */
async function getVendorFleet(vendorId) {
  const [partnerCars, partnerBikes, legacyCars, legacyBikes] = await Promise.all([
    PartnerCarSubmission.find({ vendorId }).sort({ createdAt: -1 }).lean(),
    PartnerBikeSubmission.find({ vendorId }).sort({ createdAt: -1 }).lean(),
    Vehicle.find({ vendorId }).sort({ createdAt: -1 }).lean(),
    Bike.find({ vendorId }).sort({ createdAt: -1 }).lean(),
  ]);

  const allCars = [...partnerCars];
  legacyCars.forEach((lc) => {
    if (!allCars.some((c) => c.slug === lc.slug || c.id === lc.id)) {
      allCars.push(lc);
    }
  });

  const allBikes = [...partnerBikes];
  legacyBikes.forEach((lb) => {
    if (!allBikes.some((b) => b.slug === lb.slug || b.id === lb.id)) {
      allBikes.push(lb);
    }
  });

  return { cars: allCars, bikes: allBikes, totalCount: allCars.length + allBikes.length };
}

/**
 * List all partner submissions for admin audit
 * Reads primarily from dedicated carzodrive_partners database, falls back gracefully to legacy
 */
async function listVendorSubmissions({ status, type }) {
  const query = {};
  if (status && status !== 'ALL' && status !== 'undefined' && status !== 'null') {
    query.status = status;
  }

  const cleanType = (type && type !== 'ALL' && type !== 'undefined' && type !== 'null') ? String(type).toLowerCase() : 'ALL';

  let cars = [];
  let bikes = [];

  if (cleanType === 'ALL' || cleanType === 'car' || cleanType === 'cars') {
    const partnerCars = await PartnerCarSubmission.find(query).sort({ createdAt: -1 }).lean();
    cars = partnerCars.map((c) => ({
      ...c,
      itemType: 'car',
      brand: c.vehicleBrand,
      model: c.vehicleModel,
      registrationNumber: c.vehicleNumber,
      pricePerDay: c.expectedDailyPrice,
      isVendorListing: true,
    }));

    // If legacy cars exist in primary DB, append non-duplicates
    const legacyCars = await Vehicle.find({ isVendorListing: true, ...(query.status ? { status: query.status } : {}) }).lean();
    legacyCars.forEach((lc) => {
      if (!cars.some((c) => c.slug === lc.slug || c.id === lc.id || String(c._id) === String(lc._id))) {
        cars.push({ ...lc, itemType: 'car' });
      }
    });
  }

  if (cleanType === 'ALL' || cleanType === 'bike' || cleanType === 'bikes') {
    const partnerBikes = await PartnerBikeSubmission.find(query).sort({ createdAt: -1 }).lean();
    bikes = partnerBikes.map((b) => ({
      ...b,
      itemType: 'bike',
      brand: b.bikeBrand,
      model: b.bikeModel,
      registrationNumber: b.bikeNumber,
      pricePerDay: b.expectedDailyPrice,
      isVendorListing: true,
    }));

    // If legacy bikes exist in primary DB, append non-duplicates
    const legacyBikes = await Bike.find({ isVendorListing: true, ...(query.status ? { status: query.status } : {}) }).lean();
    legacyBikes.forEach((lb) => {
      if (!bikes.some((b) => b.slug === lb.slug || b.id === lb.id || String(b._id) === String(lb._id))) {
        bikes.push({ ...lb, itemType: 'bike' });
      }
    });
  }

  return {
    cars,
    bikes,
    totalCount: cars.length + bikes.length,
    pendingCount:
      cars.filter((c) => c.status === 'PENDING_APPROVAL').length +
      bikes.filter((b) => b.status === 'PENDING_APPROVAL').length,
  };
}

/**
 * Admin approves a vendor car or bike:
 * 1. Updates status in dedicated partner DB (carzodrive_partners)
 * 2. Automatically syncs/publishes verified item to primary catalog in carzodrive DB
 */
async function approveVendorSubmission(type, id, adminId) {
  const isCar = ['car', 'cars', 'vehicle', 'vehicles'].includes(String(type).toLowerCase());

  if (isCar) {
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerCarSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerCarSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (submission) {
      submission.status = 'APPROVED';
      submission.isPublished = true;
      submission.isAvailable = true;
      submission.approvedBy = String(adminId || 'SuperAdmin');
      submission.approvedAt = new Date();
      submission.approvalNotes = `Verified and approved by Super Admin on ${new Date().toISOString()}`;
      if (submission.documents && submission.documents.length > 0) {
        submission.documents.forEach((d) => {
          d.verified = true;
        });
      }

      // Check if already published in primary carzodrive.vehicles
      let liveCar = null;
      if (submission.publishedVehicleId) {
        liveCar = await Vehicle.findById(submission.publishedVehicleId);
      }
      if (!liveCar) {
        liveCar = await Vehicle.findOne({ slug: submission.slug });
      }

      const dailyRate = submission.expectedDailyPrice || 2500;
      if (!liveCar) {
        liveCar = await Vehicle.create({
          id: submission.id || submission.slug,
          slug: submission.slug,
          name: submission.name || `${submission.vehicleBrand} ${submission.vehicleModel}`,
          brand: submission.vehicleBrand,
          model: submission.vehicleModel,
          make: submission.vehicleBrand,
          year: submission.manufacturingYear || 2023,
          category: (submission.vehicleType || 'sedan').toLowerCase(),
          type: submission.vehicleType || 'Executive Sedan',
          color: submission.color || 'Standard',
          seats: submission.seats || 5,
          fuelType: submission.fuelType || 'Petrol',
          transmission: submission.transmission || 'Manual',
          registrationNumber: submission.vehicleNumber,
          rcNumber: submission.vehicleNumber,
          rcDocumentUrl: submission.rcDocumentUrl,
          insuranceDocumentUrl: submission.insuranceDocumentUrl,
          idProofUrl: submission.idProofUrl,
          documents: submission.documents,
          image: submission.image || '/images/vehicles/swift-2026-grey.jpg',
          secondaryImages: submission.secondaryImages || [],
          pricePerDay: dailyRate,
          priceNumeric: dailyRate,
          priceDisplay: `₹${dailyRate.toLocaleString('en-IN')}`,
          deposit: '₹3,000',
          depositNumeric: 3000,
          securityDeposit: 3000,
          pricing: {
            selfDrive: { daily: dailyRate, hourly: Math.round(dailyRate / 10) },
            withDriver: { daily: dailyRate + 700, hourly: Math.round((dailyRate + 700) / 10) },
          },
          location: {
            city: submission.city || 'Bhubaneswar',
            state: 'Odisha',
            address: submission.address || `${submission.city || 'Bhubaneswar'} Partner Hub`,
          },
          features: submission.features && submission.features.length > 0 ? submission.features : [
            'Comprehensive Partner Insurance Cover',
            'Dual Front Airbags & ABS with EBD',
            'High-Efficiency Climate Control AC',
            'Factory Infotainment Audio System',
          ],
          vendorId: submission.vendorId,
          isVendorListing: true,
          ownerName: submission.ownerName,
          ownerPhone: submission.ownerPhone,
          ownerEmail: submission.ownerEmail,
          status: 'APPROVED',
          isPublished: true,
          isAvailable: true,
          approvalNotes: submission.approvalNotes,
        });
      } else {
        liveCar.status = 'APPROVED';
        liveCar.isPublished = true;
        liveCar.isAvailable = true;
        liveCar.approvalNotes = submission.approvalNotes;
        await liveCar.save();
      }

      submission.publishedVehicleId = String(liveCar._id);
      await submission.save();
      return submission;
    }

    // Fallback: check primary catalog Vehicle
    const legacyCar = await Vehicle.findById(id);
    if (!legacyCar) {
      const err = new Error('Vehicle submission not found');
      err.statusCode = 404;
      throw err;
    }
    legacyCar.status = 'APPROVED';
    legacyCar.isPublished = true;
    legacyCar.isAvailable = true;
    legacyCar.approvalNotes = `Approved by Admin ${adminId || ''} on ${new Date().toISOString()}`;
    if (legacyCar.documents && legacyCar.documents.length > 0) {
      legacyCar.documents.forEach((d) => {
        d.verified = true;
      });
    }
    await legacyCar.save();
    return legacyCar;
  }

  // Bike approval
  let submission = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    submission = await PartnerBikeSubmission.findById(id);
  }
  if (!submission) {
    submission = await PartnerBikeSubmission.findOne({ $or: [{ id }, { slug: id }] });
  }

  if (submission) {
    submission.status = 'APPROVED';
    submission.isPublished = true;
    submission.isAvailable = true;
    submission.approvedBy = String(adminId || 'SuperAdmin');
    submission.approvedAt = new Date();
    submission.approvalNotes = `Verified and approved by Super Admin on ${new Date().toISOString()}`;
    if (submission.documents && submission.documents.length > 0) {
      submission.documents.forEach((d) => {
        d.verified = true;
      });
    }

    // Check if already published in primary carzodrive.bikes
    let liveBike = null;
    if (submission.publishedBikeId) {
      liveBike = await Bike.findById(submission.publishedBikeId);
    }
    if (!liveBike) {
      liveBike = await Bike.findOne({ slug: submission.slug });
    }

    const dailyRate = submission.expectedDailyPrice || 799;
    if (!liveBike) {
      liveBike = await Bike.create({
        id: submission.id || submission.slug,
        slug: submission.slug,
        name: submission.name || `${submission.bikeBrand} ${submission.bikeModel}`,
        brand: submission.bikeBrand,
        model: submission.bikeModel,
        make: submission.bikeBrand,
        year: submission.manufacturingYear || 2023,
        category: (submission.bikeType || 'commuter').toLowerCase(),
        type: submission.bikeType || 'Commuter Motorcycle',
        engineCC: parseInt(submission.engineCC, 10) || 125,
        registrationNumber: submission.bikeNumber,
        rcNumber: submission.bikeNumber,
        rcDocumentUrl: submission.rcDocumentUrl,
        insuranceDocumentUrl: submission.insuranceDocumentUrl,
        idProofUrl: submission.idProofUrl,
        documents: submission.documents,
        image: submission.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
        secondaryImages: submission.secondaryImages || [],
        pricePerDay: dailyRate,
        priceNumeric: dailyRate,
        priceDisplay: `₹${dailyRate.toLocaleString('en-IN')}`,
        deposit: '₹1,500',
        depositNumeric: 1500,
        pricing: {
          daily: dailyRate,
          weekly: dailyRate * 6,
          monthly: dailyRate * 22,
          securityDeposit: 1500,
        },
        location: {
          city: submission.city || 'Bhubaneswar',
          state: 'Odisha',
          address: submission.address || `${submission.city || 'Bhubaneswar'} Partner Hub`,
        },
        features: [
          'Verified Vehicle Fitness & Valid PUC',
          'Dual Certified Helmets Included',
          'Tubeless Puncture-Resistant Tyres',
        ],
        vendorId: submission.vendorId,
        isVendorListing: true,
        ownerName: submission.ownerName,
        ownerPhone: submission.ownerPhone,
        ownerEmail: submission.ownerEmail,
        status: 'APPROVED',
        isPublished: true,
        isAvailable: true,
        approvalNotes: submission.approvalNotes,
      });
    } else {
      liveBike.status = 'APPROVED';
      liveBike.isPublished = true;
      liveBike.isAvailable = true;
      liveBike.approvalNotes = submission.approvalNotes;
      await liveBike.save();
    }

    submission.publishedBikeId = String(liveBike._id);
    await submission.save();
    return submission;
  }

  // Fallback: check primary catalog Bike
  const legacyBike = await Bike.findById(id);
  if (!legacyBike) {
    const err = new Error('Bike submission not found');
    err.statusCode = 404;
    throw err;
  }
  legacyBike.status = 'APPROVED';
  legacyBike.isPublished = true;
  legacyBike.isAvailable = true;
  legacyBike.approvalNotes = `Approved by Admin ${adminId || ''} on ${new Date().toISOString()}`;
  if (legacyBike.documents && legacyBike.documents.length > 0) {
    legacyBike.documents.forEach((d) => {
      d.verified = true;
    });
  }
  await legacyBike.save();
  return legacyBike;
}

/**
 * Admin rejects a vendor car or bike
 */
async function rejectVendorSubmission(type, id, adminId, reason = 'Verification details incomplete') {
  const isCar = ['car', 'cars', 'vehicle', 'vehicles'].includes(String(type).toLowerCase());

  if (isCar) {
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerCarSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerCarSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (submission) {
      submission.status = 'REJECTED';
      submission.isPublished = false;
      submission.isAvailable = false;
      submission.rejectionReason = reason;
      submission.approvalNotes = `Rejected on ${new Date().toISOString()}: ${reason}`;
      await submission.save();

      if (submission.publishedVehicleId) {
        await Vehicle.findByIdAndUpdate(submission.publishedVehicleId, {
          status: 'REJECTED',
          isPublished: false,
          isAvailable: false,
          rejectionReason: reason,
        });
      }
      return submission;
    }

    const legacyCar = await Vehicle.findById(id);
    if (!legacyCar) {
      const err = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }
    legacyCar.status = 'REJECTED';
    legacyCar.isPublished = false;
    legacyCar.isAvailable = false;
    legacyCar.rejectionReason = reason;
    legacyCar.approvalNotes = `Rejected on ${new Date().toISOString()}: ${reason}`;
    await legacyCar.save();
    return legacyCar;
  }

  // Bike rejection
  let submission = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    submission = await PartnerBikeSubmission.findById(id);
  }
  if (!submission) {
    submission = await PartnerBikeSubmission.findOne({ $or: [{ id }, { slug: id }] });
  }

  if (submission) {
    submission.status = 'REJECTED';
    submission.isPublished = false;
    submission.isAvailable = false;
    submission.rejectionReason = reason;
    submission.approvalNotes = `Rejected on ${new Date().toISOString()}: ${reason}`;
    await submission.save();

    if (submission.publishedBikeId) {
      await Bike.findByIdAndUpdate(submission.publishedBikeId, {
        status: 'REJECTED',
        isPublished: false,
        isAvailable: false,
        rejectionReason: reason,
      });
    }
    return submission;
  }

  const legacyBike = await Bike.findById(id);
  if (!legacyBike) {
    const err = new Error('Bike not found');
    err.statusCode = 404;
    throw err;
  }
  legacyBike.status = 'REJECTED';
  legacyBike.isPublished = false;
  legacyBike.isAvailable = false;
  legacyBike.rejectionReason = reason;
  legacyBike.approvalNotes = `Rejected on ${new Date().toISOString()}: ${reason}`;
  await legacyBike.save();
  return legacyBike;
}

/**
 * Delete a vendor submission (car or bike)
 * Removes from partner DB and cleans up any published live fleet document
 */
async function deleteVendorSubmission(type, id) {
  const isCar = type.toLowerCase() === 'car' || type.toLowerCase() === 'cars';

  if (isCar) {
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerCarSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerCarSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (submission) {
      if (submission.publishedVehicleId) {
        await Vehicle.findByIdAndDelete(submission.publishedVehicleId);
      }
      await Vehicle.deleteMany({ $or: [{ slug: submission.slug }, { id: submission.id }] });
      await PartnerCarSubmission.findByIdAndDelete(submission._id);
      return { success: true, message: `Car submission "${submission.name}" deleted successfully` };
    }

    const legacy = await Vehicle.findById(id);
    if (legacy) {
      await Vehicle.findByIdAndDelete(id);
      return { success: true, message: `Vehicle "${legacy.name}" deleted successfully` };
    }

    const err = new Error('Car submission not found');
    err.statusCode = 404;
    throw err;
  } else {
    // Bike
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerBikeSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerBikeSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (submission) {
      if (submission.publishedBikeId) {
        await Bike.findByIdAndDelete(submission.publishedBikeId);
      }
      await Bike.deleteMany({ $or: [{ slug: submission.slug }, { id: submission.id }] });
      await PartnerBikeSubmission.findByIdAndDelete(submission._id);
      return { success: true, message: `Bike submission "${submission.name}" deleted successfully` };
    }

    const legacy = await Bike.findById(id);
    if (legacy) {
      await Bike.findByIdAndDelete(id);
      return { success: true, message: `Bike "${legacy.name}" deleted successfully` };
    }

    const err = new Error('Bike submission not found');
    err.statusCode = 404;
    throw err;
  }
}

/**
 * Update a vendor submission (car or bike)
 * Updates partner DB and syncs changes to live fleet document if published
 */
async function updateVendorSubmission(type, id, data) {
  const isCar = type.toLowerCase() === 'car' || type.toLowerCase() === 'cars';

  if (isCar) {
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerCarSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerCarSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (!submission) {
      const legacy = await Vehicle.findById(id);
      if (!legacy) {
        const err = new Error('Car submission not found');
        err.statusCode = 404;
        throw err;
      }
      if (data.name) legacy.name = data.name;
      if (data.pricePerDay || data.expectedDailyPrice) {
        const p = Number(data.pricePerDay || data.expectedDailyPrice);
        legacy.priceNumeric = p;
        legacy.pricePerDay = p;
        if (legacy.pricing) {
          legacy.pricing.selfDrive = { daily: p, hourly: Math.round(p / 10) };
        }
      }
      if (data.vehicleNumber || data.registrationNumber) {
        legacy.registrationNumber = (data.vehicleNumber || data.registrationNumber).toUpperCase();
        legacy.rcNumber = legacy.registrationNumber;
      }
      if (data.manufacturingYear || data.year) legacy.year = Number(data.manufacturingYear || data.year);
      if (data.ownerName) legacy.ownerName = data.ownerName;
      if (data.ownerPhone) legacy.ownerPhone = data.ownerPhone;
      if (data.ownerEmail) legacy.ownerEmail = data.ownerEmail;
      if (data.city) {
        legacy.location = { ...legacy.location, city: data.city };
      }
      if (data.fuelType) legacy.fuelType = data.fuelType;
      if (data.transmission) legacy.transmission = data.transmission;
      if (data.seats) legacy.seats = Number(data.seats);
      if (data.image) legacy.image = data.image;
      if (data.status) legacy.status = data.status;
      if (data.notes || data.approvalNotes) legacy.approvalNotes = data.notes || data.approvalNotes;
      await legacy.save();
      return legacy;
    }

    if (data.name) submission.name = data.name;
    if (data.vehicleBrand) submission.vehicleBrand = data.vehicleBrand;
    if (data.vehicleModel) submission.vehicleModel = data.vehicleModel;
    if (data.vehicleNumber || data.registrationNumber) {
      submission.vehicleNumber = (data.vehicleNumber || data.registrationNumber).toUpperCase();
    }
    if (data.expectedDailyPrice || data.pricePerDay) {
      submission.expectedDailyPrice = Number(data.expectedDailyPrice || data.pricePerDay);
    }
    if (data.manufacturingYear || data.year) {
      submission.manufacturingYear = Number(data.manufacturingYear || data.year);
    }
    if (data.ownerName) submission.ownerName = data.ownerName;
    if (data.ownerPhone) submission.ownerPhone = data.ownerPhone;
    if (data.ownerEmail) submission.ownerEmail = data.ownerEmail;
    if (data.city) submission.city = data.city;
    if (data.fuelType) submission.fuelType = data.fuelType;
    if (data.transmission) submission.transmission = data.transmission;
    if (data.seats) submission.seats = Number(data.seats);
    if (data.image) submission.image = data.image;
    if (data.rcDocumentUrl) submission.rcDocumentUrl = data.rcDocumentUrl;
    if (data.insuranceDocumentUrl) submission.insuranceDocumentUrl = data.insuranceDocumentUrl;
    if (data.idProofUrl) submission.idProofUrl = data.idProofUrl;
    if (data.status) submission.status = data.status;
    if (data.notes || data.approvalNotes) submission.approvalNotes = data.notes || data.approvalNotes;

    await submission.save();

    // Sync with live Vehicle if published
    const liveCarId = submission.publishedVehicleId;
    let liveCar = liveCarId ? await Vehicle.findById(liveCarId) : null;
    if (!liveCar) {
      liveCar = await Vehicle.findOne({ slug: submission.slug });
    }
    if (liveCar) {
      if (submission.name) liveCar.name = submission.name;
      if (submission.expectedDailyPrice) {
        liveCar.priceNumeric = submission.expectedDailyPrice;
        liveCar.pricePerDay = submission.expectedDailyPrice;
        if (liveCar.pricing) {
          liveCar.pricing.selfDrive = { daily: submission.expectedDailyPrice, hourly: Math.round(submission.expectedDailyPrice / 10) };
        }
      }
      if (submission.vehicleNumber) {
        liveCar.registrationNumber = submission.vehicleNumber;
        liveCar.rcNumber = submission.vehicleNumber;
      }
      if (submission.manufacturingYear) liveCar.year = submission.manufacturingYear;
      if (submission.ownerName) liveCar.ownerName = submission.ownerName;
      if (submission.ownerPhone) liveCar.ownerPhone = submission.ownerPhone;
      if (submission.fuelType) liveCar.fuelType = submission.fuelType;
      if (submission.transmission) liveCar.transmission = submission.transmission;
      if (submission.seats) liveCar.seats = submission.seats;
      if (submission.image) liveCar.image = submission.image;
      if (submission.city) {
        liveCar.location = { ...liveCar.location, city: submission.city };
      }
      if (data.status) liveCar.status = data.status;
      await liveCar.save();
    }

    return submission;
  } else {
    // Bike
    let submission = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      submission = await PartnerBikeSubmission.findById(id);
    }
    if (!submission) {
      submission = await PartnerBikeSubmission.findOne({ $or: [{ id }, { slug: id }] });
    }

    if (!submission) {
      const legacy = await Bike.findById(id);
      if (!legacy) {
        const err = new Error('Bike submission not found');
        err.statusCode = 404;
        throw err;
      }
      if (data.name) legacy.name = data.name;
      if (data.pricePerDay || data.expectedDailyPrice) {
        const p = Number(data.pricePerDay || data.expectedDailyPrice);
        legacy.priceNumeric = p;
        legacy.pricePerDay = p;
        if (legacy.pricing) {
          legacy.pricing.daily = p;
          legacy.pricing.hourly = Math.round(p / 10);
        }
      }
      if (data.bikeNumber || data.registrationNumber) {
        legacy.registrationNumber = (data.bikeNumber || data.registrationNumber).toUpperCase();
        legacy.rcNumber = legacy.registrationNumber;
      }
      if (data.manufacturingYear || data.year) legacy.year = Number(data.manufacturingYear || data.year);
      if (data.ownerName) legacy.ownerName = data.ownerName;
      if (data.ownerPhone) legacy.ownerPhone = data.ownerPhone;
      if (data.ownerEmail) legacy.ownerEmail = data.ownerEmail;
      if (data.city) legacy.city = data.city;
      if (data.fuelType) legacy.fuelType = data.fuelType;
      if (data.engineCC) legacy.engineCC = Number(data.engineCC);
      if (data.image) legacy.image = data.image;
      if (data.status) legacy.status = data.status;
      if (data.notes || data.approvalNotes) legacy.approvalNotes = data.notes || data.approvalNotes;
      await legacy.save();
      return legacy;
    }

    if (data.name) submission.name = data.name;
    if (data.bikeBrand) submission.bikeBrand = data.bikeBrand;
    if (data.bikeModel) submission.bikeModel = data.bikeModel;
    if (data.bikeNumber || data.registrationNumber) {
      submission.bikeNumber = (data.bikeNumber || data.registrationNumber).toUpperCase();
    }
    if (data.expectedDailyPrice || data.pricePerDay) {
      submission.expectedDailyPrice = Number(data.expectedDailyPrice || data.pricePerDay);
    }
    if (data.manufacturingYear || data.year) {
      submission.manufacturingYear = Number(data.manufacturingYear || data.year);
    }
    if (data.ownerName) submission.ownerName = data.ownerName;
    if (data.ownerPhone) submission.ownerPhone = data.ownerPhone;
    if (data.ownerEmail) submission.ownerEmail = data.ownerEmail;
    if (data.city) submission.city = data.city;
    if (data.fuelType) submission.fuelType = data.fuelType;
    if (data.engineCC) {
      submission.engineCC = Number(data.engineCC);
      submission.engineCc = `${data.engineCC}cc`;
    }
    if (data.image) submission.image = data.image;
    if (data.rcDocumentUrl) submission.rcDocumentUrl = data.rcDocumentUrl;
    if (data.insuranceDocumentUrl) submission.insuranceDocumentUrl = data.insuranceDocumentUrl;
    if (data.idProofUrl) submission.idProofUrl = data.idProofUrl;
    if (data.status) submission.status = data.status;
    if (data.notes || data.approvalNotes) submission.approvalNotes = data.notes || data.approvalNotes;

    await submission.save();

    // Sync with live Bike if published
    const liveBikeId = submission.publishedBikeId;
    let liveBike = liveBikeId ? await Bike.findById(liveBikeId) : null;
    if (!liveBike) {
      liveBike = await Bike.findOne({ slug: submission.slug });
    }
    if (liveBike) {
      if (submission.name) liveBike.name = submission.name;
      if (submission.expectedDailyPrice) {
        liveBike.priceNumeric = submission.expectedDailyPrice;
        liveBike.pricePerDay = submission.expectedDailyPrice;
        if (liveBike.pricing) {
          liveBike.pricing.daily = submission.expectedDailyPrice;
          liveBike.pricing.hourly = Math.round(submission.expectedDailyPrice / 10);
        }
      }
      if (submission.bikeNumber) {
        liveBike.registrationNumber = submission.bikeNumber;
        liveBike.rcNumber = submission.bikeNumber;
      }
      if (submission.manufacturingYear) liveBike.year = submission.manufacturingYear;
      if (submission.ownerName) liveBike.ownerName = submission.ownerName;
      if (submission.ownerPhone) liveBike.ownerPhone = submission.ownerPhone;
      if (submission.fuelType) liveBike.fuelType = submission.fuelType;
      if (submission.engineCC) liveBike.engineCC = submission.engineCC;
      if (submission.image) liveBike.image = submission.image;
      if (submission.city) liveBike.city = submission.city;
      if (data.status) liveBike.status = data.status;
      await liveBike.save();
    }

    return submission;
  }
}

module.exports = {
  findOrCreateVendorUser,
  attachCar,
  attachBike,
  getVendorFleet,
  listVendorSubmissions,
  approveVendorSubmission,
  rejectVendorSubmission,
  deleteVendorSubmission,
  updateVendorSubmission,
};
