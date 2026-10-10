import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Bike,
  Shield,
  UserCheck,
  Compass,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  KeyRound,
  Edit3
} from 'lucide-react';
import { Container } from '../common/Container';
import { HeroServiceOptions } from './HeroServiceOptions';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { VEHICLES } from '../../data/vehicles';
import { CHAUFFEUR_CARS } from '../car-driver/CarDriverFleetGrid';
import { DRIVERS } from '../../data/drivers';
import { ALL_BIKES } from '../../data/catalog';
import { ALL_TOUR_PACKAGES } from '../packages/ToursGrid';

// Active available fleet cars
const AVAILABLE_CARS = VEHICLES.filter((v) => v.isAvailable !== false);

export const Hero = ({ onOpenQuickBook }) => {
  const navigate = useNavigate();

  // 1. Service Selection (Default: Self-Drive Car)
  const [activeTab, setActiveTab] = useState('self-drive-car');

  // 2. Specific Item Selection based on Service
  const [selectedCarId, setSelectedCarId] = useState(AVAILABLE_CARS[0]?.id || 'car-swift-2026');
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(CHAUFFEUR_CARS[0]?.id || 'ch-car-1');
  const [selectedDriverId, setSelectedDriverId] = useState(DRIVERS[0]?.id || 'driver-1');
  const [selectedBikeId, setSelectedBikeId] = useState(ALL_BIKES[0]?.id || 'bike-1');
  const [selectedTourId, setSelectedTourId] = useState(ALL_TOUR_PACKAGES[0]?.id || 'tour-1');

  // 3. Location Fields (Bhubaneswar Hubs)
  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');
  const [dropLocation, setDropLocation] = useState('Same as Pick-up Location');

  // 4. Dates & Times
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-15');
  const [returnTime, setReturnTime] = useState('18:00');

  const tabs = [
    {
      id: 'self-drive-car',
      label: 'Self-Drive Car',
      badge: 'Active Fleet',
      icon: Car,
      route: '/car-self-ride',
      cta: 'Book Self-Drive Car'
    },
    {
      id: 'car-with-driver',
      label: 'Car with Driver',
      badge: 'Chauffeur Fleet',
      icon: Shield,
      route: '/car-with-driver',
      cta: 'Book Car with Driver'
    },
    {
      id: 'driver-only',
      label: 'Driver Only',
      badge: 'Verified Pilots',
      icon: UserCheck,
      route: '/driver-only',
      cta: 'Hire Verified Driver'
    },
    {
      id: 'self-drive-bike',
      label: 'Self-Drive Bike',
      badge: 'Coming Soon',
      icon: Bike,
      route: '/bike-rental',
      cta: 'Pre-Book Bike via WhatsApp'
    },
    {
      id: 'tour-packages',
      label: 'Tour Packages',
      badge: 'Odisha Tours',
      icon: Compass,
      route: '/tours-packages',
      cta: 'Explore Tour Packages'
    },
  ];

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  // Resolve currently chosen item object
  const currentSelectedItem = useMemo(() => {
    switch (activeTab) {
      case 'car-with-driver': {
        const car = CHAUFFEUR_CARS.find((c) => c.id === selectedChauffeurId) || CHAUFFEUR_CARS[0];
        return {
          ...car,
          driver: {
            ...car.driver,
            name: 'Provided by Company'
          }
        };
      }
      case 'driver-only':
        return {
          id: 'driver-company',
          name: 'Verified Driver (Provided by Company)',
          dailyRate: 799,
          badge: 'Commercial Pilot',
          status: 'Provided by Company',
          experienceYears: 10,
        };
      case 'self-drive-bike':
        return ALL_BIKES.find((b) => b.id === selectedBikeId) || ALL_BIKES[0];
      case 'tour-packages':
        return ALL_TOUR_PACKAGES.find((t) => t.id === selectedTourId) || ALL_TOUR_PACKAGES[0];
      case 'self-drive-car':
      default:
        return AVAILABLE_CARS.find((c) => c.id === selectedCarId) || AVAILABLE_CARS[0];
    }
  }, [activeTab, selectedCarId, selectedChauffeurId, selectedDriverId, selectedBikeId, selectedTourId]);

  const effectivePickup = pickupLocation;
  const effectiveDrop = dropLocation === 'Same as Pick-up Location' ? pickupLocation : dropLocation;

  const handleSearch = (e) => {
    e.preventDefault();
    if (onOpenQuickBook) {
      onOpenQuickBook({
        serviceType: activeTab,
        vehicle: currentSelectedItem,
        location: effectivePickup,
        pickupLocation: effectivePickup,
        dropLocation: effectiveDrop,
        pickupDate,
        returnDate,
      });
    } else {
      navigate(currentTabObj.route);
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-28 sm:pt-36 pb-16 sm:pb-24 bg-gradient-to-b from-white via-blue-50/30 to-white text-slate-900 flex items-center overflow-hidden">
      {/* 1. CLEAN WHITISH CAR BACKGROUND IMAGE */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/images/whitish-car-bg.jpg"
          alt="CARZODRIVE Premium Vehicle"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
        />
        {/* Soft White Gradient Overlays for crystal clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white" />
        <div className="absolute inset-0 bg-radial from-transparent via-white/50 to-white" />

        {/* Ambient Blue Auras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-sky-400/10 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10 text-center">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CARZODRIVE MOBILITY</span>
          </motion.div>

          {/* Large Clean Headline: Choose Your Way to Move */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.08]">
              Choose Your Way{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                to Move.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Rent self-drive cars, bikes, executive chauffeurs, and customized travel packages in seconds.
            </p>
          </motion.div>

          {/* 2. QUICK SERVICE REDIRECT OPTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full pt-1 pb-2"
          >
            <HeroServiceOptions
              activeService={activeTab}
              onSelectService={(serviceId) => setActiveTab(serviceId)}
            />
          </motion.div>

          {/* 3. HERO SEARCH & SERVICE SELECTION WIDGET (INSTANT AVAILABILITY & BOOKING) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl p-4 sm:p-7 shadow-[0_20px_60px_rgba(37,99,235,0.12)] text-left"
          >
            {/* Search Box Header Connected to Active Service */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wide uppercase">
                  Instant Availability & Booking — <span className="text-blue-600 font-extrabold">{currentTabObj.label}</span>
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Select your service, fleet & Bhubaneswar location below
              </span>
            </div>

            {/* SEARCH FORM INPUTS */}
            <form onSubmit={handleSearch} className="space-y-4 pt-5">
              {/* TOP ROW: Service Dropdown + Contextual Fleet Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Service Selection Dropdown */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-200/90 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      1. Select Service Category
                    </span>
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                      Service
                    </span>
                  </label>
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="self-drive-car">🚗 Self-Drive Car (Drive Yourself)</option>
                    <option value="car-with-driver">👔 Car with Driver (Executive Chauffeur Service)</option>
                    <option value="driver-only">🧑‍✈️ Driver Only (Hire Verified Driver for Your Own Car)</option>
                    <option value="self-drive-bike">🏍️ Self-Drive Bike (Coming Soon • Not Available)</option>
                    <option value="tour-packages">🌴 Tour Packages (Puri, Konark, Chilika Sightseeing)</option>
                  </select>
                </div>

                {/* 2. Contextual Fleet / Item Selector */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      {activeTab === 'driver-only' ? '2. Driver: Provided by Company' : activeTab === 'tour-packages' ? '2. Select Tour Itinerary' : activeTab === 'self-drive-bike' ? '2. Select Bike Model (Coming Soon)' : '2. Select Available Fleet'}
                    </span>
                    {activeTab === 'self-drive-bike' ? (
                      <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Available
                      </span>
                    )}
                  </label>

                  {activeTab === 'self-drive-car' && (
                    <select
                      value={selectedCarId}
                      onChange={(e) => setSelectedCarId(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
                    >
                      {AVAILABLE_CARS.map((c) => (
                        <option key={c.id} value={c.id}>
                          🟢 {c.name} ({c.color || 'Available'}) • {c.priceDisplay || `₹${c.pricePerDay}`}/day
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === 'car-with-driver' && (
                    <select
                      value={selectedChauffeurId}
                      onChange={(e) => setSelectedChauffeurId(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
                    >
                      {CHAUFFEUR_CARS.map((c) => (
                        <option key={c.id} value={c.id}>
                          🟢 {c.name} ({c.price}) • Driver: Provided by Company
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === 'driver-only' && (
                    <select
                      value="provided-by-company"
                      disabled
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-default truncate"
                    >
                      <option value="provided-by-company">
                        🟢 Verified Commercial Driver (Provided by Company • ₹799/day)
                      </option>
                    </select>
                  )}

                  {activeTab === 'self-drive-bike' && (
                    <select
                      value={selectedBikeId}
                      onChange={(e) => setSelectedBikeId(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
                    >
                      {ALL_BIKES.map((b) => (
                        <option key={b.id || b.name} value={b.id || b.name}>
                          🔴 {b.name} (Coming Soon • Not Available)
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === 'tour-packages' && (
                    <select
                      value={selectedTourId}
                      onChange={(e) => setSelectedTourId(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
                    >
                      {ALL_TOUR_PACKAGES.map((t) => (
                        <option key={t.id} value={t.id}>
                          🟢 {t.title} ({t.startingPrice}) • {t.duration}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* SECOND ROW: Locations + Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
                {/* 3. Pick-up Location Dropdown */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pick-up Location</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {BHUBANESWAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        📍 {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Drop-off Location Dropdown */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Drop-off Location</span>
                  </label>
                  <select
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Same as Pick-up Location">🔄 Same as Pick-up Location</option>
                    {BHUBANESWAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        📍 {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Pickup Date & Time */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pick-up Date & Time</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer w-20"
                    />
                  </div>
                </div>

                {/* 6. Return Date & Time */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Return Date & Time</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer w-20"
                    />
                  </div>
                </div>
              </div>

              {activeTab === 'self-drive-bike' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span>Two-Wheeler Fleet Coming Soon — All bike & scooty models are currently unavailable for online booking.</span>
                  </div>
                  <Link
                    to="/bike-rental"
                    className="font-black text-blue-700 hover:text-blue-800 underline shrink-0"
                  >
                    View Bike Fleet & Pre-Book →
                  </Link>
                </div>
              )}

              {/* BOTTOM ACTIONS & GUARANTEES */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free cancellation up to 6 hours before pickup • Zero advance payment required</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    to={currentTabObj.route}
                    className="px-5 py-3 rounded-xl border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 transition-all hidden md:inline-flex items-center gap-1.5"
                  >
                    <span>Browse All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {activeTab === 'self-drive-bike' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-400 bg-slate-100 border border-slate-200 opacity-50 cursor-not-allowed select-none text-center"
                      title="Bike rental is currently not available for booking"
                    >
                      Bikes Coming Soon (Not Available)
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.6)] border border-blue-400/30 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Instant Book & Check Availability</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>

          {/* 4. TRUST PILLS (WHITE & BLUE) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>100% Insured Fleet</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Zero Security Deposit Option</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Doorstep Delivery in 45 Mins</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>24/7 Roadside Concierge</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
