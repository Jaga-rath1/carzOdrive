const svc = require('./requests.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return false; }
  return true;
}

const submitRequest = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  // userId is optional — only present when user is authenticated
  const userId = req.user ? req.user.id : null;
  const request = await svc.submitRequest(req.body, userId);
  created(res, request, 'Your request has been submitted. We will contact you shortly.');
});

const listRequests = asyncHandler(async (req, res) => {
  const result = await svc.listRequests(req.query);
  res.json({ success: true, data: result.requests, pagination: result.pagination });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await svc.getRequestById(req.params.id);
  success(res, request);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const request = await svc.updateRequestStatus(
    req.params.id,
    req.body.status,
    req.user.id,
    req.body.notes
  );
  success(res, request, 'Request status updated');
});

module.exports = { submitRequest, listRequests, getRequestById, updateRequestStatus };
