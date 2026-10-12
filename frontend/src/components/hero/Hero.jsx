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
  CheckCircle2
} from 'lucide-react';
import { Container } from '../common/Container';
import { HeroServiceOptions } from './HeroServiceOptions';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { VEHICLES } from '../../data/vehicles';
import { CHAUFFEUR_CARS } from '../car-driver/CarDriverFleetGrid';
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
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(CHAUFFEUR_CARS[0]?.id || 'ch-creta-2026');
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
      label: 'Self Drive',
      badge: 'Active Fleet',
      icon: Car,
      route: '/car-self-ride',
      cta: 'Book Self-Drive Car'
    },
    {
      id: 'car-with-driver',
      label: 'Car Rental',
      badge: 'Chauffeur Fleet',
      icon: Shield,
      route: '/car-with-driver',
      cta: 'Book Car with Driver'
    },
    {
      id: 'self-drive-bike',
      label: 'Bike Rental',
      badge: 'Coming Soon',
      icon: Bike,
      route: '/bike-rental',
      cta: 'Pre-Book Bike via WhatsApp'
    },
    {
      id: 'driver-only',
      label: 'Driver Rental',
      badge: 'Verified Pilots',
      icon: UserCheck,
      route: '/driver-only',
      cta: 'Hire Verified Driver'
    },
    {
      id: 'tour-packages',
      label: 'Tour Package',
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
            ...car?.driver,
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
  }, [activeTab, selectedCarId, selectedChauffeurId, selectedBikeId, selectedTourId]);

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

  // Hotspot actions for buttons directly inside the 3D banner image
  return (
    <section className="relative min-h-[92vh] pt-24 sm:pt-28 pb-16 sm:pb-24 bg-gradient-to-b from-slate-950 via-[#060e20] to-slate-950 text-white flex flex-col justify-center overflow-hidden border-b border-white/10">
      {/* Dynamic Cyber-Luxury Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Ambient Cyan and Royal Blue Glow Auras */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyan-500/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 right-10 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px]" />

        {/* Subtle cyber grid lines in lower section */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_75%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* Primary Container Aligned Strictly to Header Max-Width (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8) */}
      <Container className="relative z-10 w-full">
        <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 text-center">

          {/* 1. SEAMLESS 3D CARZODRIVE PHOTO (Frameless, Crisp, Natural Aspect Ratio with Proper Spacing) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative flex flex-col items-center pt-2 sm:pt-4"
          >
            {/* Soft Ambient Cyan Back-Glow behind 3D Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none -z-10" />

            {/* Seamless 3D Artwork Image */}
            <img
              src={heroBgImage}
              alt="CARZODRIVE — Drive Your World"
              className="w-full h-auto max-h-[260px] sm:max-h-[320px] md:max-h-[380px] object-contain mx-auto select-none filter drop-shadow-[0_15px_35px_rgba(0,210,255,0.25)]"
            />
          </motion.div>

          {/* 2. THE 5 SERVICE BUTTONS DOCK (Exact Reference Button Layout with Cyan Glowing Dividers) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <HeroServiceOptions
              activeService={activeTab}
              onSelectService={(serviceId) => setActiveTab(serviceId)}
            />
          </motion.div>

          {/* 3. HERO SEARCH & SERVICE SELECTION WIDGET (Fully Aligned to Header Container Width) */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/25 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_25px_65px_rgba(0,0,0,0.6)] text-left relative overflow-hidden"
          >
            {/* Ambient subtle cyan accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF]" />

            {/* Widget Header with Status & Active Service Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00F0FF]" />
                <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                  Instant Availability & Booking —{' '}
                  <span className="text-cyan-400 font-extrabold">{currentTabObj.label}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium hidden md:inline">
                  Select fleet model & Bhubaneswar pickup location below
                </span>
                <Link
                  to={currentTabObj.route}
                  className="inline-flex items-center gap-1 text-xs font-black text-cyan-400 hover:text-white transition-colors"
                >
                  <span>Open {currentTabObj.label} Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* SEARCH FORM INPUTS */}
            <form onSubmit={handleSearch} className="space-y-4 pt-5">
              {/* TOP ROW: Service Category Dropdown + Contextual Fleet Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Service Selection Dropdown */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      1. Service Category
                    </span>
                    <span className="text-[9px] text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded-full">
                      5 Options
                    </span>
                  </label>
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="self-drive-car">🚗 Self Drive (Drive Yourself)</option>
                    <option value="car-with-driver">👔 Car Rental (Executive Chauffeur Service)</option>
                    <option value="self-drive-bike">🏍️ Bike Rental (Coming Soon • Not Available)</option>
                    <option value="driver-only">🧑‍✈️ Driver Rental (Verified Driver for Your Car)</option>
                    <option value="tour-packages">🌴 Tour Package (Puri, Konark, Chilika Sightseeing)</option>
                  </select>
                </div>

                {/* 2. Contextual Fleet / Item Selector */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-cyan-400" />
                      {activeTab === 'driver-only'
                        ? '2. Driver: Provided by Company'
                        : activeTab === 'tour-packages'
                        ? '2. Select Tour Itinerary'
                        : activeTab === 'self-drive-bike'
                        ? '2. Select Bike Model (Coming Soon)'
                        : '2. Select Available Fleet'}
                    </span>
                    {activeTab === 'self-drive-bike' ? (
                      <span className="text-[9px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                        Live Fleet
                      </span>
                    )}
                  </label>

                  {activeTab === 'self-drive-car' && (
                    <select
                      value={selectedCarId}
                      onChange={(e) => setSelectedCarId(e.target.value)}
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
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
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
                    >
                      {CHAUFFEUR_CARS.map((c) => (
                        <option
                          key={c.id}
                          value={c.id}
                          disabled={c.isAvailable === false}
                        >
                          {c.isAvailable !== false
                            ? `🟢 ${c.name} (${c.price}) • Available`
                            : `🔴 ${c.name} — Currently Unavailable`}
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === 'driver-only' && (
                    <select
                      value="provided-by-company"
                      disabled
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-default truncate"
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
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
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
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
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
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pick-up Location</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {BHUBANESWAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        📍 {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Drop-off Location Dropdown */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Drop-off Location</span>
                  </label>
                  <select
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
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
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pick-up Date & Time</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer w-20 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* 6. Return Date & Time */}
                <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Return Date & Time</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                    />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer w-20 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {activeTab === 'self-drive-bike' && (
                <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>Two-Wheeler Fleet Coming Soon — All bike & scooty models are currently unavailable for online booking.</span>
                  </div>
                  <Link
                    to="/bike-rental"
                    className="font-black text-cyan-300 hover:text-white underline shrink-0"
                  >
                    View Bike Fleet & Pre-Book →
                  </Link>
                </div>
              )}

              {/* BOTTOM ACTIONS & GUARANTEES */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free cancellation up to 6 hours before pickup • Zero advance payment required</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    to={currentTabObj.route}
                    className="px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 transition-all hidden md:inline-flex items-center gap-1.5"
                  >
                    <span>Browse All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {activeTab === 'self-drive-bike' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-500 bg-slate-900 border border-slate-800 opacity-60 cursor-not-allowed select-none text-center"
                      title="Bike rental is currently not available for booking"
                    >
                      Bikes Coming Soon (Not Available)
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:to-indigo-800 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] border border-cyan-400/40 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Instant Book & Check Availability</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>

          {/* 4. TRUST PILLS (CYBER GLASS) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-300"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>100% Insured Fleet</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero Security Deposit Option</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Doorstep Delivery in 45 Mins</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>24/7 Roadside Concierge</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
