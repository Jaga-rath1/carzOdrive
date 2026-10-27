/**
 * Global Contact & Communication Configuration
 * Single source of truth for all phone numbers, WhatsApp, and emails across the app.
 * Reads directly from Vite environment variables (.env) with safe fallbacks.
 */

const rawPhone = import.meta.env?.VITE_CONTACT_PHONE || '7377733391';
const rawWhatsapp = import.meta.env?.VITE_WHATSAPP_NUMBER || '917377733391';
const rawEmail = import.meta.env?.VITE_CONTACT_EMAIL || 'support@carzodrive.com';
const rawGmail = import.meta.env?.VITE_CONTACT_GMAIL || 'carzodrive1@gmail.com';

const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
const cleanWhatsapp = String(rawWhatsapp).replace(/[^0-9]/g, '');

export const CONTACT_CONFIG = {
  // Raw phone digits
  phone: cleanPhone,
  // WhatsApp number with country code (e.g. 917377733391)
  whatsappNumber: cleanWhatsapp,
  // Clean formatted display phone (e.g. +91 73777 33391)
  phoneDisplay: `+91 ${cleanPhone.length === 10 ? `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : cleanPhone}`,
  // Clickable tel: URI
  phoneTel: `tel:+91${cleanPhone}`,
  // Support email
  email: rawEmail,
  // Clickable mailto: URI
  emailMailto: `mailto:${rawEmail}`,
  // Official Gmail
  gmail: rawGmail,
  // Clickable Gmail mailto: URI
  gmailMailto: `mailto:${rawGmail}`,
  // Office info
  officeLocation: 'Plot no -1774. Ananda Bana Main Road. Kalinga Nagar, Ghatikia, Bhubaneswar, Pin- 751029',
};

// Direct named exports for backwards-compatibility
export const CARZODRIVE_WHATSAPP_NUMBER = CONTACT_CONFIG.whatsappNumber;
export const CARZODRIVE_PHONE_NUMBER = CONTACT_CONFIG.phoneDisplay;
export const CARZODRIVE_EMAIL = CONTACT_CONFIG.email;
export const CARZODRIVE_GMAIL = CONTACT_CONFIG.gmail;

export default CONTACT_CONFIG;
