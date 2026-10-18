require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (user && pass) {
    if (host.includes('gmail') || process.env.SMTP_SERVICE === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
      logger.success(`✓ Nodemailer configured with Gmail SMTP [User: ${user}]`);
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });
      logger.success(`✓ Nodemailer configured with SMTP [${host}:${port}]`);
    }
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
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return { configured: false, message: 'SMTP credentials pending in .env' };
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
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || (user ? `CARZODRIVE Concierge <${user}>` : 'CARZODRIVE Concierge <no-reply@carzodrive.com>');
  const subject = `${otp} is your CARZODRIVE Password Reset Verification Code`;

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
      </div>
      <div style="background-color: #020617; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b;">
        <p style="margin: 0; color: #64748b; font-size: 11px;">
          © ${new Date().getFullYear()} CARZODRIVE. Bhubaneswar, Odisha. All rights reserved.
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
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId, otp };
  } catch (err) {
    logger.error('Email sending error (falling back to logged OTP):', err.message);
    return { success: false, error: err.message, otp };
  }
}

/**
 * Send official booking confirmation email with voucher details
 */
async function sendBookingConfirmationEmail({ email, name = 'Valued Guest', booking }) {
  if (!email || !email.includes('@')) return { success: false, reason: 'No valid email' };

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || (user ? `CARZODRIVE Concierge <${user}>` : 'CARZODRIVE Concierge <no-reply@carzodrive.com>');
  const bookingNumber = booking.bookingNumber || booking._id;
  const subject = `Booking Confirmed: #${bookingNumber} — CARZODRIVE Luxury Mobility`;

  const vehicleName = booking.vehicleName || booking.vehicleId?.name || booking.bikeId?.name || booking.packageId?.name || 'CARZODRIVE Premium Fleet';
  const total = Number(booking.totalAmount || 0).toLocaleString('en-IN');
  const paid = Number(booking.paidAmount || 0).toLocaleString('en-IN');
  const balance = Number(booking.balanceAmount || 0).toLocaleString('en-IN');
  const pickup = booking.pickupLocation || 'Bhubaneswar Hub';
  const pickupDate = booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : 'Scheduled';
  const returnDate = booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : 'Scheduled';

  const textContent = `Hello ${name},\n\nYour CARZODRIVE booking #${bookingNumber} is confirmed!\n\nFleet: ${vehicleName}\nPick-up: ${pickupDate} at ${pickup}\nReturn: ${returnDate}\nTotal Amount: ₹${total}\nPaid: ₹${paid}\nBalance at Handover: ₹${balance}\nPayment Mode: ${booking.paymentMode || 'Confirmed'}\n\nThank you for choosing CARZODRIVE Odisha Mobility.`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 30px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 1.5px;">CARZODRIVE</h1>
        <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 13px;">Official Reservation Voucher</p>
      </div>
      <div style="padding: 32px 28px;">
        <h2 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 20px; font-weight: 700;">Reservation Confirmed!</h2>
        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Dear <strong style="color: #f1f5f9;">${name}</strong>,<br/>
          Your priority mobility allocation has been locked and verified in our central dispatch system.
        </p>

        <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Booking Reference:</td>
              <td style="padding: 8px 0; font-weight: 800; font-family: monospace; color: #38bdf8; text-align: right;">${bookingNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Allocated Unit:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #ffffff; text-align: right;">${vehicleName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Pick-up Location:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${pickup}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Rental Duration:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${pickupDate} → ${returnDate}</td>
            </tr>
            <tr style="border-top: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Total Booking Value:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #ffffff; text-align: right;">₹${total}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Paid Online:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #34d399; text-align: right;">₹${paid}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Balance at Handover:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #f59e0b; text-align: right;">₹${balance}</td>
            </tr>
          </table>
        </div>

        <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
          Our concierge representative will contact you prior to your scheduled pickup time. For immediate assistance, connect with us on WhatsApp.
        </p>
      </div>
      <div style="background-color: #020617; padding: 18px 24px; text-align: center; border-top: 1px solid #1e293b;">
        <p style="margin: 0; color: #64748b; font-size: 11px;">
          CARZODRIVE Odisha Mobility Services • SUM Hospital Road, Bhubaneswar • 24/7 Helpline: +91 93489 31317
        </p>
      </div>
    </div>
  `;

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from,
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
    });
    logger.success(`✓ Booking confirmation email dispatched to ${email} [MessageID: ${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error('Booking confirmation email error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendPasswordResetOtp,
  sendBookingConfirmationEmail,
  verifyMailer,
  getTransporter,
};
