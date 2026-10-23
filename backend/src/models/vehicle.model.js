const mongoose = require('mongoose');

const VEHICLE_TYPES = ['SEDAN', 'SUV', 'HATCHBACK', 'MUV', 'LUXURY', 'VAN', 'PICKUP', 'car'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'Petrol', 'Diesel', 'Electric'];
const TRANSMISSION_TYPES = ['MANUAL', 'AUTOMATIC', 'Manual', 'Automatic', '5-Speed Manual', 'AMT'];
const SERVICE_TYPES = ['SELF_DRIVE', 'WITH_DRIVER', 'self-ride', 'with-driver', 'self-drive'];
const VEHICLE_STATUSES = ['APPROVED', 'PENDING_APPROVAL', 'PENDING', 'REJECTED', 'SUSPENDED', 'MAINTENANCE'];

const vehicleSchema = new mongoose.Schema(
  {
    // Frontend unique identifier & catalog slug
    id: { type: String, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: { type: String, trim: true, lowercase: true }, // 'hatchback', 'suv', 'sedan', 'luxury', 'muv'
    type: { type: String, trim: true }, // 'Sporty Hatchback', 'Executive Chauffeur Sedan', etc.
    vehicleType: { type: String, default: 'car' },
    year: { type: Number, default: 2024 },
    buyingYear: { type: Number, default: 2024 },
    color: { type: String, trim: true, default: 'White' },
    availableCount: { type: Number, default: 1, min: 0 },
    quantity: { type: Number, default: 1, min: 0 },
    isAvailable: { type: Boolean, default: true },
    availabilityStatus: { type: String, default: 'Available' },
    tagline: { type: String, trim: true },
    image: { type: String, trim: true },
    images: [{ type: String }],
    secondaryImages: [{ type: String }],
    gallery: [{ type: String }],
    imageOptions: [{ label: String, url: String }],
    pricePerDay: { type: Number, min: 0 },
    pricePerHour: { type: Number, min: 0 },
    priceNumeric: { type: Number, min: 0 },
    priceDisplay: { type: String, trim: true },
    deposit: { type: String, trim: true },
    depositNumeric: { type: Number, min: 0 },
    rating: { type: Number, default: 4.95, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 50, min: 0 },
    badge: { type: String, trim: true },
    availableFor: [{ type: String }], // ['self-ride', 'with-driver']
    isFeatured: { type: Boolean, default: false },

    // Top-level performance & specs for direct frontend binding
    engineCapacity: { type: String, trim: true },
    power: { type: String, trim: true },
    mileage: { type: String, trim: true },
    topSpeed: { type: String, trim: true },
    acceleration: { type: String, trim: true },
    bootSpace: { type: String, trim: true },
    luggage: { type: String, trim: true },
    airbags: { type: String, trim: true },
    groundClearance: { type: String, trim: true },
    drivetrain: { type: String, trim: true },

    specs: {
      power: String,
      engine: String,
      acceleration: String,
      topSpeed: String,
      mileage: String,
      transmission: String,
      seats: Number,
      fuelType: String,
      drivetrain: String,
      luggage: String,
      bootSpace: String,
      airbags: String,
      groundClearance: String,
      color: String,
      availableUnits: Number,
    },
    features: [{ type: String }],
    inclusions: [{ type: String }],
    rules: [{ type: String }],
    driver: {
      name: String,
      phone: String,
      rating: Number,
      trips: Number,
      experience: String,
      photo: String,
    },

    // Backend compatibility & management fields
    make: {
      type: String,
      trim: true,
      default: function () {
        return this.brand || 'Maruti Suzuki';
      },
    },
    model: {
      type: String,
      trim: true,
      default: function () {
        return this.name || 'Swift';
      },
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    seats: { type: Number, default: 5 },
    fuelType: { type: String, default: 'Petrol' },
    transmission: { type: String, default: 'Manual' },
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Bhubaneswar Airport & Cuttack Hub',
      }),
    },
    serviceTypes: {
      type: [String],
      default: ['SELF_DRIVE', 'WITH_DRIVER'],
    },
    pricing: {
      selfDrive: {
        daily: { type: Number, default: 0 },
        hourly: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 },
      },
      withDriver: {
        daily: { type: Number, default: 0 },
        hourly: { type: Number, default: 0 },
        perKm: { type: Number, default: 0 },
      },
    },
    securityDeposit: { type: Number, default: 0 },
    extraKmCharge: { type: Number, default: 0 },

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
      enum: VEHICLE_STATUSES,
      default: 'APPROVED',
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Production High-Performance Indexes
vehicleSchema.index({ status: 1, isPublished: 1, isAvailable: 1, isFeatured: -1, rating: -1, createdAt: -1 });
vehicleSchema.index({ status: 1, isPublished: 1, isAvailable: 1, category: 1, isFeatured: -1 });
vehicleSchema.index({ vendorId: 1, status: 1, createdAt: -1 });
vehicleSchema.index({ vendorId: 1, isVendorListing: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ isFeatured: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ isPublished: 1, isAvailable: 1 });
vehicleSchema.index({ id: 1 });
vehicleSchema.index(
  { name: 'text', brand: 'text', make: 'text', model: 'text', category: 'text' },
  { weights: { name: 10, brand: 5, model: 5, category: 2 }, name: 'vehicle_text_search' }
);

// Ensure priceNumeric and pricePerDay stay synchronized
vehicleSchema.pre('save', function (next) {
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

  // Synchronize quantity and availableCount
  if (this.quantity !== undefined && this.availableCount === undefined) {
    this.availableCount = Number(this.quantity);
  } else if (this.availableCount !== undefined && this.quantity === undefined) {
    this.quantity = Number(this.availableCount);
  } else if (this.isModified && (this.isModified('quantity') || this.isModified('availableCount'))) {
    if (this.isModified('quantity')) {
      this.availableCount = Number(this.quantity);
    } else {
      this.quantity = Number(this.availableCount);
    }
  }

  // Keep specs.availableUnits synchronized
  const effectiveStock = this.quantity !== undefined ? Number(this.quantity) : Number(this.availableCount ?? 1);
  if (!this.specs) this.specs = {};
  this.specs.availableUnits = effectiveStock;

  // When quantity / availableCount is 0, mark as Currently Unavailable
  if (effectiveStock <= 0) {
    this.quantity = 0;
    this.availableCount = 0;
    this.specs.availableUnits = 0;
    this.isAvailable = false;
    this.availabilityStatus = 'Currently Unavailable';
  } else {
    if (this.availabilityStatus === 'Currently Unavailable' || this.availabilityStatus === 'UNAVAILABLE') {
      this.isAvailable = true;
      this.availabilityStatus = 'Available';
    }
  }

  next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = {
  Vehicle,
  VEHICLE_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  SERVICE_TYPES,
  VEHICLE_STATUSES,
};
module.exports.Vehicle = Vehicle;
