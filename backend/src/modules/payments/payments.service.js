const crypto = require('crypto');
const https = require('https');
const { Payment } = require('./payments.model');
const { Booking } = require('../bookings/bookings.model');
const { env } = require('../../config/env');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const CASHFREE_BASE = env.cashfree.environment === 'production'
  ? 'api.cashfree.com'
  : 'sandbox.cashfree.com';

function cashfreeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: CASHFREE_BASE,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': env.cashfree.appId,
        'x-client-secret': env.cashfree.secretKey,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function createOnlinePaymentOrder(bookingId, customerId) {
  const booking = await Booking.findOne({ _id: bookingId, customerId, paymentStatus: 'PENDING' })
    .populate('customerId', 'name email phone');
  if (!booking) {
    const err = new Error('Booking not found or not eligible for payment');
    err.statusCode = 404;
    throw err;
  }

  const orderId = `CZ-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const customer = booking.customerId;

  const cfBody = {
    order_id: orderId,
    order_amount: booking.priceBreakdown.totalAmount,
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId.toString(),
      customer_email: customer.email || 'customer@carzodrive.com',
      customer_phone: customer.phone || '9999999999',
      customer_name: customer.name,
    },
    order_meta: {
      notify_url: `${env.frontendUrl}/api/v1/payments/webhook/cashfree`,
    },
  };

  const cfRes = await cashfreeRequest('POST', '/pg/orders', cfBody);
  if (cfRes.status !== 200) {
    const err = new Error(cfRes.body?.message || 'Failed to create payment order');
    err.statusCode = 502;
    throw err;
  }

  const payment = await Payment.create({
    bookingId,
    customerId,
    amount: booking.priceBreakdown.totalAmount,
    method: 'ONLINE',
    cashfreeOrderId: orderId,
    cashfreeSessionId: cfRes.body.payment_session_id,
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  booking.paymentId = payment._id;
  booking.paymentStatus = 'PROCESSING';
  await booking.save();

  return {
    paymentId: payment._id,
    orderId,
    paymentSessionId: cfRes.body.payment_session_id,
    amount: booking.priceBreakdown.totalAmount,
  };
}

function verifyWebhookSignature(rawBody, signature) {
  const computed = crypto
    .createHmac('sha256', env.cashfree.webhookSecret)
    .update(rawBody)
    .digest('base64');
  return computed === signature;
}

async function handleWebhook(rawBody, signature) {
  if (!verifyWebhookSignature(rawBody, signature)) {
    const err = new Error('Invalid webhook signature');
    err.statusCode = 401;
    throw err;
  }

  const event = JSON.parse(rawBody);
  const orderId = event?.data?.order?.order_id || event?.order_id;
  const eventType = event.type;

  if (!orderId) return { processed: false, reason: 'No order ID' };

  const payment = await Payment.findOne({ cashfreeOrderId: orderId });
  if (!payment) return { processed: false, reason: 'Payment not found' };

  // Idempotency check
  const alreadyProcessed = payment.webhookEvents.some(
    (e) => e.eventType === eventType && e.payload?.cf_payment_id === event?.data?.payment?.cf_payment_id
  );
  if (alreadyProcessed) return { processed: true, reason: 'Duplicate event' };

  payment.webhookEvents.push({ eventType, payload: event.data, receivedAt: new Date() });

  const booking = await Booking.findById(payment.bookingId);

  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || eventType === 'PAYMENT_SUCCESS') {
    payment.status = 'PAID';
    payment.cashfreePaymentId = event?.data?.payment?.cf_payment_id;
    if (booking) {
      booking.paymentStatus = 'PAID';
      if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
      await booking.save();
    }
  } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || eventType === 'PAYMENT_FAILED') {
    payment.status = 'FAILED';
    if (booking) {
      booking.paymentStatus = 'FAILED';
      await booking.save();
    }
  }

  await payment.save();
  return { processed: true };
}

async function verifyPayment(cashfreeOrderId, customerId) {
  const payment = await Payment.findOne({ cashfreeOrderId, customerId });
  if (!payment) {
    const err = new Error('Payment record not found');
    err.statusCode = 404;
    throw err;
  }

  const cfRes = await cashfreeRequest('GET', `/pg/orders/${cashfreeOrderId}`, null);
  if (cfRes.status !== 200) {
    const err = new Error('Failed to verify payment with Cashfree');
    err.statusCode = 502;
    throw err;
  }

  const orderStatus = cfRes.body.order_status;
  if (orderStatus === 'PAID' && payment.status !== 'PAID') {
    payment.status = 'PAID';
    await payment.save();
    const booking = await Booking.findById(payment.bookingId);
    if (booking && booking.paymentStatus !== 'PAID') {
      booking.paymentStatus = 'PAID';
      if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
      await booking.save();
    }
  }

  return payment;
}

async function createOfflinePayment(bookingId, customerId, data) {
  const booking = await Booking.findOne({ _id: bookingId, customerId });
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const payment = await Payment.create({
    bookingId,
    customerId,
    amount: data.amount || booking.priceBreakdown.totalAmount,
    method: 'OFFLINE',
    offlineMethod: data.offlineMethod,
    offlineReference: data.reference,
    verificationNotes: data.notes,
    status: 'PENDING',
  });

  booking.paymentId = payment._id;
  await booking.save();
  return payment;
}

async function verifyOfflinePayment(paymentId, adminId, data) {
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.method !== 'OFFLINE') {
    const err = new Error('Offline payment not found');
    err.statusCode = 404;
    throw err;
  }

  payment.verifiedBy = adminId;
  payment.verifiedAt = new Date();
  payment.verificationNotes = data.notes;

  const booking = await Booking.findById(payment.bookingId);

  if (data.approve) {
    payment.status = 'PAID';
    if (booking) {
      booking.paymentStatus = 'PAID';
      if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
      await booking.save();
    }
  } else {
    payment.status = 'FAILED';
    if (booking) {
      booking.paymentStatus = 'FAILED';
      await booking.save();
    }
  }

  await payment.save();
  return payment;
}

async function initiateRefund(bookingId, amount, reason, adminId) {
  const payment = await Payment.findOne({ bookingId, status: 'PAID' });
  if (!payment) {
    const err = new Error('No paid payment found for this booking');
    err.statusCode = 404;
    throw err;
  }

  const booking = await Booking.findById(bookingId);
  booking.paymentStatus = 'REFUND_PENDING';
  await booking.save();

  if (payment.method === 'ONLINE' && payment.cashfreeOrderId) {
    const refundId = `RF-${Date.now()}`;
    const cfRes = await cashfreeRequest('POST', `/pg/orders/${payment.cashfreeOrderId}/refunds`, {
      refund_amount: amount,
      refund_id: refundId,
      refund_note: reason,
    });

    payment.refundId = cfRes.body?.cf_refund_id || refundId;
    payment.refundAmount = amount;
    payment.refundReason = reason;
    payment.status = 'REFUND_PENDING';
    await payment.save();
    return payment;
  }

  // Offline refund record
  const refundPayment = await Payment.create({
    bookingId,
    customerId: payment.customerId,
    amount,
    method: 'REFUND',
    originalPaymentId: payment._id,
    status: 'REFUND_PENDING',
    refundReason: reason,
    verifiedBy: adminId,
  });

  return refundPayment;
}

async function getPaymentByBooking(bookingId, userId, userRole) {
  const ADMINS = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN'];
  const filter = { bookingId };
  if (!ADMINS.includes(userRole)) filter.customerId = userId;
  const payment = await Payment.findOne(filter);
  if (!payment) {
    const err = new Error('Payment not found');
    err.statusCode = 404;
    throw err;
  }
  return payment;
}

async function listPayments(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.method) filter.method = query.method;
  if (query.customerId) filter.customerId = query.customerId;
  const [payments, total] = await Promise.all([
    Payment.find(filter).populate('bookingId', 'bookingNumber serviceType').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Payment.countDocuments(filter),
  ]);
  return { payments, pagination: buildPaginationMeta(total, page, limit) };
}

module.exports = {
  createOnlinePaymentOrder, handleWebhook, verifyPayment,
  createOfflinePayment, verifyOfflinePayment, initiateRefund,
  getPaymentByBooking, listPayments,
};
