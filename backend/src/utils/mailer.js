require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const user = rawUser.trim();
  const pass = rawPass.replace(/\s+/g, ''); // Strip all spaces (common when copying Google App Passwords)

  const service = (process.env.SMTP_SERVICE || '').trim().toLowerCase();
  const host = (process.env.SMTP_HOST || (service === 'gmail' ? 'smtp.gmail.com' : 'smtp.gmail.com')).trim();
  const port = parseInt(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? '465' : '587'), 10);
  const isSecure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
    logger.success(`✓ Nodemailer configured with ${host}:${port} [Secure: ${isSecure}, User: ${user}]`);
  } else {
    // Development / fallback transporter using JSON transport or logging
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    logger.info('ℹ️ Nodemailer: SMTP credentials not set in .env. OTP will be logged directly to the server terminal.');
  }

  return transporter;
}

/**
 * Verify transporter connection
 */
async function verifyMailer() {
  const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const user = rawUser.trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
    return { configured: false, message: 'SMTP credentials pending in .env (SMTP_USER / SMTP_PASS)' };
  }

  try {
    const client = getTransporter();
    await client.verify();
    logger.success('✓ Nodemailer SMTP handshake verified successfully.');
    return { configured: true, message: 'SMTP ready' };
  } catch (err) {
    logger.error('Nodemailer SMTP verification failed:', err.message);
    return { configured: false, error: err.message };
  }
}

/**
 * Send 6-digit password reset OTP email
 */
