const mongoose = require('mongoose');
const { partnerConnection } = require('../config/database');

/**
 * 1. Rent Your Car Submission Schema (stored in carzodrive_partners)
 */
const partnerCarSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },

    // Owner Information
    ownerName: { type: String, required: true, trim: true },
    ownerPhone: { type: String, required: true, trim: true },
    ownerEmail: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true, default: 'Bhubaneswar' },
    address: { type: String, trim: true },

    // Vehicle Specifications
    vehicleBrand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    name: { type: String, trim: true }, // e.g. "Hyundai Creta SX"
    vehicleNumber: { type: String, trim: true, uppercase: true },
    vehicleType: { type: String, trim: true, default: 'SUV' },
    manufacturingYear: { type: Number, default: 2023 },
    expectedDailyPrice: { type: Number, required: true, default: 2500 },
    fuelType: { type: String, default: 'Petrol' },
    transmission: { type: String, default: 'Manual' },
    seats: { type: Number, default: 5 },
    color: { type: String, default: 'Standard' },
    features: [{ type: String }],
    notes: { type: String, trim: true },

    // Uploaded Verification Documents
    image: { type: String, trim: true },
    secondaryImages: [{ type: String }],
    rcDocumentUrl: { type: String, trim: true },
    insuranceDocumentUrl: { type: String, trim: true },
    idProofUrl: { type: String, trim: true },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],

    // Workflow Moderation State
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    isAvailable: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    approvalNotes: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },

    // Linked IDs
    vendorId: { type: mongoose.Schema.Types.Mixed, default: null },
    publishedVehicleId: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'car_submissions',
  }
);

/**
 * 2. Rent Your Bike Submission Schema (stored in carzodrive_partners)
 */
const partnerBikeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },

    // Owner Information
    ownerName: { type: String, required: true, trim: true },
    ownerPhone: { type: String, required: true, trim: true },
    ownerEmail: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true, default: 'Bhubaneswar' },
    address: { type: String, trim: true },

    // Bike Specifications
    bikeBrand: { type: String, required: true, trim: true },
    bikeModel: { type: String, required: true, trim: true },
    name: { type: String, trim: true }, // e.g. "Royal Enfield Classic 350"
    bikeNumber: { type: String, trim: true, uppercase: true },
    bikeType: { type: String, trim: true, default: 'CRUISER' },
    manufacturingYear: { type: Number, default: 2023 },
    expectedDailyPrice: { type: Number, required: true, default: 850 },
    fuelType: { type: String, default: 'Petrol' },
    engineCc: { type: String, default: '350cc' },
    engineCC: { type: mongoose.Schema.Types.Mixed, default: 350 },
    notes: { type: String, trim: true },

    // Uploaded Verification Documents
    image: { type: String, trim: true },
    secondaryImages: [{ type: String }],
    rcDocumentUrl: { type: String, trim: true },
    insuranceDocumentUrl: { type: String, trim: true },
    idProofUrl: { type: String, trim: true },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],

    // Workflow Moderation State
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    isAvailable: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    approvalNotes: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },

    // Linked IDs
    vendorId: { type: mongoose.Schema.Types.Mixed, default: null },
    publishedBikeId: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'bike_submissions',
  }
);

/**
 * 3. Driver Registration Submission Schema (stored in carzodrive_partners)
 */
const driverRegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.Mixed, default: null },

    // Driver Personal Bio
    fullName: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true, default: 'Bhubaneswar' },
    dob: { type: String, trim: true },
    address: { type: String, trim: true },

    // Professional Driving Credentials
    licenseNumber: { type: String, required: true, trim: true, uppercase: true },
    licenseType: { type: String, default: 'COMMERCIAL' },
    vehicleType: { type: String, default: 'CAB_SEDAN' },
    drivingExperience: { type: mongoose.Schema.Types.Mixed, default: 5 },
    experienceYears: { type: Number, default: 5 },
    experience: { type: String, default: '5' },
    languages: [{ type: String }],
    serviceArea: [{ type: String }],

    // Uploaded Verification Documents
    photo: { type: String, trim: true },
    avatar: { type: String, trim: true },
    drivingLicenseDoc: { type: String, trim: true },
    idProofDoc: { type: String, trim: true },
    profilePhotoDoc: { type: String, trim: true },
    addressProofDoc: { type: String, trim: true },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],

    // Workflow Moderation State
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
      index: true,
    },
    isAvailable: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    tripsCount: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 120 },
    dailyRate: { type: Number, default: 899 },
    rejectionReason: { type: String, trim: true },
    suspensionReason: { type: String, trim: true },
    approvalNotes: { type: String, trim: true },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },

    // Linked ID in the main carzodrive.drivers collection once approved
    publishedDriverId: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'driver_registrations',
  }
);

// Production High-Performance Indexes for Partner Submissions
partnerCarSchema.index({ status: 1, createdAt: -1 });
partnerCarSchema.index({ vendorId: 1, createdAt: -1 });
partnerCarSchema.index({ ownerPhone: 1 });

partnerBikeSchema.index({ status: 1, createdAt: -1 });
partnerBikeSchema.index({ vendorId: 1, createdAt: -1 });
partnerBikeSchema.index({ ownerPhone: 1 });

driverRegistrationSchema.index({ status: 1, createdAt: -1 });
driverRegistrationSchema.index({ phone: 1 });
driverRegistrationSchema.index({ userId: 1, createdAt: -1 });

// Models compiled on dedicated partner connection
const PartnerCarSubmission = partnerConnection.model('PartnerCarSubmission', partnerCarSchema);
const PartnerBikeSubmission = partnerConnection.model('PartnerBikeSubmission', partnerBikeSchema);
const DriverRegistrationSubmission = partnerConnection.model('DriverRegistrationSubmission', driverRegistrationSchema);

module.exports = {
  PartnerCarSubmission,
  PartnerBikeSubmission,
  DriverRegistrationSubmission,
};
