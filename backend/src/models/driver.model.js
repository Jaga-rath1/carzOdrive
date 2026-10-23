const mongoose = require('mongoose');
require('./user.model');

const driverSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Executive Chauffeur & Verified Pilot',
    },
    experienceYears: {
      type: Number,
      default: 5,
      min: 0,
    },
    rating: {
      type: mongoose.Schema.Types.Mixed,
      default: 4.95,
    },
    tripsCount: {
      type: Number,
      default: 500,
      min: 0,
    },
    photo: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    languages: {
      type: [String],
      default: ['Odia', 'Hindi', 'English'],
    },
    specialties: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 120,
    },
    dailyRate: {
      type: Number,
      default: 899,
    },
    outstationRatePerKm: {
      type: Number,
      default: 11,
    },
    certifications: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
      default: 'Verified Pilot',
    },
    status: {
      type: String,
      default: 'Available Today',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    serviceArea: {
      type: [String],
      default: ['Bhubaneswar', 'Cuttack', 'Puri'],
    },

    // Registration & Documents
    city: {
      type: String,
      trim: true,
      default: 'Bhubaneswar',
    },
    dob: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    drivingExperience: {
      type: String,
      trim: true,
    },
    licenseType: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      trim: true,
    },
    drivingLicenseDoc: {
      type: String,
      trim: true,
    },
    idProofDoc: {
      type: String,
      trim: true,
    },
    profilePhotoDoc: {
      type: String,
      trim: true,
    },
    addressProofDoc: {
      type: String,
      trim: true,
    },
    documents: [
      {
        type: { type: String, trim: true },
        url: { type: String, trim: true },
        name: { type: String, trim: true },
        verified: { type: Boolean, default: false },
      },
    ],
    rejectionReason: {
      type: String,
      trim: true,
    },
    suspensionReason: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },

    // Backend compatibility fields
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    licenseNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

// Production High-Performance Indexes
driverSchema.index({ status: 1, isAvailable: 1, rating: -1 });
driverSchema.index({ city: 1, status: 1 });
driverSchema.index({ id: 1 });
driverSchema.index({ phone: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ isAvailable: 1 });
driverSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: 'objectId' } } }
);
driverSchema.index({ name: 'text', city: 'text', title: 'text' });

driverSchema.pre('save', function (next) {
  if (this.photo && !this.avatar) {
    this.avatar = this.photo;
  }
  if (this.avatar && !this.photo) {
    this.photo = this.avatar;
  }
  next();
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = { Driver };
module.exports.Driver = Driver;
