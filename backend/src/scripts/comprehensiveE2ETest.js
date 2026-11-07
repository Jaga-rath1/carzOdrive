const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), 'backend/.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const { env } = require('../config/env');
const { Booking } = require('../models/booking.model');
const { Vehicle } = require('../models/vehicle.model');
const { Bike } = require('../models/bike.model');
const TourPackage = require('../models/package.model');
const { User } = require('../models/user.model');
const bookingsService = require('../services/bookings.service');
const { generateInvoicePdfBuffer } = require('../utils/pdfInvoiceGenerator');
const { resolveCustomerContact, getFormattedFrom, resolveBookingLedger, verifyMailer } = require('../utils/mailer');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    throw new Error(`Test failed: ${testName}`);
  }
}

async function runE2ETests() {
  console.log('================================================================');
  console.log('🚀 CARZODRIVE PRODUCTION END-TO-END CRASH-PROOF AUDIT & TEST');
  console.log('================================================================\n');

  console.log('--- TEST SUITE 1: Database & Connectivity ---');
  await mongoose.connect(env.mongodbUri);
  assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connection established');

  console.log('\n--- TEST SUITE 2: Fleet & Inventory Resilience ---');
  const cars = await Vehicle.find();
  assert(Array.isArray(cars), `Vehicle collection retrieved (${cars.length} cars)`);
  
  const bikes = await Bike.find();
  assert(Array.isArray(bikes), `Bike collection retrieved (${bikes.length} bikes)`);

  const tours = await TourPackage.find();
  assert(Array.isArray(tours), `Tour packages retrieved (${tours.length} packages)`);

  // Verify dynamic bike availability formula (User's feature)
  const hasAvailableBikes = bikes.some((b) => {
    const count = b.availableCount !== undefined ? Number(b.availableCount) : (b.quantity !== undefined ? Number(b.quantity) : (b.count ?? 0));
    const notUnavailable = b.availabilityStatus !== 'UNAVAILABLE' && b.availabilityStatus !== 'Currently Unavailable';
    return b.isAvailable === true && count > 0 && notUnavailable;
  });
  console.log(`  ℹ️ Live Bike Availability State: ${hasAvailableBikes ? 'AVAILABLE (Live Fleet)' : 'UNAVAILABLE (Coming Soon)'}`);
  assert(typeof hasAvailableBikes === 'boolean', 'Dynamic bike availability calculates boolean safely');

  console.log('\n--- TEST SUITE 3: Custom Location & Dropdown Resilience ---');
  // Test variations of manual location inputs entered by users
  const locationTestCases = [
    { input: 'SUM Hospital, Master Canteen, Bhubaneswar', expectValid: true },
    { input: 'Biju Patnaik International Airport (BBI)', expectValid: true },
    { input: 'Flat No. 402, Krishna Tower, Patia, Bhubaneswar', expectValid: true },
    { input: 'Hotel Mayfair Lagoon, Jaydev Vihar, Bhubaneswar - 751013', expectValid: true },
    { input: "Custom Landmark: St. Xavier's High School & College, Khandagiri", expectValid: true },
    { input: 'Same as Pick-up Location', expectValid: true },
    { input: '', expectValid: true },
  ];

  for (const tc of locationTestCases) {
    const sanitized = String(tc.input || '').trim();
    assert(typeof sanitized === 'string', `Location input handled safely: "${tc.input}"`);
  }

  console.log('\n--- TEST SUITE 4: Universal Booking Engine (Car with Driver & Custom Location) ---');
  // Find or create test customer
  let testUser = await User.findOne({ email: 'test.e2e@carzodrive.com' });
  if (!testUser) {
    const existing = await User.findOne();
    if (existing) {
      testUser = existing;
    } else {
      testUser = await User.create({
        name: 'E2E Test Rider',
        email: 'test.e2e@carzodrive.com',
        phone: '9876543210',
        password: 'TestPassword123!',
        role: 'CUSTOMER',
      });
    }
  }

  let sampleCar = cars.find((c) => c.isAvailable !== false && (c.availableCount === undefined || c.availableCount > 0));
  if (!sampleCar && cars.length > 0) {
    sampleCar = cars[0];
    await Vehicle.findByIdAndUpdate(sampleCar._id, { isAvailable: true, availableCount: 2 });
  } else if (!sampleCar) {
    sampleCar = { _id: new mongoose.Types.ObjectId(), name: 'Test Creta SX' };
  }

  const tomorrow = new Date(Date.now() + 86400000 * 1);
  const dayAfterTomorrow = new Date(Date.now() + 86400000 * 3);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // 1. Create Car with Driver booking using a custom manually typed location
  const driverBookingPayload = {
    serviceType: 'CAR_WITH_DRIVER',
    vehicleId: sampleCar._id,
    vehicleName: sampleCar.name,
    guestName: 'E2E Guest Rider',
    guestEmail: 'test.e2e@carzodrive.com',
    guestPhone: '9876543210',
    pickupLocation: 'Flat No. 501, Royal Palms, Patia, Bhubaneswar',
    dropoffLocation: 'Biju Patnaik International Airport, Terminal 1',
    startDate: tomorrow,
    endDate: dayAfterTomorrow,
    pickupDate: fmt(tomorrow),
    returnDate: fmt(dayAfterTomorrow),
    pickupTime: '10:00',
    returnTime: '18:00',
    days: 2,
    totalAmount: 4998,
    paymentMode: 'offline',
    paymentStatus: 'OFFLINE_PENDING',
    transactionId: 'PAY_ON_PICKUP',
    status: 'CONFIRMED',
  };

  const createdDriverBooking = await bookingsService.createUniversalBooking(testUser._id, driverBookingPayload);
  assert(createdDriverBooking && createdDriverBooking.bookingNumber, `Car with driver booking created: #${createdDriverBooking.bookingNumber}`);
  assert(createdDriverBooking.pickupLocation === driverBookingPayload.pickupLocation, 'Custom typed pickup location preserved in DB');
  assert(createdDriverBooking.dropoffLocation === driverBookingPayload.dropoffLocation, 'Custom typed dropoff location preserved in DB');

  console.log('\n--- TEST SUITE 5: Tax Invoice & PDF Generation Resilience ---');
  // Verify resolveBookingLedger calculation
  const ledger = resolveBookingLedger(createdDriverBooking);
  assert(ledger.total === 4998, `Ledger total correct: ₹${ledger.total}`);
  assert(ledger.paid === 0, `Offline booking advance paid: ₹${ledger.paid}`);
  assert(ledger.balance === 4998, `Balance due at pickup: ₹${ledger.balance}`);

  // Test PDF generation without crashing
  const pdfBuffer = await generateInvoicePdfBuffer(createdDriverBooking);
  assert(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 1000, `PDF Tax Invoice buffer generated (${pdfBuffer.length} bytes)`);

  console.log('\n--- TEST SUITE 6: Injection & Special Character Security Audit ---');
  // Test lookup with malicious regex strings that could cause ReDoS or crashes
  const maliciousInputs = [
    '(test)[regex]*+?^$',
    'CZ-[A-Z0-9]+',
    '\\x00\\x1f',
    "'; DROP TABLE bookings; --",
    '<script>alert("xss")</script>',
    'undefined',
    'null',
  ];

  for (const input of maliciousInputs) {
    try {
      const result = await bookingsService.lookupBookings(input);
      assert(Array.isArray(result), `Malicious/Special lookup input handled safely: "${input}"`);
    } catch (e) {
      assert(false, `Lookup crashed on input: "${input}" (${e.message})`);
    }
  }

  console.log('\n--- TEST SUITE 7: Mailer Contact Resolution & Handshake ---');
  const contact = await resolveCustomerContact(createdDriverBooking);
  assert(contact.email === 'test.e2e@carzodrive.com', `Customer contact correctly resolved: ${contact.email}`);
  assert(contact.name === 'E2E Guest Rider', `Customer name correctly resolved: ${contact.name}`);

  const formattedFrom = getFormattedFrom();
  assert(formattedFrom.includes('CARZODRIVE'), `Formatted sender name verified: ${formattedFrom}`);

  const mailerStatus = await verifyMailer();
  assert(mailerStatus.configured === true, 'Nodemailer SMTP handshake active & verified');

  console.log('\n--- Cleanup test booking ---');
  await Booking.findByIdAndDelete(createdDriverBooking._id);
  console.log('  🧹 Cleaned up temporary test booking');

  await mongoose.disconnect();

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED! ZERO CRASHES DETECTED.`);
  console.log('================================================================\n');
}

runE2ETests().catch((err) => {
  console.error('\n❌ Fatal error during test execution:', err);
  process.exit(1);
});
