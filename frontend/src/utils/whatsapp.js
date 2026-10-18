/**
 * WhatsApp Helper Utilities for CARZODRIVE
 * Generates direct chat links with contextual pre-filled messages
 */

import { CARZODRIVE_WHATSAPP_NUMBER } from '../config/contact';

export { CARZODRIVE_WHATSAPP_NUMBER };

/**
 * Build direct WhatsApp Web / App URL
 */
export const buildWhatsAppUrl = (message = '', phone = CARZODRIVE_WHATSAPP_NUMBER) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
};

/**
 * Open WhatsApp chat in a new browser tab
 */
export const openWhatsAppChat = (message = '', phone = CARZODRIVE_WHATSAPP_NUMBER) => {
  const url = buildWhatsAppUrl(message, phone);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
};

/**
 * Formatted message for Vehicle Inquiry (Car or Bike)
 */
export const getVehicleWhatsAppMessage = (vehicle = {}) => {
  const name = vehicle.name || 'Vehicle';
  const price = vehicle.priceDisplay || (vehicle.pricePerDay ? (typeof vehicle.pricePerDay === 'string' ? vehicle.pricePerDay : `₹${vehicle.pricePerDay}`) : 'Standard Rates');
  const type = vehicle.type || vehicle.category || 'Rental';
  const isAvailable = vehicle.isAvailable !== false && vehicle.availableCount !== 0;
  const color = vehicle.color || 'Standard';

  if (!isAvailable) {
    return `Hello CARZODRIVE! 👋

I saw *${name}* (${type}) on your website marked as *Currently Not Available*.
Could you please notify me when it becomes available, or let me know upcoming dates? Thank you!`;
  }

  return `Hello CARZODRIVE! 👋

I would like to book:
🚗 *${name}* (${type})
🎨 Color: *${color}*
💰 Rate: *${price}/day*

Please confirm availability and handover details. Thank you!`;
};

/**
 * Formatted message for Tour Package Inquiry
 */
export const getTourWhatsAppMessage = (tour = {}) => {
  const title = tour.title || 'Tour Package';
  const destination = tour.destination || '';
  const duration = tour.duration || '';
  const price = tour.startingPrice || (tour.price ? `₹${tour.price}` : '');

  return `Hello CARZODRIVE! 🌴

I am interested in your curated tour package:
📍 *${title}*
🗺️ Destination: ${destination}
⏱️ Duration: ${duration}
💵 Starting Price: ${price}

Please share complete itinerary and customized booking options. Thank you!`;
};

/**
 * Formatted message from inside QuickBookingModal
 */
export const getQuickBookingWhatsAppMessage = ({
  serviceName = '',
  vehicleName = 'Selected Vehicle',
  userCarModel = '',
  pickupDate = '',
  returnDate = '',
  days = '',
  location = '',
  dropLocation = '',
  protection = '',
  deposit = '',
  total = '',
  paymentMode = '',
  paidNow = '',
  balanceOnPickup = '',
  bookingCode = '',
  guestName = '',
  guestPhone = '',
  guestEmail = '',
  notes = '',
} = {}) => {
  let msg = `Hello CARZODRIVE! 🏎️\n\nI want to book my ride with the following details:\n\n`;
  if (serviceName) {
    msg += `📋 *Service Category:* ${serviceName}\n`;
  }
  if (vehicleName) {
    msg += `🚗 *Selected Vehicle / Option:* ${vehicleName}\n`;
  }
  if (userCarModel) {
    msg += `🚘 *Customer's Vehicle Model:* ${userCarModel}\n`;
  }
  if (pickupDate && returnDate) {
    msg += `📅 *Trip Dates:* ${pickupDate} to ${returnDate}${days ? ` (${days} ${days === 1 ? 'Day' : 'Days'})` : ''}\n`;
  }
  if (location) {
    msg += `📍 *Pick-up Location:* ${location}\n`;
  }
  if (dropLocation) {
    msg += `🔄 *Drop-off Location:* ${dropLocation}\n`;
  }
  if (protection) {
    msg += `🛡️ *Protection Plan:* ${protection}\n`;
  }
  if (deposit) {
    msg += `💳 *Security Deposit:* ${deposit}\n`;
  }
  if (total) {
    msg += `💰 *Estimated Total:* ${total}\n`;
  }
  if (paymentMode) {
    msg += `💳 *Payment Option:* ${paymentMode}\n`;
  }
  if (paidNow) {
    msg += `💵 *Advance Paid Online:* ${paidNow}\n`;
  }
  if (balanceOnPickup) {
    msg += `⏳ *Balance Due at Pickup:* ${balanceOnPickup}\n`;
  }
  if (guestName) {
    msg += `\n👤 *Customer Name:* ${guestName}\n`;
  }
  if (guestPhone) {
    msg += `📞 *Phone / WhatsApp:* ${guestPhone}\n`;
  }
  if (guestEmail) {
    msg += `✉️ *Email:* ${guestEmail}\n`;
  }
  if (notes) {
    msg += `📝 *Landmark / Notes:* ${notes}\n`;
  }
  if (bookingCode) {
    msg += `🔖 *Booking Reference:* ${bookingCode}\n`;
  }
  msg += `\nPlease confirm availability and guide me through the key handover! Thank you.`;
  return msg;
};

