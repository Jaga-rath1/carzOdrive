import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gauge, Fuel, Bike, ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';

export const BIKE_LISTING = [
  {
    id: 'bike-splendor',
    name: 'Hero Splendor Plus',
    category: 'Commuter',
    engine: '97.2 cc',
    mileage: '65 km/l',
    transmission: '4-Speed Manual',
    pricePerDay: '₹399',
    deposit: '₹1,000',
    image: '/images/vehicles/hero-splendor.jpg',
    badge: 'Odisha #1 Commuter',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-activa',
    name: 'Honda Activa 6G Scooty',
    category: 'Scooter',
    engine: '110 cc eSP',
    mileage: '55 km/l',
    transmission: 'Automatic (CVT)',
    pricePerDay: '₹499',
    deposit: '₹1,200',
    image: '/images/vehicles/honda-activa.jpg',
    badge: 'Most Popular Scooty',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-pulsar',
    name: 'Bajaj Pulsar 150',
    category: 'Commuter',
    engine: '150 cc DTS-i',
    mileage: '48 km/l',
    transmission: '5-Speed Manual',
    pricePerDay: '₹699',
    deposit: '₹1,500',
    image: '/images/vehicles/bajaj-pulsar.jpg',
    badge: 'Street Icon',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-fazer',
    name: 'Yamaha FZ-S / Fazer FI',
    category: 'Sports',
    engine: '149 cc Blue Core',
    mileage: '45 km/l',
    transmission: '5-Speed Manual',
    pricePerDay: '₹799',
    deposit: '₹2,000',
    image: '/images/vehicles/yamaha-fazer.jpg',
    badge: 'Smooth Tourer',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-mt15',
    name: 'Yamaha MT-15 V2',
    category: 'Sports',
    engine: '155 cc VVA Liquid Cooled',
    mileage: '46 km/l',
    transmission: '6-Speed Slipper Clutch',
    pricePerDay: '₹999',
    deposit: '₹2,500',
    image: '/images/vehicles/yamaha-mt15.jpg',
    badge: 'Top Performance',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-bullet',
    name: 'Royal Enfield Bullet 350',
    category: 'Luxury',
    engine: '349 cc J-Series',
    mileage: '36 km/l',
    transmission: '5-Speed Manual',
    pricePerDay: '₹1,299',
    deposit: '₹3,000',
    image: '/images/vehicles/royal-bullet.jpg',
    badge: 'Royal Thump',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
  {
    id: 'bike-ktm',
    name: 'KTM Duke 390',
    category: 'Luxury',
    engine: '399 cc Liquid-Cooled',
    mileage: '28 km/l',
    transmission: '6-Speed Quickshifter+',
    pricePerDay: '₹1,699',
    deposit: '₹4,000',
    image: '/images/vehicles/ktm-duke.jpg',
    badge: 'Speed King',
    isAvailable: false,
    availabilityStatus: 'Currently Not Available',
  },
];

export const BikeRideGrid = ({ onOpenQuickBook }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Scooter', 'Commuter', 'Sports', 'Luxury'];

  const filteredBikes = useMemo(() => {
    if (activeCategory === 'All') return BIKE_LISTING;
    return BIKE_LISTING.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        {/* COMING SOON BANNER */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border border-blue-500/30 shadow-[0_15px_45px_rgba(30,58,138,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>COMING SOON • PRE-BOOKING OPENS SHORTLY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Bhubaneswar Two-Wheeler Fleet Coming Soon
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                We are onboarding brand new scooties, sports bikes, and cruisers. The models shown below are currently unavailable for instant online booking. Connect with our concierge on WhatsApp for launch notification and pre-booking!
              </p>
            </div>
            <WhatsAppButton
              message="Hello CARZODRIVE! 👋 I would like to inquire about upcoming Bike & Scooty rental pre-bookings in Bhubaneswar."
              label="Pre-Book via WhatsApp"
              size="lg"
              variant="solid"
              className="shrink-0"
            />
          </div>
        </div>
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-12">
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
              {cat}
            </button>
          ))}
        </div>

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBikes.map((bike) => {
              const detailTarget = `/vehicle/${bike.id}`;

              return (
                <motion.div
                  key={bike.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <Link to={detailTarget} className="relative h-52 w-full overflow-hidden bg-slate-900 block">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white">
                        {bike.badge}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-600/90 text-white shadow-sm backdrop-blur-sm">
                        Not Available
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="text-xl font-black text-white drop-shadow-md">
                        {bike.pricePerDay}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-300 ml-1">
                        / day
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {bike.category}
                      </span>
                      <Link to={detailTarget}>
                        <h3 className="text-base font-black text-slate-950 mt-0.5 group-hover:text-blue-600 transition-colors">
                          {bike.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-slate-600 text-[11px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-blue-600" />
                        <span>{bike.engine}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-blue-600" />
                        <span>{bike.mileage}</span>
                      </div>
                      <div className="col-span-2 text-slate-500 text-[10px]">
                        Deposit: <strong className="text-slate-900 font-bold">{bike.deposit}</strong> (Refundable)
                      </div>
                    </div>

                    {/* Actions: View Details + WhatsApp + Book Bike */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={detailTarget}
                        className="flex-1 py-3 px-2 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all cursor-pointer text-center bg-slate-50 hover:bg-white"
                      >
                        View Details
                      </Link>

                      <WhatsAppButton
                        message={getVehicleWhatsAppMessage(bike)}
                        variant="icon-only"
                        size="md"
                      />

                      {bike.isAvailable ? (
                        <button
                          type="button"
                          onClick={() => onOpenQuickBook?.({ vehicle: bike, type: 'bike' })}
                          className="flex-1 py-3 px-2 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-3 px-2 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
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
