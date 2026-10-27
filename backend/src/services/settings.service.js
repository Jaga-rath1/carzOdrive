const { Setting, DEFAULT_DISCOUNT, DEFAULT_DRIVER_SETTINGS } = require('../models/setting.model');
const logger = require('../utils/logger');

let cachedDiscount = null;
let cachedDriverSettings = null;
let discountExpiresAt = 0;
let driverExpiresAt = 0;
const CACHE_TTL_MS = 15000; // 15 seconds fast memory cache

async function getDiscountSettings() {
  const now = Date.now();
  if (cachedDiscount && now < discountExpiresAt) {
    return cachedDiscount;
  }

  try {
    const discount = await Setting.getDiscountSettings();
    cachedDiscount = discount;
    discountExpiresAt = now + CACHE_TTL_MS;
    return discount;
  } catch (err) {
    logger.warn('Failed to load discount settings from DB, using default:', err.message);
    return DEFAULT_DISCOUNT;
  }
}

async function updateDiscountSettings(data, adminUserId = null) {
  let setting = await Setting.findOne({ key: 'site_settings' });
  if (!setting) {
    setting = new Setting({ key: 'site_settings' });
  }

  const current = setting.discount || {};

  const percentage = data.percentage !== undefined ? Math.max(0, Math.min(100, Number(data.percentage))) : (current.percentage ?? 5);
  const isActive = data.isActive !== undefined ? Boolean(data.isActive) : (current.isActive ?? true);
  const name = typeof data.name === 'string' ? data.name.trim() : (current.name || 'Special Promotional Discount');
  const badgeText = typeof data.badgeText === 'string' ? data.badgeText.trim() : (current.badgeText || `${percentage}% OFF`);
  const bannerText = typeof data.bannerText === 'string' ? data.bannerText.trim() : (current.bannerText || `Exclusive ${percentage}% OFF on all Self-Drive & Car with Driver Rides!`);
  const minBookingAmount = data.minBookingAmount !== undefined ? Math.max(0, Number(data.minBookingAmount)) : (current.minBookingAmount || 0);
  const maxDiscountCap = data.maxDiscountCap !== undefined ? Math.max(0, Number(data.maxDiscountCap)) : (current.maxDiscountCap || 5000);

  let applicableServices = current.applicableServices || [
    'self-drive-car',
    'self-drive-bike',
    'car-with-driver',
    'driver-only',
    'tour-packages',
  ];
  if (Array.isArray(data.applicableServices) && data.applicableServices.length > 0) {
    applicableServices = data.applicableServices;
  }

  setting.discount = {
    isActive,
    percentage,
    name,
    badgeText,
    bannerText,
    minBookingAmount,
    maxDiscountCap,
    applicableServices,
    updatedBy: adminUserId || setting.discount?.updatedBy || null,
    updatedAt: new Date(),
  };

  await setting.save();

  cachedDiscount = setting.discount;
  discountExpiresAt = Date.now() + CACHE_TTL_MS;

  logger.info(`Admin updated discount settings: ${percentage}% OFF (Active: ${isActive})`);
  return setting.discount;
}

async function getDriverSettings() {
  const now = Date.now();
  if (cachedDriverSettings && now < driverExpiresAt) {
    return cachedDriverSettings;
  }

  try {
    const driverSettings = await Setting.getDriverSettings();
    cachedDriverSettings = driverSettings;
    driverExpiresAt = now + CACHE_TTL_MS;
    return driverSettings;
  } catch (err) {
    logger.warn('Failed to load driver settings from DB, using default ₹799:', err.message);
    return DEFAULT_DRIVER_SETTINGS;
  }
}

async function updateDriverSettings(data, adminUserId = null) {
  let setting = await Setting.findOne({ key: 'site_settings' });
  if (!setting) {
    setting = new Setting({ key: 'site_settings' });
  }

  const current = setting.driverSettings || DEFAULT_DRIVER_SETTINGS;

  const dailyRate = data.dailyRate !== undefined ? Math.max(0, Number(data.dailyRate)) : current.dailyRate;
  const hourlyRate = data.hourlyRate !== undefined ? Math.max(0, Number(data.hourlyRate)) : current.hourlyRate;
  const registrationFee = data.registrationFee !== undefined ? Math.max(0, Number(data.registrationFee)) : current.registrationFee;
  const isRegistrationActive = data.isRegistrationActive !== undefined ? Boolean(data.isRegistrationActive) : current.isRegistrationActive;
  const badgeText = typeof data.badgeText === 'string' && data.badgeText.trim()
    ? data.badgeText.trim()
    : `₹${dailyRate}/Day`;
  const planName = typeof data.planName === 'string' && data.planName.trim()
    ? data.planName.trim()
    : current.planName;
  const noticeText = typeof data.noticeText === 'string' && data.noticeText.trim()
    ? data.noticeText.trim()
    : current.noticeText;

  setting.driverSettings = {
    dailyRate,
    hourlyRate,
    registrationFee,
    isRegistrationActive,
    badgeText,
    planName,
    noticeText,
    updatedBy: adminUserId || setting.driverSettings?.updatedBy || null,
    updatedAt: new Date(),
  };

  await setting.save();

  cachedDriverSettings = setting.driverSettings;
  driverExpiresAt = Date.now() + CACHE_TTL_MS;

  logger.info(`Admin updated driver settings: Rate ₹${dailyRate}/day, Registration Fee ₹${registrationFee}`);
  return setting.driverSettings;
}

function invalidateSettingsCache() {
  cachedDiscount = null;
  cachedDriverSettings = null;
  discountExpiresAt = 0;
  driverExpiresAt = 0;
}

module.exports = {
  getDiscountSettings,
  updateDiscountSettings,
  getDriverSettings,
  updateDriverSettings,
  invalidateSettingsCache,
};
