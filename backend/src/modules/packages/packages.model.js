const mongoose = require('mongoose');

const groupDiscountSchema = new mongoose.Schema(
  {
    minPax: { type: Number, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    adultPrice: { type: Number, required: true, min: 0 },
    childPrice: { type: Number, min: 0 },
    infantPrice: { type: Number, min: 0, default: 0 },
    groupDiscount: { type: [groupDiscountSchema], default: [] },
  },
  { _id: false }
);

const availableDateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    bookedCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    activities: { type: [String], default: [] },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
    destination: { type: String, required: true, trim: true },
    origin: { type: String, trim: true },
    duration: {
      days: { type: Number, min: 1 },
      nights: { type: Number, min: 0 },
    },
    itinerary: { type: [itineraryDaySchema], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    pricing: { type: pricingSchema, required: true },
    availableDates: { type: [availableDateSchema], default: [] },
    minPax: { type: Number, default: 1, min: 1 },
    maxPax: { type: Number },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    isPublished: { type: Boolean, default: false },
    cancellationPolicy: { type: String, trim: true },
    documents: { type: [documentSchema], default: [] },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

tourPackageSchema.index({ vendorId: 1 });
tourPackageSchema.index({ status: 1 });
tourPackageSchema.index({ isPublished: 1 });
tourPackageSchema.index({ destination: 1 });
tourPackageSchema.index({ status: 1, isPublished: 1 });

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
module.exports = TourPackage;
