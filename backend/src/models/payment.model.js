const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    bookingNumber: { type: String, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Guest / Customer Snapshot
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    guestPhone: { type: String, trim: true },

    // Financials
    amount: { type: Number, required: true }, // Total booking amount
    paidAmount: { type: Number, default: 0 }, // Amount paid in this transaction
    balanceAmount: { type: Number, default: 0 }, // Amount remaining to be collected
    currency: { type: String, default: 'INR' },

    // Payment Strategy
    paymentMode: {
      type: String,
      enum: ['full', 'partial', 'offline'],
      default: 'full',
    },
    method: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'REFUND'],
      default: 'ONLINE',
    },
    onlineMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'whatsapp', 'cash'],
      default: 'upi',
    },
    upiApp: { type: String },
    transactionId: { type: String, trim: true },

    // Online payment (Cashfree / Gateway)
    cashfreeOrderId: { type: String, sparse: true },
    cashfreePaymentId: { type: String, sparse: true },
    cashfreeSessionId: String,
    checkoutToken: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,

    // Offline payment (Pay on Delivery / Pickup)
    offlineMethod: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI', 'WHATSAPP', 'OFFLINE', 'OTHER'] },
    offlineReference: String,
    offlineReceiptUrl: String,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    verificationNotes: String,

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'PARTIALLY_PAID', 'OFFLINE_PENDING', 'FAILED', 'REFUND_PENDING', 'REFUNDED'],
      default: 'PENDING',
    },

    // Refund details
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    refundReason: String,
    originalPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },

    notes: String,
    expiresAt: Date,
    webhookEvents: [
      {
        eventType: String,
        payload: mongoose.Schema.Types.Mixed,
        receivedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ bookingNumber: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Auto-generate payment receipt number (e.g. PAY-2026-X892)
paymentSchema.pre('save', function (next) {
  if (!this.paymentNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.paymentNumber = `PAY-${ts}-${rand}`;
  }
  if (!this.transactionId && this.method === 'ONLINE') {
    this.transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
module.exports.Payment = Payment;
