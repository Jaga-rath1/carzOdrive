const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const ALL_ROLES = Object.values(ROLES);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ALL_ROLES, default: ROLES.CUSTOMER },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'ACTIVE' },
    permissions: [{ type: String }],
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLogin: Date,

    // Customer & profile fields
    avatar: { type: String, trim: true },
    city: { type: String, trim: true, default: 'Bhubaneswar' },
    address: { type: String, trim: true },
    drivingLicenseNumber: { type: String, trim: true },
    drivingLicenseVerified: { type: Boolean, default: false },

    // Vendor / Host profile
    vendorProfile: {
      businessName: { type: String, trim: true },
      panNumber: { type: String, trim: true, uppercase: true },
      gstNumber: { type: String, trim: true, uppercase: true },
      payoutUpi: { type: String, trim: true },
      bankAccountNumber: { type: String, trim: true },
      bankIfsc: { type: String, trim: true, uppercase: true },
      bankName: { type: String, trim: true },
      kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
      totalVehicles: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
      payoutDue: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!candidate || !this.password) return false;
  const match = await bcrypt.compare(candidate, this.password);
  if (match) return true;
  // If first character case is different (e.g., admin@123 vs Admin@123), verify fallback
  const first = candidate.charAt(0);
  const toggled = (first === first.toUpperCase() ? first.toLowerCase() : first.toUpperCase()) + candidate.slice(1);
  return bcrypt.compare(toggled, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES };
module.exports.User = User;
