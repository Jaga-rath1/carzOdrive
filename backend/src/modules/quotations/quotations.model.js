const mongoose = require('mongoose');

const QUOTATION_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED'];

const quotationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin
    serviceType: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    requirements: mongoose.Schema.Types.Mixed, // flexible per service type

    priceBreakdown: {
      baseAmount: Number,
      extras: Number,
      taxes: Number,
      discounts: Number,
      totalAmount: { type: Number, required: true },
    },

    validUntil: { type: Date, required: true },
    status: { type: String, enum: QUOTATION_STATUSES, default: 'DRAFT' },

    acceptedAt: Date,
    declinedAt: Date,
    declineReason: String,
    cancelledAt: Date,

    // Converted booking
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    convertedAt: Date,

    notes: String,
    customerNotes: String,
  },
  { timestamps: true }
);

quotationSchema.index({ customerId: 1, status: 1 });
quotationSchema.index({ status: 1, validUntil: 1 });
quotationSchema.index({ createdBy: 1 });

// Auto-expire quotations
quotationSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'SENT' } });

const Quotation = mongoose.model('Quotation', quotationSchema);
module.exports = { Quotation, QUOTATION_STATUSES };
