/**
 * Payment Synchronization Helper for Bookings
 */
async function createOrSyncPaymentForBooking(booking) {
  if (!booking) return null;
  const PaymentModel = require('../models/payment.model').Payment;

  let payment = null;
  if (booking.paymentId) {
    payment = await PaymentModel.findById(booking.paymentId);
  }
  if (!payment) {
    payment = await PaymentModel.findOne({
      $or: [
        { bookingId: booking._id },
        { bookingNumber: booking.bookingNumber },
        booking.transactionId ? { transactionId: booking.transactionId } : null,
      ].filter(Boolean),
    });
  }

  const total = Number(booking.totalAmount || booking.priceBreakdown?.totalAmount || 0);
  let paid = Number(booking.paidAmount || 0);
  let balance = booking.balanceAmount !== undefined ? Number(booking.balanceAmount) : Math.max(0, total - paid);

  if (booking.paymentMode === 'full') {
    paid = total;
    balance = 0;
  } else if (booking.paymentMode === 'offline') {
    paid = 0;
    balance = total;
  } else if (booking.paymentMode === 'partial') {
    if (!paid) paid = Math.max(499, Math.round(total * 0.25));
    balance = Math.max(0, total - paid);
  }

  const paymentStatus = booking.paymentStatus || (
    booking.paymentMode === 'offline' ? 'OFFLINE_PENDING' :
    booking.paymentMode === 'partial' ? 'PARTIALLY_PAID' : 'PAID'
  );

  const txnId = booking.transactionId || `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  if (!payment) {
    payment = await PaymentModel.create({
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId || null,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      amount: total,
      paidAmount: paid,
      balanceAmount: balance,
      currency: 'INR',
      paymentMode: booking.paymentMode || 'full',
      method: booking.paymentMode === 'offline' ? 'OFFLINE' : 'ONLINE',
      onlineMethod: booking.onlineMethod || 'upi',
      upiApp: booking.upiApp,
      transactionId: txnId,
      status: paymentStatus,
      offlineMethod: booking.paymentMode === 'offline' ? 'WHATSAPP' : undefined,
    });
  } else {
    // Dynamic sync of existing payment
    payment.bookingNumber = booking.bookingNumber;
    if (booking.guestName) payment.guestName = booking.guestName;
    if (booking.guestPhone) payment.guestPhone = booking.guestPhone;
    if (booking.guestEmail) payment.guestEmail = booking.guestEmail;
    payment.amount = total;
    payment.paidAmount = paid;
    payment.balanceAmount = balance;
    payment.paymentMode = booking.paymentMode || payment.paymentMode;
    payment.status = paymentStatus;
    if (booking.transactionId) payment.transactionId = booking.transactionId;
    if (booking.onlineMethod) payment.onlineMethod = booking.onlineMethod;
    if (booking.upiApp) payment.upiApp = booking.upiApp;
    await payment.save();
  }

  // Ensure 2-way link in booking
  let needsBookingSave = false;
  if (!booking.paymentId || String(booking.paymentId) !== String(payment._id)) {
    booking.paymentId = payment._id;
    needsBookingSave = true;
  }
  if (!booking.transactionId || booking.transactionId !== payment.transactionId) {
    booking.transactionId = payment.transactionId;
    needsBookingSave = true;
  }
  if (booking.paidAmount !== paid || booking.balanceAmount !== balance) {
    booking.paidAmount = paid;
    booking.balanceAmount = balance;
    needsBookingSave = true;
  }
  if (booking.paymentStatus !== paymentStatus) {
    booking.paymentStatus = paymentStatus;
    needsBookingSave = true;
  }

  if (needsBookingSave) {
    await booking.save();
  }

  return payment;
}

module.exports = {
  createOrSyncPaymentForBooking,
};
