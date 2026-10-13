const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    vendorType: {
      type: String,
      enum: ['CAR', 'BIKE', 'DRIVER', 'TOUR'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    suspensionReason: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

vendorSchema.index({ userId: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ vendorType: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
