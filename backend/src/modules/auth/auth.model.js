const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VENDOR', 'CUSTOMER'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'CUSTOMER' },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'ACTIVE' },
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLogin: Date,
    // Customer-specific
    drivingLicenseNumber: String,
    drivingLicenseVerified: { type: Boolean, default: false },
    // Vendor reference
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ phone: 1 }, { sparse: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
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
