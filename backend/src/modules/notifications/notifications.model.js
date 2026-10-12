const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'BOOKING_CONFIRMED',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'PAYMENT_VERIFIED',
  'QUOTATION_SENT',
  'QUOTATION_ACCEPTED',
  'DRIVER_ASSIGNED',
  'BOOKING_CANCELLED',
  'REFUND_INITIATED',
  'REFUND_COMPLETED',
  'VENDOR_APPROVED',
  'SERVICE_COMPLETED',
  'SYSTEM',
];

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = { Notification, NOTIFICATION_TYPES };
