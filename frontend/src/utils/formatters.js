/**
 * Currency and date formatting utilities for CARZODRIVE
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || amount === '') return '₹0';

  // If already formatted with ₹ or Rs., return cleanly
  if (typeof amount === 'string') {
    const trimmed = amount.trim();
    if (trimmed.startsWith('₹') || trimmed.startsWith('Rs.')) {
      return trimmed;
    }
  }

  // Extract clean number
  const cleanNum = typeof amount === 'number'
    ? amount
    : Number(String(amount).replace(/[^0-9.-]+/g, ''));

  if (isNaN(cleanNum)) return '₹0';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(cleanNum);
  } catch {
    return `₹${cleanNum.toLocaleString('en-IN')}`;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateString);
  }
};

export const formatRating = (rating) => {
  const num = Number(rating);
  return isNaN(num) ? '5.0' : num.toFixed(1);
};

/**
 * Returns today's date (or offset days) in local YYYY-MM-DD format
 * for HTML5 <input type="date" min="..."> binding.
 */
export const getTodayDateString = (daysAhead = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + Number(daysAhead || 0));
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current local time in HH:MM format with optional buffer minutes (e.g. +30 mins)
 */
export const getCurrentTimeString = (bufferMinutes = 0) => {
  const d = new Date();
  if (bufferMinutes) {
    d.setMinutes(d.getMinutes() + Number(bufferMinutes));
  }
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Returns true if the date string (YYYY-MM-DD) is in the past (before today)
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  const today = getTodayDateString(0);
  const cleanDate = String(dateString).split('T')[0].trim();
  return cleanDate < today;
};

/**
 * Ensures that a date string is today or in the future; if in past, returns fallback.
 */
export const ensureFutureDate = (dateString, fallbackDaysAhead = 1) => {
  if (!dateString || isPastDate(dateString)) {
    return getTodayDateString(fallbackDaysAhead);
  }
  return String(dateString).split('T')[0].trim();
};

/**
 * Ensures that if selected date is today, the time is in the future.
 */
export const ensureFutureTime = (dateString, timeString, bufferMinutes = 30) => {
  const today = getTodayDateString(0);
  const nowTime = getCurrentTimeString(0);
  if (dateString === today && (!timeString || timeString < nowTime)) {
    return getCurrentTimeString(bufferMinutes);
  }
  return timeString || '10:00';
};

/**
 * Checks if a given date & time combination is in the past compared to Date.now & Time.now
 */
export const isPastDateTime = (dateString, timeString) => {
  if (!dateString) return false;
  const today = getTodayDateString(0);
  const cleanDate = String(dateString).split('T')[0].trim();
  if (cleanDate < today) return true;
  if (cleanDate === today && timeString) {
    const nowTime = getCurrentTimeString(0);
    return timeString < nowTime;
  }
  return false;
};

/**
 * Returns safe future pickup date and time, auto-clamping if in the past
 */
export const getSafeFuturePickupDateTime = (dateString, timeString, bufferMinutes = 30) => {
  const today = getTodayDateString(0);
  const nowTime = getCurrentTimeString(0);
  let safeDate = dateString && dateString >= today ? dateString : today;
  let safeTime = timeString;

  if (safeDate === today) {
    if (!safeTime || safeTime < nowTime) {
      safeTime = getCurrentTimeString(bufferMinutes);
    }
  } else if (!safeTime) {
    safeTime = '10:00';
  }

  return { date: safeDate, time: safeTime };
};

/**
 * Returns safe return date and time, ensuring it is not before pickup date/time
 */
export const getSafeReturnDateTime = (pickupDate, pickupTime, returnDate, returnTime) => {
  const today = getTodayDateString(0);
  const safePickupDate = pickupDate && pickupDate >= today ? pickupDate : today;
  let safeReturnDate = returnDate && returnDate >= safePickupDate ? returnDate : safePickupDate;
  let safeReturnTime = returnTime || '18:00';

  if (safeReturnDate === safePickupDate && pickupTime) {
    if (!safeReturnTime || safeReturnTime <= pickupTime) {
      const [h, m] = pickupTime.split(':').map(Number);
      const nextH = Math.min(23, (h || 10) + 2);
      safeReturnTime = `${String(nextH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
    }
  }

  return { returnDate: safeReturnDate, returnTime: safeReturnTime };
};

