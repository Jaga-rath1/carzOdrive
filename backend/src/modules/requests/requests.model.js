const mongoose = require('mongoose');

const REQUEST_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'CONTACTED', 'APPROVED', 'REJECTED'];

const vehicleRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    vehicleType: { type: String, trim: true },
    vehicleDetails: { type: mongoose.Schema.Types.Mixed },
    message: { type: String, trim: true, maxlength: 3000 },
    status: { type: String, enum: REQUEST_STATUSES, default: 'SUBMITTED' },
    contactedAt: { type: Date },
    adminNotes: { type: String, trim: true, maxlength: 2000 },
    decisionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    decisionAt: { type: Date },
    decisionReason: { type: String, trim: true, maxlength: 2000 },
    submittedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

vehicleRequestSchema.index({ status: 1, createdAt: -1 });
vehicleRequestSchema.index({ email: 1 });

const VehicleRequest = mongoose.model('VehicleRequest', vehicleRequestSchema);
module.exports = { VehicleRequest, REQUEST_STATUSES };
