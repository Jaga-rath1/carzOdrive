const mongoose = require('mongoose');

const SERVICE_TYPES = ['SELF_DRIVE_CAR', 'SELF_DRIVE_BIKE', 'CAR_WITH_DRIVER', 'DRIVER_ONLY', 'TOUR_PACKAGE'];
const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'];
const PAYMENT_STATUSES = ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED'];

const priceBreakdownSchema = new mongoose.Schema({
  baseAmount: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  extraCharges: { type: Number, default: 0 },
  discounts: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
}, { _id: false });

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, enum: SERVICE_TYPES, required: true },

    // Resource references (only relevant ones populated per service type)
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },

    // Dates
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    actualStartDate: Date,
    actualEndDate: Date,

    // Location
    pickupLocation: {
      address: String,
      city: String,
      coordinates: { lat: Number, lng: Number },
    },
    dropoffLocation: {
      address: String,
      city: String,
      coordinates: { lat: Number, lng: Number },
    },

    // Pricing snapshot — frozen at booking creation
    priceBreakdown: { type: priceBreakdownSchema, required: true },

    // Status
    status: { type: String, enum: BOOKING_STATUSES, default: 'PENDING' },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'PENDING' },

    // Payment references
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },

    // Tour-specific
    tourDate: Date,
    travelers: [{
      name: String,
      age: Number,
      type: { type: String, enum: ['ADULT', 'CHILD', 'INFANT'] },
      idProof: String,
    }],

    // Self-drive inspection records
    pickupInspection: {
      notes: String,
      images: [String],
      fuelLevel: String,
      odometer: Number,
      inspectedAt: Date,
    },
    returnInspection: {
      notes: String,
      images: [String],
      fuelLevel: String,
      odometer: Number,
      extraKm: Number,
      extraCharges: Number,
      inspectedAt: Date,
    },

    // Cancellation
    cancellationReason: String,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date,
    refundAmount: Number,

    // Notes
    customerNotes: String,
    adminNotes: String,

    statusHistory: [{
      status: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changedAt: { type: Date, default: Date.now },
      note: String,
    }],
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ vehicleId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ bikeId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ driverId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ packageId: 1, tourDate: 1 });
bookingSchema.index({ vendorId: 1, status: 1 });
bookingSchema.index({ bookingNumber: 1 }, { unique: true, sparse: true });
bookingSchema.index({ status: 1, createdAt: -1 });

// Auto-generate booking number
bookingSchema.pre('save', function (next) {
  if (!this.bookingNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `CZ-${ts}-${rand}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = { Booking, SERVICE_TYPES, BOOKING_STATUSES, PAYMENT_STATUSES };
