const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    licenseExpiry: {
      type: Date,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    languages: {
      type: [String],
      default: [],
    },
    serviceArea: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    rating: {
      type: ratingSchema,
      default: () => ({ average: 0, count: 0 }),
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
    suspensionReason: {
      type: String,
      trim: true,
    },
    currentAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  { timestamps: true }
);

driverSchema.index({ userId: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ isAvailable: 1 });
driverSchema.index({ serviceArea: 1 });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
