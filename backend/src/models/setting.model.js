const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site_settings' },
    discount: {
      isActive: { type: Boolean, default: true },
      percentage: { type: Number, default: 5, min: 0, max: 100 },
      name: { type: String, default: 'Special Promotional Discount' },
      badgeText: { type: String, default: '5% OFF' },
      bannerText: {
        type: String,
        default: 'Limited Offer: Enjoy 5% OFF on all Self-Drive & Car with Driver Rides across Odisha!',
      },
      minBookingAmount: { type: Number, default: 0 },
      maxDiscountCap: { type: Number, default: 5000 },
      applicableServices: {
        type: [String],
        default: [
          'self-drive-car',
          'self-drive-bike',
          'car-with-driver',
          'driver-only',
          'tour-packages',
        ],
      },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      updatedAt: { type: Date, default: Date.now },
    },
    driverSettings: {
      dailyRate: { type: Number, default: 799, min: 0 },
      hourlyRate: { type: Number, default: 120, min: 0 },
      registrationFee: { type: Number, default: 799, min: 0 },
      isRegistrationActive: { type: Boolean, default: true },
      badgeText: { type: String, default: '₹799/Day' },
      planName: { type: String, default: 'Verified Driver Daily Hire & Registration' },
      noticeText: {
        type: String,
        default: 'Verified Commercial Driver • Available across Bhubaneswar, Cuttack & Puri',
      },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// Guaranteed default discount configuration
const DEFAULT_DISCOUNT = {
  isActive: true,
  percentage: 5,
  name: 'Special Promotional Discount',
  badgeText: '5% OFF',
  bannerText: 'Limited Offer: Enjoy 5% OFF on all Self-Drive & Car with Driver Rides across Odisha!',
  minBookingAmount: 0,
  maxDiscountCap: 5000,
  applicableServices: [
    'self-drive-car',
    'self-drive-bike',
    'car-with-driver',
    'driver-only',
    'tour-packages',
  ],
};

// Guaranteed default driver configuration
const DEFAULT_DRIVER_SETTINGS = {
  dailyRate: 799,
  hourlyRate: 120,
  registrationFee: 799,
  isRegistrationActive: true,
  badgeText: '₹799/Day',
  planName: 'Verified Driver Daily Hire & Registration',
  noticeText: 'Verified Commercial Driver • Available across Bhubaneswar, Cuttack & Puri',
};

// High-speed static getter to fetch discount settings with guaranteed default 5%
settingSchema.statics.getDiscountSettings = async function () {
  let setting = await this.findOne({ key: 'site_settings' });
  if (!setting) {
    try {
      setting = await this.create({
        key: 'site_settings',
        discount: DEFAULT_DISCOUNT,
        driverSettings: DEFAULT_DRIVER_SETTINGS,
      });
    } catch (_) {
      setting = await this.findOne({ key: 'site_settings' });
    }
  }

  return setting?.discount || DEFAULT_DISCOUNT;
};

// High-speed static getter to fetch driver pricing & registration settings
settingSchema.statics.getDriverSettings = async function () {
  let setting = await this.findOne({ key: 'site_settings' });
  if (!setting) {
    try {
      setting = await this.create({
        key: 'site_settings',
        discount: DEFAULT_DISCOUNT,
        driverSettings: DEFAULT_DRIVER_SETTINGS,
      });
    } catch (_) {
      setting = await this.findOne({ key: 'site_settings' });
    }
  }

  return setting?.driverSettings || DEFAULT_DRIVER_SETTINGS;
};

const Setting = mongoose.model('Setting', settingSchema);

module.exports = { Setting, DEFAULT_DISCOUNT, DEFAULT_DRIVER_SETTINGS };
