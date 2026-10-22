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
 * Returns true if the date string (YYYY-MM-DD) is in the past (before today)
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  const today = getTodayDateString(0);
  // Normalize comparison by ISO prefix
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
