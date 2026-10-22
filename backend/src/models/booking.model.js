const mongoose = require('mongoose');

// Ensure referenced schemas are registered for robust Mongoose population
try {
  require('./user.model');
  require('./payment.model');
} catch (_) {}

const SERVICE_TYPES = [
  'SELF_DRIVE_CAR',
  'SELF_DRIVE_BIKE',
  'CAR_WITH_DRIVER',
  'DRIVER_ONLY',
  'TOUR_PACKAGE',
  'self-drive-car',
  'self-drive-bike',
  'car-with-driver',
  'driver-only',
  'tour-packages',
  'tour-package',
];

const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'];
const PAYMENT_STATUSES = ['PENDING', 'PROCESSING', 'PAID', 'PARTIALLY_PAID', 'OFFLINE_PENDING', 'FAILED', 'REFUND_PENDING', 'REFUNDED'];

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    invoiceNumber: { type: String },
    invoiceDate: { type: Date, default: Date.now },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    serviceType: { type: String, required: true },

    // Guest / Customer contact info (from frontend booking modal)
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    guestPhone: { type: String, trim: true },
    guestNotes: { type: String, trim: true },
    userCarModel: { type: String, trim: true }, // For driver-only service

    // Selected vehicle / bike / driver / tour snapshot
    vehicleId: { type: mongoose.Schema.Types.Mixed },
    bikeId: { type: mongoose.Schema.Types.Mixed },
    driverId: { type: mongoose.Schema.Types.Mixed },
    packageId: { type: mongoose.Schema.Types.Mixed },
    vehicleName: { type: String, trim: true },
    vehicleSlug: { type: String, trim: true },
    vehicleImage: { type: String, trim: true },

    // Locations & Dates
    pickupLocation: { type: mongoose.Schema.Types.Mixed, default: 'SUM Hospital' },
    dropoffLocation: { type: mongoose.Schema.Types.Mixed, default: 'Same as Pick-up Address' },
    startDate: { type: Date },
    endDate: { type: Date },
    pickupDate: { type: String },
    returnDate: { type: String },
    days: { type: Number, default: 1 },
    includeProtection: { type: Boolean, default: false },

    // Payment Section: 'full' (100% Online) | 'partial' (25% Token) | 'offline' (WhatsApp on Pickup)
    paymentMode: {
      type: String,
      enum: ['full', 'partial', 'offline'],
      default: 'full',
    },
    onlineMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'whatsapp', 'cash'],
      default: 'upi',
    },
    upiApp: { type: String },
    transactionId: { type: String },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    securityDeposit: { type: mongoose.Schema.Types.Mixed, default: 0 },

    // Financial breakdown
    priceBreakdown: {
      baseAmount: { type: Number, default: 0 },
      securityDeposit: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      extraCharges: { type: Number, default: 0 },
      protectionFee: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
    },

    // Statuses
    status: { type: String, default: 'CONFIRMED' },
    paymentStatus: { type: String, default: 'PAID' },

    // Notes & History
    customerNotes: { type: String },
    adminNotes: { type: String },
    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Production High-Performance Indexes
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ vendorId: 1, createdAt: -1 });
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ vehicleId: 1, status: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ bikeId: 1, status: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ paymentId: 1 });
bookingSchema.index({ transactionId: 1 });
bookingSchema.index({ guestPhone: 1 });
bookingSchema.index({ guestEmail: 1 });

// Auto-generate booking voucher number (e.g. CZ-2026-X892)
bookingSchema.pre('save', function (next) {
  if (!this.bookingNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `CZ-${ts}-${rand}`;
  }
  if (!this.invoiceNumber && this.bookingNumber) {
    this.invoiceNumber = `INV-${this.bookingNumber.replace(/^CZ-/, '')}`;
  }
  if (!this.invoiceDate) {
    this.invoiceDate = new Date();
  }
  // Sync startDate and endDate if string dates provided
  if (!this.startDate && this.pickupDate) {
    this.startDate = new Date(this.pickupDate);
  }
  if (!this.endDate && this.returnDate) {
    this.endDate = new Date(this.returnDate);
  }
  // Set appropriate paymentStatus according to paymentMode only if not already explicitly specified
  if (!this.paymentStatus) {
    if (this.paymentMode === 'offline') {
      this.paymentStatus = 'OFFLINE_PENDING';
    } else if (this.paymentMode === 'partial') {
      this.paymentStatus = 'PARTIALLY_PAID';
    } else if (this.paymentMode === 'full') {
      this.paymentStatus = 'PAID';
    } else {
      this.paymentStatus = 'PENDING';
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {
  Booking,
  SERVICE_TYPES,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
};
module.exports.Booking = Booking;
