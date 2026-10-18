import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Shield, UserCheck, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';
import { vehiclesAPI, bikesAPI, packagesAPI } from '../../services/api';
import { HeroServiceTabs } from './HeroServiceTabs';
import { HeroSearchConsole } from './HeroSearchConsole';

const SERVICE_META = {
  'self-drive-car': {
    icon: Car,
    route: '/car-self-ride',
    ctaText: 'Search Self-Drive Cars',
    badge: 'Live Fleet',
  },
  'car-with-driver': {
    icon: Shield,
    route: '/car-with-driver',
    ctaText: 'Search Chauffeur Fleet',
    badge: 'Executive',
  },
  'driver-only': {
    icon: UserCheck,
    route: '/driver-only',
    ctaText: 'Hire Verified Driver',
    badge: '₹799/Day',
  },
  'self-drive-bike': {
    icon: Bike,
    route: '/bike-rental',
    ctaText: 'Pre-Book Bike',
    badge: 'Coming Soon',
  },
  'tour-packages': {
    icon: Compass,
    route: '/tours-packages',
    ctaText: 'Explore Tour Packages',
    badge: 'Odisha Tours',
  },
};

const ROTATING_WORDS = ['Freedom.', 'World.', 'Comfort.', 'Adventure.'];

export const Hero = ({ onOpenQuickBook }) => {
  const navigate = useNavigate();

  // 1. Service Selection
  const [activeTab, setActiveTab] = useState('self-drive-car');

  // Animated rotating text state
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  // 2. Dynamic Database Fleet State
  const [dbCars, setDbCars] = useState([]);
  const [dbBikes, setDbBikes] = useState([]);
  const [dbTours, setDbTours] = useState([]);

  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedChauffeurId, setSelectedChauffeurId] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [selectedTourId, setSelectedTourId] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadHeroFleet() {
      try {
        const [carsRes, bikesRes, toursRes] = await Promise.allSettled([
          vehiclesAPI.getAll(),
          bikesAPI.getAll(),
          packagesAPI.getAll(),
        ]);

        if (isMounted) {
          if (carsRes.status === 'fulfilled' && carsRes.value?.data?.length > 0) {
            const cars = carsRes.value.data.map((c) => ({
              id: c.slug || c._id || c.id,
              rawId: c._id,
              name: c.name,
              color: c.color || 'Available',
              pricePerDay: c.pricing?.dailyRate || c.pricePerDay || 1499,
              priceDisplay: `₹${(c.pricing?.dailyRate || c.pricePerDay || 1499).toLocaleString('en-IN')}`,
              image: (c.images && c.images[0]) || c.image || '/images/vehicles/swift-2026-grey.jpg',
              seats: `${c.seats || 5} Seats`,
              rawVehicle: c,
            }));
            setDbCars(cars);
            setSelectedCarId(cars[0].id);
            setSelectedChauffeurId(cars[0].id);
          }

          if (bikesRes.status === 'fulfilled' && bikesRes.value?.data?.length > 0) {
            const bikes = bikesRes.value.data.map((b) => ({
              id: b.slug || b._id || b.id,
              rawId: b._id,
              name: b.name,
              pricePerDay: b.pricing?.dailyRate || 499,
              priceDisplay: `₹${(b.pricing?.dailyRate || 499).toLocaleString('en-IN')}`,
              image: (b.images && b.images[0]) || b.image,
              rawBike: b,
            }));
            setDbBikes(bikes);
            setSelectedBikeId(bikes[0].id);
          }

          if (toursRes.status === 'fulfilled' && toursRes.value?.data?.length > 0) {
            const tours = toursRes.value.data.map((p) => ({
              id: p.slug || p._id || p.id,
              rawId: p._id,
              name: p.name,
              destination: p.destination,
              startingPrice: `₹${(p.pricing?.adultPrice || 5499).toLocaleString('en-IN')}`,
              duration: typeof p.duration === 'object' ? `${p.duration.days || 2}D / ${p.duration.nights || 1}N` : p.duration,
              rawTour: p,
            }));
            setDbTours(tours);
            setSelectedTourId(tours[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load hero fleet from DB:', err);
      }
    }
    loadHeroFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Location Fields
  const [pickupLocation, setPickupLocation] = useState(BHUBANESWAR_LOCATIONS[0] || 'SUM Hospital');
  const [dropLocation, setDropLocation] = useState('Same as Pick-up Location');

  // 4. Dates & Times
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-15');
  const [returnTime, setReturnTime] = useState('18:00');

  const activeService = SERVICE_OPTIONS.find((s) => s.id === activeTab) || SERVICE_OPTIONS[0];
  const activeMeta = SERVICE_META[activeTab] || SERVICE_META['self-drive-car'];

  // Resolve currently chosen item object
  const currentSelectedItem = useMemo(() => {
    switch (activeTab) {
      case 'car-with-driver': {
        const car = dbCars.find((c) => c.id === selectedChauffeurId) || dbCars[0];
        return {
          ...car,
          driver: {
            name: 'Provided by Company',
          },
        };
      }
      case 'driver-only':
        return {
          id: 'driver-company',
          name: 'Verified Driver (Provided by Company)',
          brand: 'Carzodrive Verified',
          dailyRate: 799,
          priceDisplay: '₹799',
          badge: 'Commercial Pilot',
          status: 'Provided by Company',
          experienceYears: 10,
        };
      case 'self-drive-bike':
        return dbBikes.find((b) => b.id === selectedBikeId) || dbBikes[0];
      case 'tour-packages':
        return dbTours.find((t) => t.id === selectedTourId) || dbTours[0];
      case 'self-drive-car':
      default:
        return dbCars.find((c) => c.id === selectedCarId) || dbCars[0];
    }
  }, [activeTab, dbCars, dbBikes, dbTours, selectedCarId, selectedChauffeurId, selectedBikeId, selectedTourId]);

  const effectivePickup = pickupLocation;
  const effectiveDrop = dropLocation === 'Same as Pick-up Location' ? pickupLocation : dropLocation;

  const handleSearch = (e) => {
    if (e?.preventDefault) e.preventDefault();
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
      navigate(activeMeta.route);
    }
  };

  return (
    <section className="relative pt-[70px] sm:pt-[82px] pb-6 sm:pb-12 bg-slate-950 text-white flex flex-col justify-center overflow-hidden border-b border-white/10 min-h-[88vh]">
      {/* 1. ANIMATED 3D CARZODRIVE PHOTO AS BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-slate-950" />
        <motion.div
          initial={{ scale: 1.0 }}
          animate={{
            scale: [1.0, 1.05, 1.0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroBgImage}
            alt="CARZODRIVE 3D Chrome Background"
            className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.18] saturate-[1.20] select-none"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/35 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_85%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-cyan-400/22 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[260px] bg-blue-600/18 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          animate={{ x: ['-120%', '240%'] }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
          className="absolute -inset-y-full w-1/4 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent -skew-x-12 pointer-events-none blur-2xl"
        />
      </div>

      {/* 2. PRIMARY CONTENT CONTAINER */}
      <Container className="relative z-10 w-full px-3.5 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center space-y-3.5 sm:space-y-5 text-center">
          {/* ANIMATED HEADLINE & STATUS BADGE */}
          <div className="space-y-1.5 sm:space-y-2 max-w-3xl mx-auto pt-0.5 sm:pt-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-400/40 text-cyan-300 text-[10.5px] sm:text-xs font-black tracking-wider sm:tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] backdrop-blur-xl"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse" />
              <span>BHUBANESWAR'S #1 MOBILITY PLATFORM</span>
            </motion.div>

            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                <span>Drive Your </span>
                <span className="relative inline-flex overflow-hidden align-bottom min-h-[1.2em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ROTATING_WORDS[wordIndex]}
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -25, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                    >
                      {ROTATING_WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeService.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11.5px] sm:text-sm md:text-base text-slate-200 font-medium max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] px-1"
                >
                  {activeService.tagline} • Zero Security Deposit Option
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* 3. THE 5 SERVICE OPTIONS */}
          <HeroServiceTabs
            activeTab={activeTab}
            onTabSelect={setActiveTab}
            serviceMeta={SERVICE_META}
          />

          {/* 4. UNIFIED BOOKING SEARCH CONSOLE */}
          <HeroSearchConsole
            activeTab={activeTab}
            activeService={activeService}
            activeMeta={activeMeta}
            dbCars={dbCars}
            dbBikes={dbBikes}
            dbTours={dbTours}
            selectedCarId={selectedCarId}
            setSelectedCarId={setSelectedCarId}
            selectedChauffeurId={selectedChauffeurId}
            setSelectedChauffeurId={setSelectedChauffeurId}
            selectedBikeId={selectedBikeId}
            setSelectedBikeId={setSelectedBikeId}
            selectedTourId={selectedTourId}
            setSelectedTourId={setSelectedTourId}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            dropLocation={dropLocation}
            setDropLocation={setDropLocation}
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            returnTime={returnTime}
            setReturnTime={setReturnTime}
            handleSearch={handleSearch}
          />

          {/* 5. TRUST PILLS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-300"
          >
            <div className="flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">100% Insured Fleet</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">₹0 Security Deposit</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Delivery in 45 Mins</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 border border-slate-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">4.9★ (2,400+ Trips)</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
