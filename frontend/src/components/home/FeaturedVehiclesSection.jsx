import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Fuel, Gauge, ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';

export const FEATURED_DATA = [
  // ==========================================
  // ACTIVE 4 CARS IN CUSTOMER FLEET
  // ==========================================
  {
    id: 'feat-swift-2026',
    catalogId: 'car-swift-2026',
    name: 'Maruti Suzuki Swift (2026)',
    type: 'Sporty Hatchback',
    category: 'Sedan',
    color: 'Magma Grey',
    year: 2026,
    isAvailable: true,
    availableCount: 1,
    image: '/images/vehicles/swift-2026-grey.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: 'Manual / AMT',
    pricePerDay: '₹1,699',
    badge: 'Odisha Bestseller',
  },
  {
    id: 'feat-swift-2021',
    catalogId: 'car-swift-2021',
    name: 'Maruti Suzuki Swift (2021)',
    type: 'Sporty Hatchback',
    category: 'Sedan',
    color: 'Metallic Grey',
    year: 2021,
    isAvailable: true,
    availableCount: 1,
    image: '/images/vehicles/swift-2021-grey.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: '5-Speed Manual',
    pricePerDay: '₹1,499',
    badge: 'Reliable Performer',
  },
  {
    id: 'feat-sonet-2023',
    catalogId: 'car-sonet-2023',
    name: 'Kia Sonet (2023)',
    type: 'Compact SUV',
    category: 'SUV',
    color: 'Aurora Black',
    year: 2023,
    isAvailable: true,
    availableCount: 1,
    image: '/images/vehicles/kia-sonet-black.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: 'iMT / DCT Auto',
    pricePerDay: '₹2,299',
    badge: 'Tech Loaded',
  },
  {
    id: 'feat-creta-2026',
    catalogId: 'car-creta-2026',
    name: 'Hyundai Creta (2026)',
    type: 'Mid-Size SUV',
    category: 'SUV',
    color: 'Atlas White',
    year: 2026,
    isAvailable: true,
    availableCount: 1,
    image: '/images/vehicles/hyundai-creta-white.jpg',
    seats: '5 Seats',
    fuel: 'Diesel / Petrol',
    transmission: '6-Speed Auto',
    pricePerDay: '₹2,799',
    badge: 'Family Favorite',
  },

  // ==========================================
  // PRESERVED FLEET (CURRENTLY NOT AVAILABLE)
  // ==========================================
  {
    id: 'feat-fortuner',
    catalogId: 'car-fortuner',
    name: 'Toyota Fortuner 4x4',
    type: 'Luxury Full-Size SUV',
    category: 'Luxury',
    color: 'Attitude Black',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/toyota-fortuner.jpg',
    seats: '7 Seats',
    fuel: 'Diesel',
    transmission: 'Automatic 4x4',
    pricePerDay: '₹5,999',
    badge: 'Luxury Flagship',
  },
  {
    id: 'feat-thar',
    catalogId: 'car-thar',
    name: 'Mahindra Thar 4x4',
    type: 'Off-Road 4x4',
    category: 'Luxury',
    color: 'Red Rage',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/mahindra-thar.jpg',
    seats: '4 Seats',
    fuel: 'Diesel / Petrol',
    transmission: 'Automatic 4WD',
    pricePerDay: '₹3,999',
    badge: 'Puri Beach Icon',
  },
  {
    id: 'feat-innova',
    catalogId: 'car-innova',
    name: 'Toyota Innova Crysta',
    type: 'Premium MPV',
    category: 'Luxury',
    color: 'Super White',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/toyota-innova.jpg',
    seats: '7 Seats',
    fuel: 'Diesel',
    transmission: 'Auto / Manual',
    pricePerDay: '₹3,799',
    badge: 'VIP Touring MPV',
  },
  {
    id: 'feat-scorpio',
    catalogId: 'car-scorpio',
    name: 'Mahindra Scorpio-N',
    type: 'Muscular SUV',
    category: 'SUV',
    color: 'Napoli Black',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/mahindra-scorpio.jpg',
    seats: '7 Seats',
    fuel: 'Diesel',
    transmission: 'Automatic / 4x4',
    pricePerDay: '₹3,499',
    badge: 'Heavy Road Presence',
  },
  {
    id: 'feat-bolero',
    catalogId: 'car-bolero',
    name: 'Mahindra Bolero Neo',
    type: 'Rugged MUV',
    category: 'SUV',
    color: 'Rocky Beige',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/mahindra-bolero.jpg',
    seats: '7 Seats',
    fuel: 'Diesel',
    transmission: '5-Speed Manual',
    pricePerDay: '₹2,199',
    badge: 'Rough Road King',
  },
  {
    id: 'feat-dzire',
    catalogId: 'car-dzire',
    name: 'Maruti Suzuki Dzire',
    type: 'Compact Sedan',
    category: 'Sedan',
    color: 'Oxford Blue',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/maruti-dzire.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: 'Manual / AMT',
    pricePerDay: '₹1,799',
    badge: 'Family Favorite',
  },
  {
    id: 'feat-wagonr',
    catalogId: 'car-wagonr',
    name: 'Maruti Suzuki WagonR',
    type: 'Tallboy Hatchback',
    category: 'Sedan',
    color: 'Magma Grey',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/maruti-wagonr.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: 'Manual / Auto',
    pricePerDay: '₹1,399',
    badge: 'Extra Space',
  },
  {
    id: 'feat-alto',
    catalogId: 'car-alto',
    name: 'Maruti Suzuki Alto K10',
    type: 'City Hatchback',
    category: 'Sedan',
    color: 'Silky Silver',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/maruti-alto.jpg',
    seats: '5 Seats',
    fuel: 'Petrol',
    transmission: 'Manual',
    pricePerDay: '₹1,199',
    badge: 'Budget Friendly',
  },

  // Bikes (Preserved - Coming Soon / Currently Not Available)
  {
    id: 'feat-bullet',
    catalogId: 'bike-bullet',
    name: 'Royal Enfield Bullet 350',
    type: 'Luxury Cruiser',
    category: 'Bike',
    color: 'Classic Black',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/royal-bullet.jpg',
    seats: '2 Seats',
    fuel: 'Petrol',
    transmission: '5-Speed Manual',
    pricePerDay: '₹1,299',
    badge: 'Coming Soon',
  },
  {
    id: 'feat-ktm',
    catalogId: 'bike-ktm',
    name: 'KTM Duke 390',
    type: 'Performance Street',
    category: 'Bike',
    color: 'Orange / White',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/ktm-duke.jpg',
    seats: '2 Seats',
    fuel: 'Petrol',
    transmission: '6-Speed Quickshifter',
    pricePerDay: '₹1,699',
    badge: 'Coming Soon',
  },
  {
    id: 'feat-mt15',
    catalogId: 'bike-mt15',
    name: 'Yamaha MT-15 V2',
    type: 'Streetfighter',
    category: 'Bike',
    color: 'Cyan Storm',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/yamaha-mt15.jpg',
    seats: '2 Seats',
    fuel: 'Petrol',
    transmission: '6-Speed Slipper',
    pricePerDay: '₹999',
    badge: 'Coming Soon',
  },
  {
    id: 'feat-activa',
    catalogId: 'bike-activa',
    name: 'Honda Activa 6G Scooty',
    type: 'Automatic Scooty',
    category: 'Bike',
    color: 'Pearl White',
    isAvailable: false,
    availableCount: 0,
    image: '/images/vehicles/honda-activa.jpg',
    seats: '2 Seats',
    fuel: 'Petrol',
    transmission: 'Automatic (CVT)',
    pricePerDay: '₹499',
    badge: 'Coming Soon',
  },
];

