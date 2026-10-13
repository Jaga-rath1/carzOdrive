const svc = require('./quotations.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const createQuotation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return badRequest(res, 'Validation failed', errors.array());
  const q = await svc.createQuotation(req.user.id, req.body);
  created(res, q, 'Quotation created');
});

const sendQuotation = asyncHandler(async (req, res) => {
  const q = await svc.sendQuotation(req.params.id, req.user.id);
  success(res, q, 'Quotation sent');
});

const listQuotations = asyncHandler(async (req, res) => {
  const result = await svc.listQuotations(req.query, req.user.id, req.user.role);
  res.json({ success: true, data: result.quotations, pagination: result.pagination });
});

const getQuotation = asyncHandler(async (req, res) => {
  const q = await svc.getQuotationById(req.params.id, req.user.id, req.user.role);
  success(res, q);
});

const acceptQuotation = asyncHandler(async (req, res) => {
  const q = await svc.acceptQuotation(req.params.id, req.user.id);
  success(res, q, 'Quotation accepted');
});

const declineQuotation = asyncHandler(async (req, res) => {
  const q = await svc.declineQuotation(req.params.id, req.user.id, req.body.reason);
  success(res, q, 'Quotation declined');
});

const cancelQuotation = asyncHandler(async (req, res) => {
  const q = await svc.cancelQuotation(req.params.id, req.user.id, req.user.role);
  success(res, q, 'Quotation cancelled');
});

module.exports = { createQuotation, sendQuotation, listQuotations, getQuotation, acceptQuotation, declineQuotation, cancelQuotation };
