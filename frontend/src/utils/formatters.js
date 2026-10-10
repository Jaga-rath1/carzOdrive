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
