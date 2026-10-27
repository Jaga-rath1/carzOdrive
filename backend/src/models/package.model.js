const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    title: { type: String, trim: true },
    desc: { type: String, trim: true },
    description: { type: String, trim: true },
    activities: { type: [String], default: [] },
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    title: { type: String, required: true, trim: true },
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.title;
      },
    },
    destination: { type: String, required: true, trim: true },
    duration: { type: mongoose.Schema.Types.Mixed, default: '2 Days / 1 Night' },
    durationStr: { type: String, trim: true },
    startingPrice: { type: String, trim: true },
    priceNumeric: { type: Number, default: 4999 },
    category: { type: String, trim: true, default: 'Spiritual & Temples' },
    odishaTheme: { type: String, trim: true, default: 'Spiritual & Temples' },
    badge: { type: String, trim: true, default: 'Odisha Special' },
    tagline: { type: String, trim: true },
    featuredVehicle: { type: String, trim: true, default: 'Toyota Innova Crysta / Luxury Car with Driver' },
    pickupLocation: { type: String, trim: true, default: 'Bhubaneswar Airport / Railway Station' },
    dropLocation: { type: String, trim: true, default: 'Bhubaneswar Hub' },
    image: { type: String, trim: true },
    images: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: { type: [itineraryDaySchema], default: [] },
    rating: { type: Number, default: 4.95, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 120, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED', 'SUSPENDED'],
      default: 'APPROVED',
    },
    minPax: { type: Number, default: 1, min: 1 },
    maxPax: { type: Number, default: 20 },
    pricing: {
      adultPrice: { type: Number, default: 4999 },
      childPrice: { type: Number, default: 2499 },
      infantPrice: { type: Number, default: 0 },
    },
    availableDates: [
      {
        date: { type: Date },
        capacity: { type: Number, default: 20 },
        bookedCount: { type: Number, default: 0 },
      },
    ],
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// Production High-Performance Indexes
tourPackageSchema.index({ status: 1, isPublished: 1, isAvailable: 1, rating: -1 });
tourPackageSchema.index({ destination: 1, category: 1 });
tourPackageSchema.index({ id: 1 });
tourPackageSchema.index({ destination: 1 });
tourPackageSchema.index({ category: 1 });
tourPackageSchema.index({ odishaTheme: 1 });
tourPackageSchema.index({ status: 1, isPublished: 1 });
tourPackageSchema.index({ title: 'text', destination: 'text', category: 'text' });

tourPackageSchema.pre('save', function (next) {
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }
  if (this.startingPrice && !this.priceNumeric) {
    const num = parseInt(String(this.startingPrice).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) this.priceNumeric = num;
  }
  if (this.priceNumeric && !this.startingPrice) {
    this.startingPrice = `₹${this.priceNumeric.toLocaleString('en-IN')}`;
  }
  if (!this.pricing || !this.pricing.adultPrice) {
    this.pricing = {
      adultPrice: this.priceNumeric || 4999,
      childPrice: Math.round((this.priceNumeric || 4999) * 0.5),
      infantPrice: 0,
    };
  }
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
  if (!this.slug && this.name) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900);
  }
  next();
});

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);

module.exports = TourPackage;
module.exports.TourPackage = TourPackage;
