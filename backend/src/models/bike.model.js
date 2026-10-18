const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    type: { type: String, trim: true }, // 'Commuter Motorcycle', 'Automatic Scooty'
    category: { type: String, trim: true, lowercase: true }, // 'commuter', 'scooter', 'cruiser', 'sports'
    vehicleType: { type: String, default: 'bike' },
    year: { type: Number, default: 2024 },
    buyingYear: { type: Number, default: 2024 },
    color: { type: String, trim: true, default: 'Black' },
    tagline: { type: String, trim: true },
    image: { type: String, trim: true },
    images: [{ type: String }],
    secondaryImages: [{ type: String }],
    gallery: [{ type: String }],
    pricePerDay: { type: Number, min: 0 },
    pricePerHour: { type: Number, min: 0 },
    priceNumeric: { type: Number, min: 0 },
    priceDisplay: { type: String, trim: true },
    deposit: { type: String, trim: true },
    depositNumeric: { type: Number, min: 0 },
    extraKmCharge: { type: Number, default: 4 },
    rating: { type: Number, default: 4.95, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 40, min: 0 },
    isAvailable: { type: Boolean, default: true },
    availabilityStatus: { type: String, default: 'Available' },
    availableCount: { type: Number, default: 1 },
    badge: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },

    // Top-level specs & performance indicators for frontend binding
    engineCapacity: { type: String, trim: true },
    power: { type: String, trim: true },
    torque: { type: String, trim: true },
    mileage: { type: String, trim: true },
    topSpeed: { type: String, trim: true },
    dryWeight: { type: String, trim: true },
    transmission: { type: String, default: 'Manual' },
    fuelType: { type: String, default: 'Petrol' },
    brakes: { type: String, default: 'Dual-Channel ABS' },

    specs: {
      power: String,
      engine: String,
      torque: String,
      acceleration: String,
      topSpeed: String,
      mileage: String,
      dryWeight: String,
      transmission: String,
      brakes: String,
      fuelType: String,
      color: String,
    },
    features: [{ type: String }],
    gearIncluded: [{ type: String }],
    inclusions: [{ type: String }],
    rules: [{ type: String }],

    // Backend compatibility fields
    make: {
      type: String,
      trim: true,
      default: function () {
        return this.brand || 'Hero MotoCorp';
      },
    },
    model: {
      type: String,
      trim: true,
      default: function () {
        return this.name || 'Splendor Plus';
      },
    },
    bikeType: {
      type: String,
      default: function () {
        return (this.category || 'COMMUTER').toUpperCase();
      },
    },
    engineCC: { type: Number },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Bhubaneswar Hub & Railway Station',
      }),
    },
    pricing: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      securityDeposit: { type: Number, default: 0 },
    },
    // Vendor / Host attachment properties
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isVendorListing: { type: Boolean, default: false },
    ownerName: { type: String, trim: true },
    ownerPhone: { type: String, trim: true },
    ownerEmail: { type: String, trim: true, lowercase: true },
    rcNumber: { type: String, trim: true, uppercase: true },
    rcDocumentUrl: { type: String, trim: true },
    insuranceValidTill: { type: Date },
    insuranceDocumentUrl: { type: String, trim: true },
    idProofUrl: { type: String, trim: true },
    documents: [
      {
        type: { type: String, trim: true },
        url: { type: String, trim: true },
        name: { type: String, trim: true },
        verified: { type: Boolean, default: false },
      },
    ],
    rejectionReason: { type: String, trim: true },
    approvalNotes: { type: String, trim: true },

    status: {
      type: String,
      enum: ['APPROVED', 'PENDING_APPROVAL', 'PENDING', 'REJECTED', 'SUSPENDED', 'MAINTENANCE'],
      default: 'APPROVED',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bikeSchema.index({ vendorId: 1, isVendorListing: 1 });
bikeSchema.index({ category: 1 });
bikeSchema.index({ isFeatured: 1 });
bikeSchema.index({ status: 1 });
bikeSchema.index({ isPublished: 1, isAvailable: 1 });

bikeSchema.pre('save', function (next) {
  if (this.pricePerDay && !this.priceNumeric) {
    this.priceNumeric = this.pricePerDay;
  }
  if (this.priceNumeric && !this.pricePerDay) {
    this.pricePerDay = this.priceNumeric;
  }
  if (!this.priceDisplay && this.pricePerDay) {
    this.priceDisplay = `₹${this.pricePerDay.toLocaleString('en-IN')}`;
  }
  if (this.depositNumeric && !this.deposit) {
    this.deposit = `₹${this.depositNumeric.toLocaleString('en-IN')}`;
  }
  if (this.deposit && !this.depositNumeric) {
    const num = parseInt(String(this.deposit).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) this.depositNumeric = num;
  }
  if (!this.make && this.brand) this.make = this.brand;
  if (!this.model && this.name) this.model = this.name;
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);
  }

  // Synchronize engineCC, engineCapacity and specs.engine
  if (this.engineCC && !this.engineCapacity) {
    this.engineCapacity = `${this.engineCC} cc`;
  } else if (!this.engineCC && this.engineCapacity) {
    const parsed = parseInt(String(this.engineCapacity).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) this.engineCC = parsed;
  } else if (!this.engineCC && this.specs?.engine) {
    const parsed = parseInt(String(this.specs.engine).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      this.engineCC = parsed;
      if (!this.engineCapacity) this.engineCapacity = `${parsed} cc`;
    }
  }

  if (this.specs && !this.specs.engine && (this.engineCapacity || this.engineCC)) {
    this.specs.engine = this.engineCapacity || `${this.engineCC} cc`;
  }

  next();
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = { Bike };
module.exports.Bike = Bike;
