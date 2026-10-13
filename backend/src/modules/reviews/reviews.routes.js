const express = require('express');
const { body, param } = require('express-validator');
const controller = require('./reviews.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];
const RESOURCE_TYPES = ['Vehicle', 'Bike', 'Driver', 'TourPackage'];

// POST /reviews — authenticated customer submits a review
router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('resourceType').optional().isIn(RESOURCE_TYPES).withMessage('Invalid resource type'),
    body('title').optional().isString().isLength({ max: 200 }),
    body('comment').optional().isString().isLength({ max: 2000 }),
  ],
  controller.createReview
);

// GET /reviews — admin list all reviews
router.get(
  '/',
  authenticate,
  authorize(...ADMINS),
  controller.listReviews
);

// GET /reviews/resource/:resourceType/:resourceId — public, approved reviews for a resource
router.get(
  '/resource/:resourceType/:resourceId',
  [
    param('resourceType').isIn(RESOURCE_TYPES).withMessage('Invalid resource type'),
    param('resourceId').notEmpty(),
  ],
  controller.getResourceReviews
);

// PATCH /reviews/:id/approve — admin approves a review
router.patch(
  '/:id/approve',
  authenticate,
  authorize(...ADMINS),
  controller.approveReview
);

// DELETE /reviews/:id — admin deletes a review
router.delete(
  '/:id',
  authenticate,
  authorize(...ADMINS),
  controller.deleteReview
);

module.exports = router;
