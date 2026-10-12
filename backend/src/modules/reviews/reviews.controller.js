const svc = require('./reviews.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return false; }
  return true;
}

const createReview = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const review = await svc.createReview(req.user.id, req.body);
  created(res, review, 'Review submitted and pending approval');
});

const listReviews = asyncHandler(async (req, res) => {
  const result = await svc.listReviews(req.query, req.user.id, req.user.role);
  res.json({ success: true, data: result.reviews, pagination: result.pagination });
});

const getResourceReviews = asyncHandler(async (req, res) => {
  const reviews = await svc.getResourceReviews(req.params.resourceId, req.params.resourceType);
  success(res, reviews);
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await svc.approveReview(req.params.id, req.user.id);
  success(res, review, 'Review approved and published');
});

const deleteReview = asyncHandler(async (req, res) => {
  await svc.deleteReview(req.params.id, req.user.id);
  success(res, null, 'Review deleted');
});

module.exports = { createReview, listReviews, getResourceReviews, approveReview, deleteReview };
