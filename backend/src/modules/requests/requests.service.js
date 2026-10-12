const { VehicleRequest } = require('./requests.model');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

// Valid status transitions for vehicle/partner supply requests
const TRANSITIONS = {
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['CONTACTED'],
  CONTACTED: ['APPROVED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
};

async function submitRequest(data, userId) {
  const request = await VehicleRequest.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    vehicleType: data.vehicleType,
    vehicleDetails: data.vehicleDetails,
    message: data.message,
    status: 'SUBMITTED',
    submittedUserId: userId || null,
  });
  return request;
}

async function listRequests(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.email) filter.email = { $regex: query.email, $options: 'i' };

  const [requests, total] = await Promise.all([
    VehicleRequest.find(filter)
      .populate('decisionBy', 'name email')
      .populate('submittedUserId', 'name email')
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    VehicleRequest.countDocuments(filter),
  ]);

  return { requests, pagination: buildPaginationMeta(total, page, limit) };
}

async function getRequestById(requestId) {
  const request = await VehicleRequest.findById(requestId)
    .populate('decisionBy', 'name email')
    .populate('submittedUserId', 'name email');
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  return request;
}

async function updateRequestStatus(requestId, newStatus, adminId, notes) {
  const request = await VehicleRequest.findById(requestId);
  if (!request) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }

  const allowed = TRANSITIONS[request.status] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `Cannot transition from ${request.status} to ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`
    );
    err.statusCode = 400;
    throw err;
  }

  request.status = newStatus;
  request.adminNotes = notes || request.adminNotes;

  const now = new Date();

  if (newStatus === 'CONTACTED') {
    request.contactedAt = now;
  }

  if (newStatus === 'APPROVED' || newStatus === 'REJECTED') {
    request.decisionBy = adminId;
    request.decisionAt = now;
    if (notes) request.decisionReason = notes;
  }

  await request.save();
  return request;
}

module.exports = {
  submitRequest,
  listRequests,
  getRequestById,
  updateRequestStatus,
};
