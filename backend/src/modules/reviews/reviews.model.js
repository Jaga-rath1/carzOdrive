const mongoose = require('mongoose');

const RESOURCE_TYPES = ['Vehicle', 'Bike', 'Driver', 'TourPackage'];

const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    serviceType: { type: String, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    resourceType: { type: String, enum: RESOURCE_TYPES },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true, maxlength: 200 },
    comment: { type: String, trim: true, maxlength: 2000 },
    isPublished: { type: Boolean, default: false },
    adminApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ customerId: 1, createdAt: -1 });
reviewSchema.index({ resourceId: 1, resourceType: 1, adminApproved: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = { Review, RESOURCE_TYPES };
