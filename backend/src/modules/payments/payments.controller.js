const svc = require('./payments.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const createOnlineOrder = asyncHandler(async (req, res) => {
  const result = await svc.createOnlinePaymentOrder(req.params.bookingId, req.user.id);
  created(res, result, 'Payment order created');
});

const verifyPayment = asyncHandler(async (req, res) => {
  const result = await svc.verifyPayment(req.params.orderId, req.user.id);
  success(res, result);
});

// Webhook — signature validated in service, no auth middleware
const cashfreeWebhook = asyncHandler(async (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers['x-webhook-signature'] || req.headers['x-cashfree-signature'];
  const result = await svc.handleWebhook(rawBody, signature);
  res.status(200).json({ received: true, ...result });
});

const createOfflinePayment = asyncHandler(async (req, res) => {
  const result = await svc.createOfflinePayment(req.params.bookingId, req.user.id, req.body);
  created(res, result, 'Offline payment recorded');
});

const verifyOfflinePayment = asyncHandler(async (req, res) => {
  const result = await svc.verifyOfflinePayment(req.params.paymentId, req.user.id, req.body);
  success(res, result, 'Offline payment verification updated');
});

const initiateRefund = asyncHandler(async (req, res) => {
  const { amount, reason } = req.body;
  if (!amount || !reason) return badRequest(res, 'Amount and reason are required');
  const result = await svc.initiateRefund(req.params.bookingId, amount, reason, req.user.id);
  success(res, result, 'Refund initiated');
});

const getPaymentByBooking = asyncHandler(async (req, res) => {
  const result = await svc.getPaymentByBooking(req.params.bookingId, req.user.id, req.user.role);
  success(res, result);
});

const listPayments = asyncHandler(async (req, res) => {
  const result = await svc.listPayments(req.query);
  res.json({ success: true, data: result.payments, pagination: result.pagination });
});

module.exports = {
  createOnlineOrder, verifyPayment, cashfreeWebhook,
  createOfflinePayment, verifyOfflinePayment, initiateRefund,
  getPaymentByBooking, listPayments,
};