export const FeaturedVehiclesSection = ({ onQuickBook }) => {
  const [activeCategory, setActiveCategory] = useState('Available Now');

  const categories = ['Available Now', 'SUV', 'Sedan', 'Luxury', 'Bike'];

  const filteredVehicles = useMemo(() => {
    if (activeCategory === 'Available Now') {
      return FEATURED_DATA.filter((v) => v.isAvailable);
    }
    return FEATURED_DATA.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="featured-vehicles" className="py-20 sm:py-28 bg-white relative">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black tracking-widest uppercase mb-3 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>THE CARZODRIVE FLEET</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Featured Machines.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                Ready to Drive.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl font-normal">
              Every car and bike is verified, insured, and delivered to your doorstep in pristine condition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/car-self-ride"
              className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
            >
              <span>Explore All Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/bike-self-ride"
              className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
            >
              <span>Explore All Bikes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.35)]'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat === 'Available Now'
                ? '🟢 Available Now'
                : cat === 'Bike'
                ? '🏍️ Bikes & Scooters (Coming Soon)'
                : cat === 'Sedan'
                ? 'Hatchback & Sedan'
                : cat === 'Luxury'
                ? 'Premium & 4x4'
                : cat}
            </button>
          ))}
        </div>

        {/* Banner when viewing Bike tab */}
        {activeCategory === 'Bike' && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold">
                Two-Wheeler Fleet Coming Soon: All bike & scooty models are currently unavailable for online booking. Pre-booking inquiries open on WhatsApp!
              </span>
            </div>
            <Link
              to="/bike-rental"
              className="text-xs font-black text-blue-700 hover:text-blue-800 underline underline-offset-2 shrink-0"
            >
              View Bike Fleet Details →
            </Link>
          </div>
        )}

        {/* Vehicles Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => {
              const detailTarget = `/vehicle/${vehicle.catalogId || vehicle.id}`;

              return (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Image */}
                  <Link to={detailTarget} className="relative h-56 w-full overflow-hidden bg-slate-900 block">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white shadow-sm">
                        {vehicle.badge}
                      </span>
                    </div>

                    {/* Price Tag in Image */}
                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="text-xl font-black text-white drop-shadow-md">
                        {vehicle.pricePerDay}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-300 ml-1">
                        / day
                      </span>
                    </div>
                  </Link>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                          {vehicle.type}
                        </span>
                        {vehicle.color && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            {vehicle.color}
                          </span>
                        )}
                      </div>
                      <Link to={detailTarget}>
                        <h3 className="text-lg font-black text-slate-950 mt-1 group-hover:text-blue-600 transition-colors">
                          {vehicle.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Spec Icons Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-600 text-[11px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{vehicle.seats}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                    </div>

                    {/* Action Buttons: View Details + WhatsApp + Book Ride (Faded if not available) */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={detailTarget}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all cursor-pointer text-center bg-slate-50 hover:bg-white"
                      >
                        View Details
                      </Link>

                      <WhatsAppButton
                        message={getVehicleWhatsAppMessage(vehicle)}
                        variant="icon-only"
                        size="md"
                      />

                      {vehicle.isAvailable ? (
                        <button
                          type="button"
                          onClick={() => onQuickBook ? onQuickBook({ ...vehicle, id: vehicle.catalogId || vehicle.id }) : null}
                          className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer text-center"
                        >
                          Book Ride
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
                          title="Vehicle is currently not available for booking"
                        >
                          Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
