const mongoose = require('mongoose');

const VEHICLE_TYPES = ['SEDAN', 'SUV', 'HATCHBACK', 'MUV', 'LUXURY', 'VAN', 'PICKUP'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
const TRANSMISSION_TYPES = ['MANUAL', 'AUTOMATIC'];
const SERVICE_TYPES = ['SELF_DRIVE', 'WITH_DRIVER'];
const VEHICLE_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'MAINTENANCE'];
const FUEL_POLICIES = ['FULL_TO_FULL', 'SAME_TO_SAME', 'PREPAID'];

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const blockedPeriodSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String, trim: true },
  },
  { _id: true }
);

const selfDrivePricingSchema = new mongoose.Schema(
  {
    hourly: { type: Number, min: 0 },
    daily: { type: Number, min: 0 },
    weekly: { type: Number, min: 0 },
    monthly: { type: Number, min: 0 },
  },
  { _id: false }
);

const withDriverPricingSchema = new mongoose.Schema(
  {
    hourly: { type: Number, min: 0 },
    daily: { type: Number, min: 0 },
    perKm: { type: Number, min: 0 },
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, min: 1900, max: new Date().getFullYear() + 1 },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: VEHICLE_TYPES,
      required: true,
    },
    seats: { type: Number, required: true, min: 1, max: 50 },
    fuelType: { type: String, enum: FUEL_TYPES },
    transmission: { type: String, enum: TRANSMISSION_TYPES },
    color: { type: String, trim: true },
    images: [{ type: String }],
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    serviceTypes: [{ type: String, enum: SERVICE_TYPES }],
    pricing: {
      selfDrive: { type: selfDrivePricingSchema, default: () => ({}) },
      withDriver: { type: withDriverPricingSchema, default: () => ({}) },
    },
    securityDeposit: { type: Number, default: 0, min: 0 },
    extraKmCharge: { type: Number, default: 0, min: 0 },
    fuelPolicy: {
      type: String,
      enum: FUEL_POLICIES,
      default: 'FULL_TO_FULL',
    },
    status: {
      type: String,
      enum: VEHICLE_STATUSES,
      default: 'PENDING',
    },
    isPublished: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    documents: [documentSchema],
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    blockedPeriods: [blockedPeriodSchema],
  },
  { timestamps: true }
);

// Indexes
vehicleSchema.index({ vendorId: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ isPublished: 1 });
vehicleSchema.index({ 'location.city': 1 });
vehicleSchema.index({ serviceTypes: 1 });
vehicleSchema.index({ status: 1, isPublished: 1, isAvailable: 1 });
vehicleSchema.index({ vehicleType: 1, 'location.city': 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = { Vehicle, VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, SERVICE_TYPES, VEHICLE_STATUSES, FUEL_POLICIES };
