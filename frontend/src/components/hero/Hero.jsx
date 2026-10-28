import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import carzodriveLogo from '../../assets/carzodrive-logo.png';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';
import { vehiclesAPI, bikesAPI, packagesAPI, driversAPI } from '../../services/api';
import { getTodayDateString, getCurrentTimeString } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { HeroServiceTabs } from './HeroServiceTabs';
import { HeroSearchConsole } from './HeroSearchConsole';
import {
  SelfDriveCarIcon,
  WithDriverIcon,
  DriverPilotIcon,
  BikeFleetIcon,
  TourPackageIcon,
} from './HeroServiceIcons';

import { useDriverSettings } from '../../hooks/useDriverSettings';

const SERVICE_META = {
  'self-drive-car': {
    icon: SelfDriveCarIcon,
    image: '/images/services/self-drive-car.png',
    route: '/car-self-ride',
    ctaText: 'Search Self-Drive Cars',
    badge: 'Live Fleet',
    tagline: 'Drive Your Way',
  },
  'car-with-driver': {
    icon: WithDriverIcon,
    image: '/images/services/car-with-driver.png',
    route: '/car-with-driver',
    ctaText: 'Search With-Driver Fleet',
    badge: 'Executive',
    tagline: 'Rent & Ride',
  },
  'driver-only': {
    icon: DriverPilotIcon,
    image: '/images/services/driver-only.png',
    route: '/driver-only',
    ctaText: 'Hire Verified Driver',
    badge: '₹799/Day',
    tagline: 'Verified Drivers',
  },
  'self-drive-bike': {
    icon: BikeFleetIcon,
    image: '/images/services/self-drive-bike.png',
    route: '/bike-rental',
    ctaText: 'Pre-Book Bike',
    badge: 'Coming Soon',
    tagline: 'Ride the Freedom',
  },
  'tour-packages': {
    icon: TourPackageIcon,
    image: '/images/services/tour-packages.png',
    route: '/tours-packages',
    ctaText: 'Explore Tour Packages',
    badge: 'Odisha Tours',
    tagline: 'Explore More',
  },
};

