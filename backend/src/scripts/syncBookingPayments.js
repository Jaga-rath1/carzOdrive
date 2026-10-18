const mongoose = require('mongoose');
const { Booking } = require('../models/booking.model');
const { Payment } = require('../models/payment.model');
const { connectDB } = require('../config/database');

async function syncAllBookingPayments() {
  await connectDB();
  console.log('🔄 Checking all bookings and payment links...');

  const bookings = await Booking.find({});
  console.log(`Found ${bookings.length} total booking(s) in database.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const b of bookings) {
    let payment = null;
    if (b.paymentId) {
      payment = await Payment.findById(b.paymentId);
    }
    if (!payment) {
      payment = await Payment.findOne({
        $or: [
          { bookingId: b._id },
          { bookingNumber: b.bookingNumber },
          b.transactionId ? { transactionId: b.transactionId } : null,
        ].filter(Boolean),
      });
    }

    const total = Number(b.totalAmount || b.priceBreakdown?.totalAmount || 0);
    let paid = Number(b.paidAmount || 0);
    let balance = b.balanceAmount !== undefined ? Number(b.balanceAmount) : Math.max(0, total - paid);

    if (b.paymentMode === 'full') {
      paid = total;
      balance = 0;
    } else if (b.paymentMode === 'offline') {
      paid = 0;
      balance = total;
    } else if (b.paymentMode === 'partial') {
      if (!paid) paid = Math.max(499, Math.round(total * 0.25));
      balance = Math.max(0, total - paid);
    }

    const paymentStatus = b.paymentStatus || (
      b.paymentMode === 'offline' ? 'OFFLINE_PENDING' :
      b.paymentMode === 'partial' ? 'PARTIALLY_PAID' : 'PAID'
    );

    const txnId =
      b.transactionId ||
      (b.paymentMode === 'offline'
        ? 'PAY_ON_PICKUP'
        : `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);

    if (!payment) {
      payment = await Payment.create({
        bookingId: b._id,
        bookingNumber: b.bookingNumber,
        customerId: b.customerId || null,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        guestPhone: b.guestPhone,
        amount: total,
        paidAmount: paid,
        balanceAmount: balance,
        currency: 'INR',
        paymentMode: b.paymentMode || 'full',
        method: b.paymentMode === 'offline' ? 'OFFLINE' : 'ONLINE',
        onlineMethod: b.onlineMethod || 'upi',
        upiApp: b.upiApp,
        transactionId: txnId,
        status: paymentStatus,
        offlineMethod: b.paymentMode === 'offline' ? 'WHATSAPP' : undefined,
      });
      createdCount++;
      console.log(` Created Payment ${payment.paymentNumber} for Booking ${b.bookingNumber}`);
    } else {
      payment.bookingNumber = b.bookingNumber;
      payment.guestName = b.guestName || payment.guestName;
      payment.guestPhone = b.guestPhone || payment.guestPhone;
      payment.guestEmail = b.guestEmail || payment.guestEmail;
      payment.amount = total;
      payment.paidAmount = paid;
      payment.balanceAmount = balance;
      payment.paymentMode = b.paymentMode || payment.paymentMode;
      payment.status = paymentStatus;
      if (b.transactionId) payment.transactionId = b.transactionId;
      await payment.save();
      updatedCount++;
    }

    b.paymentId = payment._id;
    b.transactionId = payment.transactionId;
    b.paidAmount = paid;
    b.balanceAmount = balance;
    b.paymentStatus = paymentStatus;
    await b.save();
  }

  console.log(`🎉 Sync completed! Created: ${createdCount}, Updated: ${updatedCount}`);
  process.exit(0);
}

syncAllBookingPayments().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
