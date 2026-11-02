const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), 'backend/.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const { env } = require('../config/env');
const { Booking } = require('../models/booking.model');
const { dispatchBookingEmails, resolveCustomerContact, verifyMailer } = require('../utils/mailer');

async function run() {
  console.log('--- Checking Mailer Connection ---');
  const mailerStatus = await verifyMailer();
  console.log('Mailer status:', mailerStatus);

  console.log('\n--- Connecting to DB ---');
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to DB');

  const recentBooking = await Booking.findOne().sort({ createdAt: -1 })
    .populate('customerId', 'name email phone')
    .populate('vehicleId')
    .populate('bikeId')
    .populate('driverId')
    .populate('packageId')
    .populate('paymentId');

  if (!recentBooking) {
    console.log('No bookings found in DB');
    process.exit(0);
  }

  console.log('\n--- Recent Booking Info ---');
  console.log('ID:', recentBooking._id);
  console.log('BookingNumber:', recentBooking.bookingNumber);
  console.log('guestEmail:', recentBooking.guestEmail);
  console.log('guestPhone:', recentBooking.guestPhone);
  console.log('customerId:', recentBooking.customerId);

  console.log('\n--- Resolving Customer Contact ---');
  const contact = await resolveCustomerContact(recentBooking);
  console.log('Resolved contact:', contact);

  console.log('\n--- Calling dispatchBookingEmails ---');
  const results = await dispatchBookingEmails(recentBooking);
  console.log('Dispatch results:', JSON.stringify(results, null, 2));

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});

