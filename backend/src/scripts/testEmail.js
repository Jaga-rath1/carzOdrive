require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('--------------------------------------------------');
  console.log('🔍 CARZODRIVE Nodemailer Diagnostic Tool');
  console.log('--------------------------------------------------');

  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? '465' : '587'), 10);
  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : port === 465;

  console.log(`• Host:   ${host}`);
  console.log(`• Port:   ${port}`);
  console.log(`• Secure: ${secure}`);
  console.log(`• User:   ${user || '(EMPTY)'}`);
  console.log(`• Pass:   ${pass ? `${pass.slice(0, 4)}••••${pass.slice(-4)} (length: ${pass.length})` : '(EMPTY)'}`);

  if (!user || !pass) {
    console.error('\n❌ ERROR: SMTP_USER or SMTP_PASS missing in backend/.env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  console.log('\n⏳ 1. Verifying SMTP Connection Handshake...');
  try {
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully!');
  } catch (err) {
    console.error('❌ SMTP Connection Handshake failed:');
    console.error(err);
    process.exit(1);
  }

  const targetEmail = process.argv[2] || user;
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`\n⏳ 2. Sending test OTP email to: ${targetEmail}...`);
  try {
    const info = await transporter.sendMail({
      from: `"CARZODRIVE Concierge" <${user}>`,
      replyTo: user,
      to: targetEmail,
      subject: `CARZODRIVE Verification Code: ${testOtp}`,
      text: `Hello,\n\nYour test CARZODRIVE verification OTP is: ${testOtp}\n\nValid for 15 minutes.\n\nWarm regards,\nCARZODRIVE Odisha Mobility Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #1e293b;">
          <h2 style="color: #38bdf8; margin: 0 0 12px 0;">CARZODRIVE Security Verification</h2>
          <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 20px;">Use this 6-digit verification code to complete your security check:</p>
          <div style="background-color: #020617; border: 2px dashed #38bdf8; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; font-family: monospace;">${testOtp}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">This code is valid for 15 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log(`• MessageId: ${info.messageId}`);
    console.log(`• Sent OTP:  ${testOtp}`);
    console.log('\n🎉 Nodemailer is 100% operational!');
  } catch (err) {
    console.error('❌ Email sending failed:');
    console.error(err);
    process.exit(1);
  }
}

testEmail();
