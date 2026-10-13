const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['ONLINE', 'OFFLINE', 'REFUND'], required: true },

    // Online payment (Cashfree)
    cashfreeOrderId: { type: String, sparse: true },
    cashfreePaymentId: { type: String, sparse: true },
    cashfreeSessionId: String,
    checkoutToken: String,

    // Offline payment
    offlineMethod: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI', 'OTHER'] },
    offlineReference: String,
    offlineReceiptUrl: String,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    verificationNotes: String,

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED'],
      default: 'PENDING',
    },

    // Refund
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    refundReason: String,
    originalPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },

    expiresAt: Date,
    webhookEvents: [{
      eventType: String,
      payload: mongoose.Schema.Types.Mixed,
      receivedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ cashfreeOrderId: 1 }, { sparse: true });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = { Payment };
