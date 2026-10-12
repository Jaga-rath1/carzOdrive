const mongoose = require('mongoose');
const { Review } = require('./reviews.model');
const { Booking } = require('../bookings/bookings.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN'];

// Lazy-load resource models to avoid circular deps
function getResourceModel(resourceType) {
  switch (resourceType) {
    case 'Vehicle': return require('../vehicles/vehicles.model').Vehicle;
    case 'Bike': return require('../bikes/bikes.model').Bike;
    case 'Driver': return require('../drivers/drivers.model').Driver;
    case 'TourPackage': return require('../packages/packages.model').TourPackage;
    default: return null;
  }
}

async function createReview(customerId, data) {
  const booking = await Booking.findById(data.bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  if (booking.customerId.toString() !== customerId.toString()) {
    const err = new Error('You can only review your own bookings');
    err.statusCode = 403;
    throw err;
  }
  if (booking.status !== 'COMPLETED') {
    const err = new Error('You can only review completed bookings');
    err.statusCode = 400;
    throw err;
  }

  const existing = await Review.findOne({ bookingId: data.bookingId });
  if (existing) {
    const err = new Error('A review already exists for this booking');
    err.statusCode = 409;
    throw err;
  }

  const review = await Review.create({
    customerId,
    bookingId: data.bookingId,
    serviceType: booking.serviceType,
    resourceId: data.resourceId,
    resourceType: data.resourceType,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    isPublished: false,
    adminApproved: false,
  });

  return review;
}

async function listReviews(query, userId, userRole) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (ADMIN_ROLES.includes(userRole)) {
    // Admin sees all reviews; optional filters
    if (query.adminApproved !== undefined) filter.adminApproved = query.adminApproved === 'true';
    if (query.serviceType) filter.serviceType = query.serviceType;
  } else {
    // Customers can only see their own
    filter.customerId = userId;
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('customerId', 'name email')
      .populate('bookingId', 'bookingNumber serviceType')
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Review.countDocuments(filter),
  ]);

  return { reviews, pagination: buildPaginationMeta(total, page, limit) };
}

async function getResourceReviews(resourceId, resourceType) {
  const reviews = await Review.find({
    resourceId: new mongoose.Types.ObjectId(resourceId),
    resourceType,
    adminApproved: true,
  })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 });

  return reviews;
}

async function approveReview(reviewId, adminId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    throw err;
  }

  review.adminApproved = true;
  review.isPublished = true;
  await review.save();

  // Update average rating on the resource
  if (review.resourceId && review.resourceType) {
    await updateResourceRating(review.resourceId, review.resourceType);
  }

  return review;
}

async function deleteReview(reviewId, adminId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    throw err;
  }

  const { resourceId, resourceType } = review;
  await review.deleteOne();

  // Recalculate resource rating after deletion
  if (resourceId && resourceType) {
    await updateResourceRating(resourceId, resourceType);
  }
}

async function updateResourceRating(resourceId, resourceType) {
  const ResourceModel = getResourceModel(resourceType);
  if (!ResourceModel) return;

  const result = await Review.aggregate([
    {
      $match: {
        resourceId: new mongoose.Types.ObjectId(resourceId),
        resourceType,
        adminApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
  const reviewCount = result.length > 0 ? result[0].reviewCount : 0;

  await ResourceModel.findByIdAndUpdate(resourceId, { averageRating, reviewCount });
}

module.exports = {
  createReview,
  listReviews,
  getResourceReviews,
  approveReview,
  deleteReview,
  updateResourceRating,
};