async function sendPasswordResetOtp({ email, name = 'Customer', otp }) {
  const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const user = rawUser.trim();
  const from = process.env.EMAIL_FROM || (user ? `"CARZODRIVE Concierge" <${user}>` : '"CARZODRIVE Concierge" <no-reply@carzodrive.com>');
  const subject = `CARZODRIVE Verification Code: ${otp}`;

  const textContent = `Hello ${name},\n\nYour 6-digit verification code to reset your CARZODRIVE password is:\n\n${otp}\n\nThis OTP is valid for 15 minutes. If you did not request this, please ignore this email or contact support.\n\nWarm regards,\nCARZODRIVE Odisha Mobility Team`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 28px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">CARZODRIVE</h1>
        <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 13px;">Premium Odisha Mobility Platform</p>
      </div>
      <div style="padding: 32px 28px;">
        <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 700;">Password Reset Verification</h2>
        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Hello <strong style="color: #f1f5f9;">${name}</strong>,<br/>
          We received a request to reset your CARZODRIVE account password. Use the verification code below to complete the reset:
        </p>
        
        <div style="background-color: #0f172a; border: 2px dashed #38bdf8; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
          <p style="margin: 8px 0 0 0; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600;">Valid for 15 minutes only</p>
        </div>

        <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
          If you did not make this request, you can safely ignore this email. Your password will remain unchanged.
        </p>
        <p style="margin: 16px 0 0 0; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 12px;">
          💡 <em>Tip: If this email landed in your Spam/Junk folder, please click "Report Not Spam" to ensure future booking confirmations reach your Primary Inbox.</em>
        </p>
      </div>
      <div style="background-color: #020617; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b;">
        <p style="margin: 0; color: #64748b; font-size: 11px;">
          © ${new Date().getFullYear()} CARZODRIVE LUXURY MOBILITY. Bhubaneswar, Odisha. All rights reserved.
        </p>
      </div>
    </div>
  `;

  // Always log to console in development so developers / testers see it immediately
  console.log(`\n======================================================`);
  console.log(`🔑 [AUTH EMAIL] Password Reset OTP for: ${email}`);
  console.log(`👉 Verification Code (OTP): [ ${otp} ]`);
  console.log(`⏰ Valid for: 15 minutes`);
  console.log(`======================================================\n`);

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from,
      replyTo: user || 'support@carzodrive.com',
      to: email,
      subject,
      headers: {
        'X-Priority': '1',
        'Importance': 'high',
      },
      text: textContent,
      html: htmlContent,
    });
    logger.success(`✓ Password reset OTP sent successfully to: ${email} [MessageId: ${info.messageId}]`);
    return { success: true, messageId: info.messageId, otp };
  } catch (err) {
    logger.error(`Email sending error for ${email}:`, err.message);
    return { success: false, error: err.message, otp };
  }
}

const COMPANY_INVOICE_META = {
  legalName: 'CARZODRIVE LUXURY MOBILITY & TOURS PRIVATE LIMITED',
  tradeName: 'CARZODRIVE',
  address: 'Plot No. 42, Airport Square, Master Canteen, Bhubaneswar, Odisha - 751001, India',
  gstin: '21AAACC1234D1Z5',
  cin: 'U50100OR2026PTC045812',
  pan: 'AAACC1234D',
  stateCode: '21 (Odisha)',
  supportPhone: '+91 79780 00000',
  supportEmail: 'concierge@carzodrive.com',
  sacCarRental: '996411',
  sacTourOperator: '998553',
};

/**
 * Send official GST Tax Invoice & Travel Voucher email to Customer with PDF Attachment
 */
async function sendBookingInvoiceToCustomer({ email, name = 'Valued Guest', booking, pdfBuffer = null }) {
  if (!email || !email.includes('@') || email.includes('@offline.carzodrive.com')) {
    return { success: false, reason: 'No valid customer email' };
  }

  // Generate official PDF Tax Invoice attachment if not pre-generated
  if (!pdfBuffer) {
    try {
      const { generateInvoicePdfBuffer } = require('./pdfInvoiceGenerator');
      pdfBuffer = await generateInvoicePdfBuffer(booking);
    } catch (e) {
      logger.warn('Could not generate PDF attachment for customer email:', e?.message);
    }
  }

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || (user ? `CARZODRIVE Concierge <${user}>` : 'CARZODRIVE Concierge <no-reply@carzodrive.com>');
  const bookingNumber = booking.bookingNumber || booking._id;
  const invoiceNumber = booking.invoiceNumber || `INV-${String(bookingNumber).replace(/^CZ-/, '')}`;
  const subject = `Tax Invoice & Booking Voucher: #${bookingNumber} (${invoiceNumber}) — CARZODRIVE`;

  const isTour =
    booking.serviceType?.toLowerCase().includes('tour') ||
    booking.serviceType?.toLowerCase().includes('package') ||
    Boolean(booking.packageId);

  const sacCode = isTour ? COMPANY_INVOICE_META.sacTourOperator : COMPANY_INVOICE_META.sacCarRental;
  const gstRate = isTour ? 5 : 18;

  const total = Number(booking.totalAmount || booking.priceBreakdown?.totalAmount || 0);
  const paid = Number(booking.paidAmount || (booking.paymentStatus === 'PAID' ? total : 0));
  const balance = booking.balanceAmount !== undefined ? Number(booking.balanceAmount) : Math.max(0, total - paid);
  const deposit = Number(booking.securityDeposit || booking.priceBreakdown?.securityDeposit || 0);

  const baseRate = Math.round(total / (1 + gstRate / 100));
  const gstAmount = Math.max(0, total - baseRate);
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const customerName = name || booking.guestName || booking.customerId?.name || 'Valued Guest';
  const customerPhone = booking.guestPhone || booking.customerId?.phone || '';
  const vehicleName =
    booking.vehicleName ||
    booking.vehicleId?.name ||
    booking.bikeId?.name ||
    booking.packageId?.name ||
    booking.packageId?.title ||
    (isTour ? 'Odisha Tour Package' : 'Fleet Rental');

  const formatLoc = (loc, fallback) => {
    if (!loc) return fallback;
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') return loc.address || loc.name || loc.city || fallback;
    return String(loc);
  };

  const pickup = formatLoc(booking.pickupLocation, 'Bhubaneswar Hub');
  const dropoff = formatLoc(booking.dropoffLocation, 'Same as Pickup');
  const pickupDate = booking.pickupDate || (booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : 'Scheduled');
  const returnDate = booking.returnDate || (booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : 'Scheduled');
  const days = booking.days || (isTour ? 1 : 1);
  const formattedInvoiceDate = booking.invoiceDate ? new Date(booking.invoiceDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const voucherUrl = `${frontendUrl}/my-bookings?code=${encodeURIComponent(bookingNumber)}`;

  const textContent = `CARZODRIVE LUXURY MOBILITY & TOURS\n` +
    `OFFICIAL TAX INVOICE & TRAVEL VOUCHER\n\n` +
    `Invoice No: ${invoiceNumber}\n` +
    `Booking Ref: ${bookingNumber}\n` +
    `Date: ${formattedInvoiceDate}\n\n` +
    `Dear ${customerName},\n` +
    `Thank you for booking with CARZODRIVE. Your reservation is confirmed.\n\n` +
    `Service / Vehicle: ${vehicleName} (SAC: ${sacCode})\n` +
    `Schedule: ${pickupDate} to ${returnDate} (${days} ${days === 1 ? 'Day' : 'Days'})\n` +
    `Pick-up: ${pickup}\n` +
    `Drop-off: ${dropoff}\n\n` +
    `Financial Summary:\n` +
    `• Taxable Subtotal: ₹${baseRate.toLocaleString('en-IN')}\n` +
    `• CGST (${(gstRate / 2).toFixed(1)}%): ₹${cgst.toLocaleString('en-IN')}\n` +
    `• SGST (${(gstRate / 2).toFixed(1)}%): ₹${sgst.toLocaleString('en-IN')}\n` +
    `• Grand Total: ₹${total.toLocaleString('en-IN')}\n` +
    `• Advance Paid: ₹${paid.toLocaleString('en-IN')}\n` +
    `• Balance Payable at Handover: ₹${balance.toLocaleString('en-IN')}\n\n` +
    `📎 ATTACHMENT: Official Tax Invoice PDF (${invoiceNumber}.pdf) is attached to this email for your corporate accounting and travel records.\n\n` +
    `View or download your full Tax Invoice online anytime: ${voucherUrl}\n\n` +
    `24x7 Helpline: ${COMPANY_INVOICE_META.supportPhone}\n` +
    `CARZODRIVE Odisha Mobility Team`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tax Invoice & Travel Voucher</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030712; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 32px 28px; text-align: left;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 1px;">CARZODRIVE</h1>
                        <p style="margin: 4px 0 0 0; color: #e0f2fe; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                          ${COMPANY_INVOICE_META.legalName}
                        </p>
                        <p style="margin: 6px 0 0 0; color: #bae6fd; font-size: 11px; line-height: 1.4;">
                          ${COMPANY_INVOICE_META.address}<br/>
                          GSTIN: <strong style="color: #ffffff;">${COMPANY_INVOICE_META.gstin}</strong> • PAN: ${COMPANY_INVOICE_META.pan} • State Code: 21 (Odisha)
                        </p>
                      </td>
                      <td align="right" style="vertical-align: top;">
                        <span style="display: inline-block; background-color: #ffffff; color: #0f172a; font-weight: 900; font-size: 11px; padding: 6px 14px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
                          TAX INVOICE
                        </span>
                        <p style="margin: 8px 0 0 0; color: #e0f2fe; font-size: 10px; font-weight: 600;">ORIGINAL FOR RECIPIENT</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Greeting & Invoice Reference Bar -->
              <tr>
                <td style="padding: 24px 28px; border-bottom: 1px solid #1e293b; background-color: #1e293b/40;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <h2 style="margin: 0; color: #38bdf8; font-size: 18px; font-weight: 800;">Reservation Confirmed & Allocated</h2>
                        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">
                          Dear <strong style="color: #f1f5f9;">${customerName}</strong>, your official travel voucher has been issued.
                        </p>
                      </td>
                      <td align="right" style="font-family: monospace; font-size: 12px; color: #cbd5e1;">
                        <div>Invoice: <strong style="color: #38bdf8;">${invoiceNumber}</strong></div>
                        <div style="margin-top: 3px;">Date: <strong>${formattedInvoiceDate}</strong></div>
                        <div style="margin-top: 3px;">Booking: <strong style="color: #ffffff;">#${bookingNumber}</strong></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Passenger & Trip Itinerary Box -->
              <tr>
                <td style="padding: 24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 14px; padding: 18px; margin-bottom: 20px;">
                    <tr>
                      <td width="50%" style="vertical-align: top; padding-right: 12px;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">BILLED TO (PASSENGER / GUEST)</p>
                        <p style="margin: 0; font-size: 14px; font-weight: 800; color: #ffffff;">${customerName}</p>
                        ${customerPhone ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Phone: ${customerPhone}</p>` : ''}
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Email: ${email}</p>
                        <p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">Place of Supply: <strong>Odisha (21)</strong></p>
                      </td>
                      <td width="50%" style="vertical-align: top; padding-left: 12px; border-left: 1px solid #1e293b;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">ITINERARY & ALLOCATION</p>
                        <p style="margin: 0; font-size: 14px; font-weight: 800; color: #38bdf8;">${vehicleName}</p>
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #e2e8f0;">SAC Code: <strong>${sacCode}</strong></p>
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Schedule: <strong>${pickupDate} → ${returnDate}</strong> (${days} ${days === 1 ? 'Day' : 'Days'})</p>
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Pick-up: <strong>${pickup}</strong></p>
                        <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Drop-off: <strong>${dropoff}</strong></p>
                      </td>
                    </tr>
                  </table>

                  <!-- Tax Invoice Ledger Table -->
                  <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-size: 12px; color: #e2e8f0; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                    <tr style="background-color: #1e293b; color: #94a3b8; font-weight: 800; font-size: 10px; text-transform: uppercase;">
                      <th align="left" style="padding: 10px 12px;">Description</th>
                      <th align="center" style="padding: 10px;">SAC</th>
                      <th align="center" style="padding: 10px;">Qty</th>
                      <th align="right" style="padding: 10px 12px;">Taxable Amount</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="padding: 12px;">
                        <strong style="color: #ffffff;">${vehicleName}</strong><br/>
                        <span style="font-size: 11px; color: #64748b;">${isTour ? 'Tour Package Sightseeing & Transport' : `Rental Fare for ${days} Day(s)`}</span>
                      </td>
                      <td align="center" style="font-family: monospace; color: #94a3b8;">${sacCode}</td>
                      <td align="center" style="font-weight: 700;">${days}</td>
                      <td align="right" style="font-family: monospace; font-weight: 700; color: #ffffff;">₹${baseRate.toLocaleString('en-IN')}</td>
                    </tr>
                    ${deposit > 0 ? `
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="padding: 10px 12px;">Refundable Security Deposit</td>
                      <td align="center" style="color: #64748b;">—</td>
                      <td align="center">1</td>
                      <td align="right" style="font-family: monospace; color: #cbd5e1;">₹${deposit.toLocaleString('en-IN')}</td>
                    </tr>` : ''}
                  </table>

                  <!-- Financial Summary Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                    <tr>
                      <td width="55%" style="vertical-align: top; padding-right: 16px; font-size: 12px; color: #94a3b8;">
                        <p style="margin: 0 0 6px 0; font-weight: 700; color: #cbd5e1;">Payment Mode & Ledger</p>
                        <p style="margin: 0 0 4px 0;">Payment Mode: <strong style="color: #ffffff; text-transform: uppercase;">${booking.paymentMode || '100% Online'}</strong></p>
                        <p style="margin: 0 0 4px 0;">Payment Status: <strong style="color: #34d399;">${booking.paymentStatus || 'CONFIRMED'}</strong></p>
                        ${booking.transactionId ? `<p style="margin: 0 0 4px 0; font-family: monospace; font-size: 11px;">TXN: ${booking.transactionId}</p>` : ''}
                        <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">• GST Reverse Charge: NO • Computer-Generated Tax Invoice</p>
                      </td>
                      <td width="45%" style="vertical-align: top; font-family: monospace; font-size: 12px;">
                        <table width="100%" cellpadding="4" cellspacing="0">
                          <tr>
                            <td style="color: #94a3b8;">Taxable Subtotal:</td>
                            <td align="right" style="color: #e2e8f0; font-weight: 700;">₹${baseRate.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td style="color: #94a3b8;">CGST @ ${(gstRate / 2).toFixed(1)}%:</td>
                            <td align="right" style="color: #e2e8f0;">₹${cgst.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td style="color: #94a3b8;">SGST @ ${(gstRate / 2).toFixed(1)}%:</td>
                            <td align="right" style="color: #e2e8f0;">₹${sgst.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr style="border-top: 1px solid #334155;">
                            <td style="padding-top: 8px; color: #ffffff; font-weight: 900; font-size: 14px;">Grand Total:</td>
                            <td align="right" style="padding-top: 8px; color: #38bdf8; font-weight: 900; font-size: 15px;">₹${total.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td style="color: #34d399; font-weight: 700;">Advance Paid:</td>
                            <td align="right" style="color: #34d399; font-weight: 700;">₹${paid.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td style="color: #f59e0b; font-weight: 700;">Balance Due at Pickup:</td>
                            <td align="right" style="color: #f59e0b; font-weight: 700;">₹${balance.toLocaleString('en-IN')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- PDF Attachment Badge Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px dashed #38bdf8; border-radius: 12px; padding: 14px 18px; margin-top: 10px; margin-bottom: 20px;">
                    <tr>
                      <td width="36" style="vertical-align: middle; font-size: 22px;">📎</td>
                      <td style="vertical-align: middle; padding-left: 6px;">
                        <p style="margin: 0; color: #38bdf8; font-weight: 800; font-size: 13px;">Official GST Tax Invoice PDF Attached</p>
                        <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 11px;">
                          Your formal Tax Invoice (<code>Tax_Invoice_${invoiceNumber}.pdf</code>) is attached directly to this email. You can also view or print it anytime online using the button below.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Primary CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 4px; margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${voucherUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
                          View & Download Tax Invoice / Voucher
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6; text-align: center;">
                    Please carry a valid Govt. Photo ID (Aadhaar / Driving License / Passport) for verification during vehicle handover.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #020617; padding: 20px 28px; text-align: center; border-top: 1px solid #1e293b;">
                  <p style="margin: 0 0 6px 0; color: #64748b; font-size: 11px;">
                    CARZODRIVE Odisha Mobility Services • 24x7 Helpline: <strong>${COMPANY_INVOICE_META.supportPhone}</strong>
                  </p>
                  <p style="margin: 0; color: #475569; font-size: 10px;">
                    © ${new Date().getFullYear()} CARZODRIVE LUXURY MOBILITY & TOURS PVT LTD. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const client = getTransporter();
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Tax_Invoice_${invoiceNumber || bookingNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
    }

    const info = await client.sendMail({
      from,
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
      attachments,
    });
    logger.success(`✓ Customer Tax Invoice dispatched to: ${email} [Ref: #${bookingNumber}, Attached: ${attachments.length > 0 ? 'YES' : 'NO'}, MessageId: ${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Failed to send customer invoice email to ${email}:`, err.message);
    return { success: false, error: err.message };
  }
}

function resolveAdminAlertEmail(override = null) {
  if (override && override.includes('@') && !override.includes('@carzodrive.com')) return override;
  const configured = process.env.SUPER_ADMIN_EMAIL?.trim();
  if (configured && configured.includes('@') && !configured.includes('@carzodrive.com')) return configured;
  return process.env.SMTP_USER || 'jagankumarrath72@gmail.com';
}

/**
 * Send instant high-priority new booking alert to Admin with PDF Attachment
 */
async function sendBookingAlertToAdmin({ booking, adminEmail, pdfBuffer = null }) {
  const targetAdminEmail = resolveAdminAlertEmail(adminEmail);
  if (!targetAdminEmail || !targetAdminEmail.includes('@')) {
    return { success: false, reason: 'No admin email configured' };
  }

  // Generate official PDF Tax Invoice attachment if not pre-generated
  if (!pdfBuffer) {
    try {
      const { generateInvoicePdfBuffer } = require('./pdfInvoiceGenerator');
      pdfBuffer = await generateInvoicePdfBuffer(booking);
    } catch (e) {
      logger.warn('Could not generate PDF attachment for admin alert:', e?.message);
    }
  }

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || (user ? `CARZODRIVE Dispatch <${user}>` : 'CARZODRIVE Dispatch <no-reply@carzodrive.com>');
  const bookingNumber = booking.bookingNumber || booking._id;
  const invoiceNumber = booking.invoiceNumber || `INV-${String(bookingNumber).replace(/^CZ-/, '')}`;
  const total = Number(booking.totalAmount || booking.priceBreakdown?.totalAmount || 0);
  const paid = Number(booking.paidAmount || (booking.paymentStatus === 'PAID' ? total : 0));
  const balance = booking.balanceAmount !== undefined ? Number(booking.balanceAmount) : Math.max(0, total - paid);
  const customerName = booking.guestName || booking.customerId?.name || 'Guest User';
  const customerPhone = booking.guestPhone || booking.customerId?.phone || 'Not provided';
  const customerEmail = booking.guestEmail || booking.customerId?.email || 'Not provided';

  const isTour =
    booking.serviceType?.toLowerCase().includes('tour') ||
    booking.serviceType?.toLowerCase().includes('package') ||
    Boolean(booking.packageId);

  const vehicleName =
    booking.vehicleName ||
    booking.vehicleId?.name ||
    booking.bikeId?.name ||
    booking.packageId?.name ||
    booking.packageId?.title ||
    (isTour ? 'Odisha Tour Package' : 'Mobility Service');

  const formatLoc = (loc, fallback) => {
    if (!loc) return fallback;
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') return loc.address || loc.name || loc.city || fallback;
    return String(loc);
  };

  const pickup = formatLoc(booking.pickupLocation, 'Bhubaneswar Hub');
  const dropoff = formatLoc(booking.dropoffLocation, 'Same as Pickup');
  const pickupDate = booking.pickupDate || (booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : 'Scheduled');
  const returnDate = booking.returnDate || (booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : 'Scheduled');

  const subject = `🚨 [NEW BOOKING] #${bookingNumber} — ${customerName} (₹${total.toLocaleString('en-IN')})`;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const adminUrl = `${frontendUrl}/admin/bookings`;

  const textContent = `NEW BOOKING ALERT — CARZODRIVE ADMIN\n\n` +
    `Booking Ref: #${bookingNumber}\n` +
    `Invoice: ${invoiceNumber}\n` +
    `Service/Fleet: ${vehicleName}\n` +
    `Trip Status: ${booking.status || 'CONFIRMED'}\n` +
    `Payment Status: ${booking.paymentStatus || 'CONFIRMED'}\n` +
    `Payment Mode: ${booking.paymentMode || 'full'}\n\n` +
    `CUSTOMER DETAILS:\n` +
    `• Name: ${customerName}\n` +
    `• Phone: ${customerPhone}\n` +
    `• Email: ${customerEmail}\n` +
    `• Notes: ${booking.guestNotes || 'None'}\n\n` +
    `SCHEDULE:\n` +
    `• Pick-up: ${pickupDate} at ${pickup}\n` +
    `• Return: ${returnDate} at ${dropoff}\n\n` +
    `FINANCIALS:\n` +
    `• Total Fare: ₹${total.toLocaleString('en-IN')}\n` +
    `• Paid Online: ₹${paid.toLocaleString('en-IN')}\n` +
    `• Balance on Pickup: ₹${balance.toLocaleString('en-IN')}\n` +
    `• Transaction ID: ${booking.transactionId || 'OFFLINE'}\n\n` +
    `📎 ATTACHMENT: Official Tax Invoice PDF (Booking_${bookingNumber}_Invoice_${invoiceNumber}.pdf) is attached.\n\n` +
    `Open Admin Dashboard: ${adminUrl}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030712; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #0f172a; border: 2px solid #ef4444; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              
              <!-- Red Alert Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #b91c1c, #dc2626); padding: 24px 28px; text-align: left;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-weight: 900; font-size: 10px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          ADMIN DISPATCH ALERT
                        </span>
                        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900;">New Reservation Received!</h1>
                        <p style="margin: 4px 0 0 0; color: #fecaca; font-size: 13px;">
                          Booking <strong>#${bookingNumber}</strong> • Invoice: <strong>${invoiceNumber}</strong>
                        </p>
                      </td>
                      <td align="right" style="vertical-align: top;">
                        <span style="font-size: 24px; font-weight: 900; color: #ffffff; font-family: monospace;">
                          ₹${total.toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Badges Bar -->
              <tr>
                <td style="background-color: #1e293b; padding: 12px 28px; border-bottom: 1px solid #334155;">
                  <span style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 6px; margin-right: 6px; text-transform: uppercase;">
                    ${booking.serviceType || 'CAR RENTAL'}
                  </span>
                  <span style="display: inline-block; background-color: ${booking.paymentStatus === 'PAID' ? '#10b981' : booking.paymentStatus === 'PARTIALLY_PAID' ? '#f59e0b' : '#64748b'}; color: #ffffff; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 6px; margin-right: 6px; text-transform: uppercase;">
                    ${booking.paymentStatus || 'PENDING'}
                  </span>
                  <span style="display: inline-block; background-color: #334155; color: #cbd5e1; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 6px; text-transform: uppercase;">
                    Mode: ${booking.paymentMode || 'Online'}
                  </span>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 24px 28px;">

                  <!-- PDF Attachment Callout -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px dashed #ef4444; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px;">
                    <tr>
                      <td width="30" style="vertical-align: middle; font-size: 18px;">📎</td>
                      <td style="vertical-align: middle; padding-left: 6px;">
                        <p style="margin: 0; color: #f87171; font-weight: 800; font-size: 12px;">Official PDF Tax Invoice Attached</p>
                        <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 11px;">
                          Attached: <code>Booking_${bookingNumber}_Invoice_${invoiceNumber}.pdf</code> (Accounts / Customer verification copy).
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Customer Information -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 1px;">CUSTOMER INFORMATION</p>
                        <p style="margin: 0; font-size: 15px; font-weight: 800; color: #ffffff;">${customerName}</p>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">
                          📞 Phone: <a href="tel:${customerPhone}" style="color: #38bdf8; text-decoration: none; font-weight: 700;">${customerPhone}</a>
                          ${customerPhone ? ` • <a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}" style="color: #34d399; text-decoration: none; font-weight: 700;">WhatsApp Chat</a>` : ''}
                        </p>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">
                          ✉️ Email: <a href="mailto:${customerEmail}" style="color: #94a3b8; text-decoration: none;">${customerEmail}</a>
                        </p>
                        ${booking.guestNotes ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #fbbf24; background-color: #1e293b; padding: 8px; border-radius: 6px;">Notes: ${booking.guestNotes}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <!-- Fleet & Trip Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">ALLOCATED FLEET & SCHEDULE</p>
                        <p style="margin: 0; font-size: 15px; font-weight: 800; color: #ffffff;">${vehicleName}</p>
                        <table width="100%" cellpadding="4" cellspacing="0" style="margin-top: 8px; font-size: 12px; color: #cbd5e1;">
                          <tr>
                            <td width="30%" style="color: #64748b;">Schedule:</td>
                            <td width="70%"><strong>${pickupDate} → ${returnDate}</strong></td>
                          </tr>
                          <tr>
                            <td style="color: #64748b;">Pick-up Hub:</td>
                            <td><strong>${pickup}</strong></td>
                          </tr>
                          <tr>
                            <td style="color: #64748b;">Drop-off Hub:</td>
                            <td><strong>${dropoff}</strong></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Financial Ledger -->
                  <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; font-size: 12px; font-family: monospace; color: #e2e8f0; margin-bottom: 24px;">
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #94a3b8;">Total Booking Value:</td>
                      <td align="right" style="color: #ffffff; font-weight: 800; font-size: 13px;">₹${total.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #34d399;">Advance Paid Online:</td>
                      <td align="right" style="color: #34d399; font-weight: 800;">₹${paid.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                      <td style="color: #f59e0b;">Balance to Collect at Pickup:</td>
                      <td align="right" style="color: #f59e0b; font-weight: 800; font-size: 13px;">₹${balance.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="color: #64748b;">Transaction Ref:</td>
                      <td align="right" style="color: #94a3b8;">${booking.transactionId || 'OFFLINE'}</td>
                    </tr>
                  </table>

                  <!-- Button to Admin Console -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${adminUrl}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
                          Open Admin Bookings Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #020617; padding: 16px 28px; text-align: center; border-top: 1px solid #1e293b;">
                  <p style="margin: 0; color: #64748b; font-size: 11px;">
                    CARZODRIVE Dispatch Control System • Automated Notification for Super Admin
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const client = getTransporter();
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Booking_${bookingNumber}_Invoice_${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
    }

    const info = await client.sendMail({
      from,
      to: targetAdminEmail,
      subject,
      text: textContent,
      html: htmlContent,
      attachments,
    });
    logger.success(`✓ Admin New Booking Alert dispatched to: ${targetAdminEmail} [Ref: #${bookingNumber}, Attached: ${attachments.length > 0 ? 'YES' : 'NO'}, MessageId: ${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Failed to send Admin booking alert to ${targetAdminEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Unified dispatch: sends Tax Invoice email to Customer AND Alert to Admin with PDF attachments
 */
async function dispatchBookingEmails(booking, overrideCustomerEmail = null) {
  if (!booking) return;

  let targetCustomerEmail = overrideCustomerEmail || booking.guestEmail || booking.customerId?.email || booking.email;
  let customerName = booking.guestName || booking.customerId?.name || 'Valued Guest';

  // If customerId is an ID without populated email, attempt lookup
  if (!targetCustomerEmail && booking.customerId) {
    try {
      const { User } = require('../models/user.model');
      const u = await User.findById(booking.customerId).select('name email phone');
      if (u) {
        targetCustomerEmail = u.email;
        if (!booking.guestName && u.name) customerName = u.name;
      }
    } catch (_) {}
  }

  // Pre-generate official PDF Tax Invoice attachment buffer (shared between customer & admin)
  let pdfBuffer = null;
  try {
    const { generateInvoicePdfBuffer } = require('./pdfInvoiceGenerator');
    pdfBuffer = await generateInvoicePdfBuffer(booking);
  } catch (pdfErr) {
    logger.warn('Could not pre-generate PDF invoice attachment:', pdfErr.message);
  }

  const promises = [];

  // 1. Send Tax Invoice to Customer (with PDF attachment)
  if (targetCustomerEmail && targetCustomerEmail.includes('@') && !targetCustomerEmail.includes('@offline.carzodrive.com')) {
    promises.push(
      sendBookingInvoiceToCustomer({
        email: targetCustomerEmail,
        name: customerName,
        booking,
        pdfBuffer,
      }).catch((e) => {
        logger.error(`Error in sendBookingInvoiceToCustomer: ${e?.message}`);
        return { success: false, error: e?.message };
      })
    );
  }

  // 2. Always send Alert to Admin (with PDF attachment)
  const adminEmail = resolveAdminAlertEmail();
  promises.push(
    sendBookingAlertToAdmin({
      booking,
      adminEmail,
      pdfBuffer,
    }).catch((e) => {
      logger.error(`Error in sendBookingAlertToAdmin: ${e?.message}`);
      return { success: false, error: e?.message };
    })
  );

  return Promise.allSettled(promises);
}

module.exports = {
  sendPasswordResetOtp,
  sendBookingConfirmationEmail: sendBookingInvoiceToCustomer,
  sendBookingInvoiceToCustomer,
  sendBookingAlertToAdmin,
  dispatchBookingEmails,
  verifyMailer,
  getTransporter,
};
