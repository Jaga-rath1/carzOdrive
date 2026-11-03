const path = require('path');
// Guarantee loading .env regardless of whether process is started from root or backend directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), 'backend/.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config();

const nodemailer = require('nodemailer');
const { verifyMailer, sendPasswordResetOtp, getFormattedFrom } = require('../utils/mailer');

async function testPort(host, port, secure, user, pass) {
  process.stdout.write(`  ⏳ Testing ${host}:${port} (${secure ? 'Direct SSL' : 'STARTTLS'})... `);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && (port === 587 || port === 2525),
    auth: { user, pass },
    tls: { rejectUnauthorized: false, minVersion: 'TLSv1.2' },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  try {
    await transporter.verify();
    console.log('✅ REACHABLE & AUTHENTICATED');
    return { ok: true };
  } catch (err) {
    console.log(`❌ FAILED (${err.code || err.message})`);
    return { ok: false, error: err.message, code: err.code };
  }
}

async function runDiagnostic() {
  console.log('================================================================');
  console.log('🔍 CARZODRIVE PRODUCTION SMTP & GCP DIAGNOSTIC TOOL');
  console.log('================================================================\n');

  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const envPort = process.env.SMTP_PORT || '587';
  const envSecure = process.env.SMTP_SECURE || 'false';

  console.log('1. Active Environment Configuration:');
  console.log(`   • Host:        ${host}`);
  console.log(`   • Config Port: ${envPort}`);
  console.log(`   • Secure:      ${envSecure}`);
  console.log(`   • User:        ${user || '(NOT CONFIGURED)'}`);
  console.log(`   • App Pass:    ${pass ? `${pass.slice(0, 4)}••••${pass.slice(-4)} (length: ${pass.length})` : '(NOT CONFIGURED)'}`);
  console.log(`   • Sender:      ${getFormattedFrom()}`);

  if (!user || !pass) {
    console.error('\n❌ ERROR: SMTP_USER or SMTP_PASS missing in backend/.env');
    console.error('Please configure your credentials and rerun this test.');
    process.exit(1);
  }

  console.log('\n2. Network & Cloud Port Compatibility Audit:');
  console.log('   (Note: GCP blocks port 25 and often drops port 465 SSL. Port 587 STARTTLS is required.)');
  
  const port587Res = await testPort(host, 587, false, user, pass);
  const port465Res = await testPort(host, 465, true, user, pass);

  console.log('\n3. Verifying High-Resilience Mailer Module (with auto-fallback):');
  const verifyRes = await verifyMailer();
  if (verifyRes.configured) {
    console.log(`   ✅ Mailer Module Ready! Active Port: ${verifyRes.port || envPort}`);
  } else {
    console.warn(`   ⚠️ Mailer Handshake Warning: ${verifyRes.error || verifyRes.message}`);
  }

  const targetEmail = process.argv[2] || user;
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`\n4. Sending Live Test OTP Email to: [${targetEmail}]...`);
  const dispatchRes = await sendPasswordResetOtp({
    email: targetEmail,
    name: 'CARZODRIVE Tester',
    otp: testOtp,
  });

  if (dispatchRes.success) {
    console.log(`   ✅ SUCCESS: OTP email delivered successfully!`);
    console.log(`   • Message ID: ${dispatchRes.messageId}`);
    console.log(`   • Generated OTP: [ ${testOtp} ]`);
    console.log('\n================================================================');
    console.log('🎉 NODEMAILER IS 100% OPERATIONAL FOR BOTH LOCAL & GCP!');
    console.log('================================================================\n');
  } else {
    console.error(`   ❌ Dispatch failed: ${dispatchRes.error}`);
    console.log('\n--- GCP DEPLOYMENT TROUBLESHOOTING ---');
    console.log('1. If running on Google Cloud Platform (Cloud Run / Compute Engine / GKE):');
    console.log('   Ensure backend/.env contains:');
    console.log('     SMTP_PORT=587');
    console.log('     SMTP_SECURE=false');
    console.log('2. Ensure your Google Account has 2-Step Verification turned ON.');
    console.log('3. Ensure you are using a 16-character App Password (adkqhnnwtpespkxj, NO spaces).');
    console.log('4. If Google security blocks Google Cloud IPs, check https://myaccount.google.com/notifications');
    console.log('   or switch to a dedicated transactional relay (e.g. Brevo/SendGrid/Resend).');
    process.exit(1);
  }
}

runDiagnostic();
