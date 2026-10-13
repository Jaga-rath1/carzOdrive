const svc = require('./bookings.service');
const { success, created, badRequest } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { badRequest(res, 'Validation failed', errors.array()); return false; }
  return true;
}

const createSelfDriveCar = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const booking = await svc.createSelfDriveCar(req.user.id, req.body);
  created(res, booking, 'Booking created');
});

const createSelfDriveBike = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const booking = await svc.createSelfDriveBike(req.user.id, req.body);
  created(res, booking, 'Booking created');
});

const createCarWithDriver = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const booking = await svc.createCarWithDriver(req.user.id, req.body);
  created(res, booking, 'Booking created');
});

const createDriverOnly = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const booking = await svc.createDriverOnly(req.user.id, req.body);
  created(res, booking, 'Booking created');
});

const createTourBooking = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const booking = await svc.createTourPackageBooking(req.user.id, req.body);
  created(res, booking, 'Booking created');
});

const listBookings = asyncHandler(async (req, res) => {
  const result = await svc.listBookings(req.query, req.user.id, req.user.role);
  res.json({ success: true, data: result.bookings, pagination: result.pagination });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await svc.getBooking(req.params.id, req.user.id, req.user.role);
  success(res, booking);
});

const updateStatus = asyncHandler(async (req, res) => {
  const booking = await svc.updateBookingStatus(
    req.params.id, req.body.status, req.user.id, req.user.role, req.body.note
  );
  success(res, booking, 'Status updated');
});

const assignDriver = asyncHandler(async (req, res) => {
  const booking = await svc.assignDriver(req.params.id, req.body.driverId, req.user.id);
  success(res, booking, 'Driver assigned');
});

const pickupInspection = asyncHandler(async (req, res) => {
  const booking = await svc.recordPickupInspection(req.params.id, req.body, req.user.id);
  success(res, booking, 'Pickup inspection recorded');
});

const returnInspection = asyncHandler(async (req, res) => {
  const booking = await svc.recordReturnInspection(req.params.id, req.body, req.user.id);
  success(res, booking, 'Return inspection recorded');
});

module.exports = {
  createSelfDriveCar, createSelfDriveBike, createCarWithDriver, createDriverOnly, createTourBooking,
  listBookings, getBooking, updateStatus, assignDriver, pickupInspection, returnInspection,
};
