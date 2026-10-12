const { Quotation } = require('./quotations.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN'];

async function createQuotation(adminId, data) {
  const validUntil = data.validUntil || new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h default
  const quotation = await Quotation.create({
    customerId: data.customerId,
    createdBy: adminId,
    serviceType: data.serviceType,
    title: data.title,
    description: data.description,
    requirements: data.requirements,
    priceBreakdown: data.priceBreakdown,
    validUntil,
    status: 'DRAFT',
    notes: data.notes,
  });
  return quotation;
}

async function sendQuotation(quotationId, adminId) {
  const q = await Quotation.findOne({ _id: quotationId, status: 'DRAFT' });
  if (!q) {
    const err = new Error('Quotation not found or already sent');
    err.statusCode = 404;
    throw err;
  }
  q.status = 'SENT';
  await q.save();
  return q;
}

async function acceptQuotation(quotationId, customerId) {
  const q = await Quotation.findOne({ _id: quotationId, customerId, status: 'SENT' });
  if (!q) {
    const err = new Error('Quotation not found or not available for acceptance');
    err.statusCode = 404;
    throw err;
  }
  if (new Date() > q.validUntil) {
    q.status = 'EXPIRED';
    await q.save();
    const err = new Error('Quotation has expired');
    err.statusCode = 400;
    throw err;
  }
  q.status = 'ACCEPTED';
  q.acceptedAt = new Date();
  await q.save();
  return q;
}

async function declineQuotation(quotationId, customerId, reason) {
  const q = await Quotation.findOne({ _id: quotationId, customerId, status: 'SENT' });
  if (!q) {
    const err = new Error('Quotation not found');
    err.statusCode = 404;
    throw err;
  }
  q.status = 'DECLINED';
  q.declinedAt = new Date();
  q.declineReason = reason;
  await q.save();
  return q;
}

async function cancelQuotation(quotationId, userId, userRole) {
  const filter = { _id: quotationId, status: { $in: ['DRAFT', 'SENT'] } };
  if (!ADMIN_ROLES.includes(userRole)) filter.customerId = userId;
  const q = await Quotation.findOne(filter);
  if (!q) {
    const err = new Error('Quotation not found or cannot be cancelled');
    err.statusCode = 404;
    throw err;
  }
  q.status = 'CANCELLED';
  q.cancelledAt = new Date();
  await q.save();
  return q;
}

async function markConverted(quotationId, bookingId) {
  return Quotation.findByIdAndUpdate(
    quotationId,
    { bookingId, convertedAt: new Date() },
    { new: true }
  );
}

async function listQuotations(query, userId, userRole) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (!ADMIN_ROLES.includes(userRole)) filter.customerId = userId;
  if (query.status) filter.status = query.status;
  if (query.customerId && ADMIN_ROLES.includes(userRole)) filter.customerId = query.customerId;

  const [quotations, total] = await Promise.all([
    Quotation.find(filter)
      .populate('customerId', 'name email')
      .populate('createdBy', 'name email')
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Quotation.countDocuments(filter),
  ]);
  return { quotations, pagination: buildPaginationMeta(total, page, limit) };
}

async function getQuotationById(quotationId, userId, userRole) {
  const filter = { _id: quotationId };
  if (!ADMIN_ROLES.includes(userRole)) filter.customerId = userId;
  const q = await Quotation.findOne(filter)
    .populate('customerId', 'name email phone')
    .populate('createdBy', 'name email')
    .populate('bookingId');
  if (!q) {
    const err = new Error('Quotation not found');
    err.statusCode = 404;
    throw err;
  }
  return q;
}

async function expireOldQuotations() {
  const result = await Quotation.updateMany(
    { status: 'SENT', validUntil: { $lt: new Date() } },
    { status: 'EXPIRED' }
  );
  return result.modifiedCount;
}

module.exports = {
  createQuotation, sendQuotation, acceptQuotation, declineQuotation,
  cancelQuotation, markConverted, listQuotations, getQuotationById, expireOldQuotations,
};