// Real Database & Cloudinary vehicles as instant high-resolution defaults
const FALLBACK_CARS = [
  { id: 'creta-sx', name: 'Hyundai Creta', category: 'suv', color: 'Knight Black', pricePerDay: 2499, priceDisplay: '₹2,499', seats: '5 Seats', quantity: 8, availableCount: 8, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1793001791/carzodrive/cars/car-main-1793001789245-86ca636d.jpg' },
  { id: 'swift-new', name: 'Maruti Suzuki Swift', category: 'hatchback', color: 'Magma Grey', pricePerDay: 1499, priceDisplay: '₹1,499', seats: '5 Seats', quantity: 5, availableCount: 5, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1793001974/carzodrive/cars/car-main-1793001972073-6c682a6c.jpg' },
  { id: 'thar-4x4', name: 'Mahindra Thar 4x4', category: 'luxury', color: 'Napoli Black', pricePerDay: 3299, priceDisplay: '₹3,299', seats: '4 Seats', quantity: 6, availableCount: 6, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1792772183/carzodrive/cars/car-main-1792772159781-4249df0c.jpg' },
  { id: 'kia-sonet', name: 'Kia Sonet', category: 'suv', color: 'Glacier White', pricePerDay: 1899, priceDisplay: '₹1,899', seats: '5 Seats', quantity: 8, availableCount: 8, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1793001904/carzodrive/cars/car-main-1793001901616-cda93cca.jpg' },
  { id: 'tata-punch', name: 'Tata Punch', category: 'suv', color: 'Tropical Mist', pricePerDay: 1599, priceDisplay: '₹1,599', seats: '5 Seats', quantity: 8, availableCount: 8, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1793001842/carzodrive/cars/car-main-1793001834294-0ebc139b.jpg' },
  { id: 'fortuner-suv', name: 'Toyota Fortuner', category: 'luxury', color: 'Super White', pricePerDay: 4499, priceDisplay: '₹4,499', seats: '7 Seats', quantity: 4, availableCount: 4, isAvailable: true, image: 'https://res.cloudinary.com/gjjtie9o/image/upload/v1792779598/carzodrive/cars/car-main-1792779591435-ee911a8b.jpg' },
];

export const Hero = ({ onOpenQuickBook }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { driverSettings } = useDriverSettings();

  // ScrollTrigger Parallax & Scaling transforms
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  const logoScale = useTransform(smoothProgress, [0, 0.45, 1], [1, 0.95, 0.88]);
  const logoY = useTransform(smoothProgress, [0, 0.7], [0, 24]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.95], [1, 0.75]);
  const orb1Y = useTransform(smoothProgress, [0, 1], [0, 140]);
  const orb2Y = useTransform(smoothProgress, [0, 1], [0, -90]);
  const consoleY = useTransform(smoothProgress, [0, 0.5], [0, -10]);
  const consoleScale = useTransform(smoothProgress, [0, 0.5], [1, 0.995]);
  const pillsY = useTransform(smoothProgress, [0, 0.6], [0, 12]);

  // 1. Service Selection
  const [activeTab, setActiveTab] = useState('self-drive-car');

  // 2. Dynamic Database Fleet State with instant Cloudinary fallbacks
  const [dbCars, setDbCars] = useState(FALLBACK_CARS);
  const [dbBikes, setDbBikes] = useState([]);
  const [dbTours, setDbTours] = useState([]);
  const [dbDrivers, setDbDrivers] = useState([]);

  const [selectedCarId, setSelectedCarId] = useState(FALLBACK_CARS[0].id);
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(FALLBACK_CARS[0].id);
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [selectedTourId, setSelectedTourId] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadHeroFleet() {
      try {
        const [carsRes, bikesRes, toursRes, driversRes] = await Promise.allSettled([
          vehiclesAPI.getAll(),
          bikesAPI.getAll(),
          packagesAPI.getAll(),
          driversAPI.getAll(),
        ]);

        if (isMounted) {
          if (carsRes.status === 'fulfilled' && carsRes.value?.data?.length > 0) {
            const cars = carsRes.value.data.map((c) => {
              const carCount = c.quantity !== undefined ? Number(c.quantity) : (c.availableCount ?? c.count ?? (c.isAvailable !== false ? 1 : 0));
              const isAvail = c.isAvailable !== false && carCount > 0 && c.availabilityStatus !== 'UNAVAILABLE' && c.availabilityStatus !== 'Currently Unavailable';
              return {
                id: c.slug || c._id || c.id,
                _id: c._id,
                rawId: c._id,
                vehicleId: c._id,
                name: c.name,
                category: c.category || 'suv',
                color: c.color || 'Available',
                pricePerDay: c.pricing?.dailyRate || c.pricePerDay || 1499,
                priceDisplay: `₹${(c.pricing?.dailyRate || c.pricePerDay || 1499).toLocaleString('en-IN')}`,
                image: (c.images && c.images[0]) || c.image || 'https://res.cloudinary.com/gjjtie9o/image/upload/v1793001791/carzodrive/cars/car-main-1793001789245-86ca636d.jpg',
                seats: `${c.seats || 5} Seats`,
                quantity: carCount,
                availableCount: carCount,
                isAvailable: isAvail,
                rawVehicle: c,
              };
            });
            setDbCars(cars);
            const firstAvail = cars.find((c) => c.isAvailable) || cars[0];
            setSelectedCarId(firstAvail?.id || cars[0]?.id);
            setSelectedChauffeurId(firstAvail?.id || cars[0]?.id);
          }

          if (bikesRes.status === 'fulfilled' && bikesRes.value?.data?.length > 0) {
            const bikes = bikesRes.value.data.map((b) => {
              const bikeCount = b.quantity !== undefined ? Number(b.quantity) : (b.availableCount ?? b.count ?? (b.isAvailable !== false ? 1 : 0));
              const isAvail = b.isAvailable !== false && bikeCount > 0 && b.availabilityStatus !== 'UNAVAILABLE' && b.availabilityStatus !== 'Currently Unavailable';
              return {
                id: b.slug || b._id || b.id,
                _id: b._id,
                rawId: b._id,
                bikeId: b._id,
                name: b.name,
                pricePerDay: b.pricing?.dailyRate || 499,
                priceDisplay: `₹${(b.pricing?.dailyRate || 499).toLocaleString('en-IN')}`,
                image: (b.images && b.images[0]) || b.image,
                quantity: bikeCount,
                availableCount: bikeCount,
                isAvailable: isAvail,
                rawBike: b,
              };
            });
            setDbBikes(bikes);
            setSelectedBikeId(bikes[0].id);
          }

          if (driversRes.status === 'fulfilled' && driversRes.value?.data?.length > 0) {
            setDbDrivers(driversRes.value.data);
          }

          if (toursRes.status === 'fulfilled' && toursRes.value?.data?.length > 0) {
            const tours = toursRes.value.data.map((p) => ({
              id: p.slug || p._id || p.id,
              _id: p._id,
              rawId: p._id,
              packageId: p._id,
              name: p.name,
              destination: p.destination,
              startingPrice: `₹${(p.pricing?.adultPrice || 5499).toLocaleString('en-IN')}`,
              duration: typeof p.duration === 'object' ? `${p.duration.days || 2}D / ${p.duration.nights || 1}N` : p.duration,
              isAvailable: true,
              availableCount: 10,
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

  // 4. Dates & Times (Default to current future Date.now and Time.now)
  const [pickupDate, setPickupDate] = useState(() => getTodayDateString(0));
  const [pickupTime, setPickupTime] = useState(() => getCurrentTimeString(30));
  const [returnDate, setReturnDate] = useState(() => getTodayDateString(2));
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
      case 'driver-only': {
        const rate = driverSettings?.dailyRate || 799;
        return {
          id: 'driver-company',
          name: 'Verified Driver (Provided by Company)',
          brand: 'Carzodrive Verified',
          dailyRate: rate,
          priceDisplay: `₹${rate}`,
          badge: 'Commercial Pilot',
          status: 'Provided by Company',
          experienceYears: 10,
        };
      }
      case 'self-drive-bike':
        return dbBikes.find((b) => b.id === selectedBikeId) || dbBikes[0];
      case 'tour-packages':
        return dbTours.find((t) => t.id === selectedTourId) || dbTours[0];
      case 'self-drive-car':
      default:
        return dbCars.find((c) => c.id === selectedCarId) || dbCars[0];
    }
  }, [activeTab, dbCars, dbBikes, dbTours, selectedCarId, selectedChauffeurId, selectedBikeId, selectedTourId, driverSettings?.dailyRate]);

  // Dynamic live service showcase mapped directly from Database & Cloudinary
  const serviceData = useMemo(() => {
    const selfDriveCar = dbCars.find((c) => c.isAvailable) || dbCars[0];
    const chauffeurCar = dbCars.find((c) => (c.category === 'luxury' || c.category === 'sedan') && c.isAvailable) || dbCars[1] || dbCars[0];
    const bike = dbBikes[0];
    const tour = dbTours[0];

    return {
      'self-drive-car': {
        image: '/images/services/self-drive-car.png',
        vehiclePhoto: selfDriveCar?.image,
        title: selfDriveCar?.name || 'Self-Drive Fleet',
        tagline: 'Drive Your Way',
        badge: 'Live Fleet',
        rate: selfDriveCar?.priceDisplay || (selfDriveCar?.pricePerDay ? `₹${selfDriveCar.pricePerDay}/d` : '₹1,499/d'),
      },
      'car-with-driver': {
        image: '/images/services/car-with-driver.png',
        vehiclePhoto: chauffeurCar?.image,
        title: chauffeurCar?.name || 'Car With Chauffeur',
        tagline: 'Rent & Ride',
        badge: 'Executive',
        rate: chauffeurCar?.priceDisplay || (chauffeurCar?.pricePerDay ? `₹${chauffeurCar.pricePerDay}/d` : '₹1,999/d'),
      },
      'driver-only': {
        image: '/images/services/driver-only.png',
        title: 'Verified Commercial Pilot',
        tagline: 'Verified Drivers',
        badge: '₹799/Day',
        rate: driverSettings?.badgeText || `₹${driverSettings?.dailyRate || 799}/Day`,
      },
      'self-drive-bike': {
        image: '/images/services/self-drive-bike.png',
        vehiclePhoto: bike?.image,
        title: bike?.name || 'Cruisers & Sportbikes',
        tagline: 'Ride the Freedom',
        badge: 'Coming Soon',
        rate: bike?.priceDisplay || (bike?.pricePerDay ? `₹${bike.pricePerDay}/d` : '₹499/d'),
      },
      'tour-packages': {
        image: '/images/services/tour-packages.png',
        vehiclePhoto: tour?.image || tour?.rawTour?.image,
        title: tour?.name || tour?.title || 'Odisha Heritage & Coast',
        tagline: 'Explore More',
        badge: 'Odisha Tours',
        rate: tour?.startingPrice || 'From ₹5,499',
      },
    };
  }, [dbCars, dbBikes, dbTours, driverSettings]);

  const effectivePickup = pickupLocation;
  const effectiveDrop = dropLocation === 'Same as Pick-up Location' ? pickupLocation : dropLocation;

  const handleSearch = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
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

  const handleServiceSelect = (tabId) => {
    setActiveTab(tabId);
    setTimeout(() => {
      const el = document.getElementById('hero-booking-console');
      if (el) {
        const yOffset = -95;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 40);
  };

  return (
    <div
      ref={heroRef}
      className="w-full bg-gradient-to-b from-[#eef6ff] via-[#f8fafc] to-white text-slate-900 relative overflow-hidden"
    >
      {/* 1. STUDIO CEILING SKY DIFFUSED SPOTLIGHT WITH PARALLAX */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-[650px] sm:w-[1100px] h-[450px] bg-gradient-to-b from-sky-200/55 via-blue-200/35 to-transparent rounded-full blur-[100px] pointer-events-none will-change-transform"
      />

      {/* 2. ELECTRIC CYAN & SAPPHIRE SHOWROOM ACCENT REFRACTION */}
      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1250px] h-[450px] bg-gradient-to-r from-blue-400/20 via-cyan-300/30 to-indigo-300/20 rounded-full blur-[130px] pointer-events-none will-change-transform"
      />
      <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] bg-sky-200/35 rounded-full blur-[100px] pointer-events-none" />

      {/* 3. PRECISION AUTOMOTIVE STUDIO GRID */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(2, 132, 199, 0.8) 1.5px, transparent 1.5px), linear-gradient(to right, rgba(2, 132, 199, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        }}
      />

      {/* HERO SECTION WITH BOLD 3D CARZODRIVE PNG EMBLEM & BOOKING CONSOLE */}
      <section className="relative z-10 w-full pt-[96px] sm:pt-[106px] md:pt-[114px] pb-8 sm:pb-12 border-b border-slate-200/80">
        <Container>
          <div className="w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center">
            {/* 1. SCROLL-TRIGGERED 3D METALLIC CARZODRIVE PNG EMBLEM */}
            <div className="w-full flex items-center justify-center pt-2 pb-2 overflow-visible">
              <motion.div
                style={{ scale: logoScale, y: logoY, opacity: logoOpacity }}
                className="w-full max-w-xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex items-center justify-center will-change-transform"
              >
                <img
                  src={carzodriveLogo}
                  alt="CARZODRIVE — Drive Your World"
                  className="w-auto h-auto max-h-[240px] sm:max-h-[300px] md:max-h-[360px] lg:max-h-[420px] xl:max-h-[460px] scale-x-[1.08] sm:scale-x-[1.12] object-contain drop-shadow-[0_24px_50px_rgba(2,132,199,0.3)] filter brightness-[1.02] contrast-[1.05] select-none block origin-center transition-all"
                  loading="eager"
                />
              </motion.div>
            </div>

            {/* 2. THE 5 SERVICE OPTIONS TABS (ALIGNED DIRECTLY UNDER LOGO) */}
            <div className="w-full mt-1.5 sm:mt-2 mb-2 sm:mb-3">
              <HeroServiceTabs
                activeTab={activeTab}
                onTabSelect={handleServiceSelect}
                serviceMeta={SERVICE_META}
                serviceData={serviceData}
              />
            </div>

            {/* 3. UNIFIED INSTANT BOOKING SEARCH CONSOLE WITH SCROLL-TRIGGERED FLOAT */}
            <motion.div
              id="hero-booking-console"
              style={{ y: consoleY, scale: consoleScale }}
              className="w-full scroll-mt-28 will-change-transform"
            >
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
                driverDailyRate={driverSettings?.dailyRate || 799}
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
                currentSelectedItem={currentSelectedItem}
                handleSearch={handleSearch}
              />
            </motion.div>

            {/* 4. TRUST GUARANTEE PILLS */}
            <motion.div
              style={{ y: pillsY }}
              className="w-full grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-700 pt-1 will-change-transform"
            >
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs hover:border-blue-500/50 hover:text-blue-700 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate text-slate-800 font-bold">100% Insured Fleet</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs hover:border-blue-500/50 hover:text-blue-700 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate text-slate-800 font-bold">₹0 Security Deposit</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs hover:border-blue-500/50 hover:text-blue-700 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate text-slate-800 font-bold">Delivery in 45 Mins</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs hover:border-blue-500/50 hover:text-blue-700 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate text-slate-800 font-bold">4.9★ (2,400+ Trips)</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
};
