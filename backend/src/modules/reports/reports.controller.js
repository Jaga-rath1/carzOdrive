const svc = require('./reports.service');
const { success } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const getOverallStats = asyncHandler(async (req, res) => {
  const stats = await svc.getOverallStats();
  success(res, stats, 'Overall stats');
});

const getBookingReport = asyncHandler(async (req, res) => {
  const result = await svc.getBookingReport(req.query);
  res.json({ success: true, data: result.bookings, pagination: result.pagination });
});

const getRevenueReport = asyncHandler(async (req, res) => {
  const result = await svc.getRevenueReport(req.query);
  success(res, result, 'Revenue report');
});

const getPendingApprovals = asyncHandler(async (req, res) => {
  const result = await svc.getPendingApprovals();
  success(res, result, 'Pending approvals');
});

const getVendorReport = asyncHandler(async (req, res) => {
  const result = await svc.getVendorReport(req.params.vendorId);
  success(res, result, 'Vendor report');
});

const getRefundReport = asyncHandler(async (req, res) => {
  const result = await svc.getRefundReport(req.query);
  success(res, result, 'Refund report');
});

module.exports = {
  getOverallStats,
  getBookingReport,
  getRevenueReport,
  getPendingApprovals,
  getVendorReport,
  getRefundReport,
};
