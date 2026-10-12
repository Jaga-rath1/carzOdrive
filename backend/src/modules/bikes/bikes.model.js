const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const blockedPeriodSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { _id: false }
);

const bikeSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
    },
    bikeType: {
      type: String,
      enum: ['STANDARD', 'CRUISER', 'SPORTS', 'SCOOTER', 'ADVENTURE', 'ELECTRIC'],
      required: true,
    },
    engineCC: {
      type: Number,
    },
    registrationNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    pricing: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      securityDeposit: { type: Number, default: 0 },
    },
    extraKmCharge: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'MAINTENANCE'],
      default: 'PENDING',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    blockedPeriods: {
      type: [blockedPeriodSchema],
      default: [],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bikeSchema.index({ vendorId: 1 });
bikeSchema.index({ status: 1 });
bikeSchema.index({ isPublished: 1 });
bikeSchema.index({ 'location.city': 1 });

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
