const svc = require('../services/vendors.service');
const { success, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Handle "Rent Your Car" enrollment
 */
const attachCar = asyncHandler(async (req, res) => {
  const {
    ownerName,
    phone,
    email,
    city,
    vehicleBrand,
    vehicleModel,
    vehicleNumber,
    vehicleType,
    manufacturingYear,
    expectedDailyPrice,
    fuelType,
    transmission,
    seats,
    image,
    rcDocumentUrl,
    insuranceDocumentUrl,
    idProofUrl,
    documents,
    notes,
  } = req.body;

  if (!phone || !vehicleBrand || !vehicleModel) {
    const err = new Error('Owner phone, vehicle brand, and model are required');
    err.statusCode = 400;
    throw err;
  }

  const result = await svc.attachCar(
    { ownerName, name: ownerName, phone, email, city },
    {
      vehicleBrand,
      vehicleModel,
      vehicleNumber,
      vehicleType,
      manufacturingYear,
      expectedDailyPrice,
      fuelType,
      transmission,
      seats,
      image,
      rcDocumentUrl,
      insuranceDocumentUrl,
      idProofUrl,
      documents,
      notes,
    }
  );

  created(res, result, 'Your car has been submitted successfully for verification! Our partner manager will contact you.');
});

/**
 * Handle "Rent Your Bike" enrollment
 */
const attachBike = asyncHandler(async (req, res) => {
  const {
    ownerName,
    phone,
    email,
    city,
    bikeBrand,
    bikeModel,
    bikeNumber,
    bikeType,
    manufacturingYear,
    expectedDailyPrice,
    engineCC,
    image,
    rcDocumentUrl,
    insuranceDocumentUrl,
    idProofUrl,
    documents,
    notes,
  } = req.body;

  if (!phone || !bikeBrand || !bikeModel) {
    const err = new Error('Owner phone, bike brand, and model are required');
    err.statusCode = 400;
    throw err;
  }

  const result = await svc.attachBike(
    { ownerName, name: ownerName, phone, email, city },
    {
      bikeBrand,
      bikeModel,
      bikeNumber,
      bikeType,
      manufacturingYear,
      expectedDailyPrice,
      engineCC,
      image,
      rcDocumentUrl,
      insuranceDocumentUrl,
      idProofUrl,
      documents,
      notes,
    }
  );

  created(res, result, 'Your bike has been submitted successfully for verification! Our partner manager will contact you.');
});

/**
 * Get authenticated vendor's fleet
 */
const getMyFleet = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;
  const fleet = await svc.getVendorFleet(vendorId);
  success(res, fleet, 'Vendor fleet retrieved successfully');
});

/**
 * Admin list all vendor submissions
 */
const listSubmissions = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const submissions = await svc.listVendorSubmissions({ status, type });
  success(res, submissions, 'Vendor submissions retrieved');
});

/**
 * Admin approve vendor car or bike
 */
const approveSubmission = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const adminId = req.user?.id;
  const approvedItem = await svc.approveVendorSubmission(type, id, adminId);
  success(res, approvedItem, `${type.toUpperCase()} approved and published to live rental catalog!`);
});

/**
 * Admin reject vendor car or bike
 */
const rejectSubmission = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const adminId = req.user?.id;
  const { reason } = req.body;
  const rejectedItem = await svc.rejectVendorSubmission(type, id, adminId, reason);
  success(res, rejectedItem, `${type.toUpperCase()} listing rejected.`);
});

/**
 * Admin delete vendor car or bike submission
 */
const deleteSubmission = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const result = await svc.deleteVendorSubmission(type, id);
  success(res, result, result.message || `${type.toUpperCase()} submission deleted successfully.`);
});

/**
 * Admin update vendor car or bike submission
 */
const updateSubmission = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const updatedItem = await svc.updateVendorSubmission(type, id, req.body);
  success(res, updatedItem, `${type.toUpperCase()} listing updated successfully!`);
});

module.exports = {
  attachCar,
  attachBike,
  getMyFleet,
  listSubmissions,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  updateSubmission,
};
