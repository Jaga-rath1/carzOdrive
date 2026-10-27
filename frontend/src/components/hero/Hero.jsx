import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import carzodriveLogo from '../../assets/carzodrive-logo.png';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';
import { vehiclesAPI, bikesAPI, packagesAPI } from '../../services/api';
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
    route: '/car-self-ride',
    ctaText: 'Search Self-Drive Cars',
    badge: 'Live Fleet',
  },
  'car-with-driver': {
    icon: WithDriverIcon,
    route: '/car-with-driver',
    ctaText: 'Search With-Driver Fleet',
    badge: 'Executive',
  },
  'driver-only': {
    icon: DriverPilotIcon,
    route: '/driver-only',
    ctaText: 'Hire Verified Driver',
    badge: '₹799/Day',
  },
  'self-drive-bike': {
    icon: BikeFleetIcon,
    route: '/bike-rental',
    ctaText: 'Pre-Book Bike',
    badge: 'Coming Soon',
  },
  'tour-packages': {
    icon: TourPackageIcon,
    route: '/tours-packages',
    ctaText: 'Explore Tour Packages',
    badge: 'Odisha Tours',
  },
};

const FALLBACK_CARS = [
  { id: 'swift-2026', name: 'Swift 2026 New Model', color: 'Magma Grey', pricePerDay: 1499, priceDisplay: '₹1,499', seats: '5 Seats', quantity: 5, availableCount: 5, isAvailable: true, image: '/images/vehicles/swift-2026-grey.jpg' },
  { id: 'baleno-alpha', name: 'Maruti Baleno Alpha', color: 'Nexa Blue', pricePerDay: 1599, priceDisplay: '₹1,599', seats: '5 Seats', quantity: 4, availableCount: 4, isAvailable: true, image: '/images/vehicles/swift-2026-grey.jpg' },
  { id: 'thar-4x4', name: 'Mahindra Thar 4x4 Hard Top', color: 'Napoli Black', pricePerDay: 3299, priceDisplay: '₹3,299', seats: '4 Seats', quantity: 2, availableCount: 2, isAvailable: true, image: '/images/vehicles/swift-2026-grey.jpg' },
  { id: 'scorpio-classic', name: 'Mahindra Scorpio Classic S11', color: 'Pearl White', pricePerDay: 2899, priceDisplay: '₹2,899', seats: '7 Seats', quantity: 0, availableCount: 0, isAvailable: false, image: '/images/vehicles/swift-2026-grey.jpg' },
  { id: 'creta-sx', name: 'Hyundai Creta SX (O)', color: 'Knight Black', pricePerDay: 2499, priceDisplay: '₹2,499', seats: '5 Seats', quantity: 3, availableCount: 3, isAvailable: true, image: '/images/vehicles/swift-2026-grey.jpg' },
  { id: 'innova-crysta', name: 'Toyota Innova Crysta ZX', color: 'Super White', pricePerDay: 3499, priceDisplay: '₹3,499', seats: '7 Seats', quantity: 0, availableCount: 0, isAvailable: false, image: '/images/vehicles/swift-2026-grey.jpg' },
];

export const Hero = ({ onOpenQuickBook }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { driverSettings } = useDriverSettings();

  // 1. Service Selection
  const [activeTab, setActiveTab] = useState('self-drive-car');

  // 2. Dynamic Database Fleet State with instant fallbacks
  const [dbCars, setDbCars] = useState(FALLBACK_CARS);
  const [dbBikes, setDbBikes] = useState([]);
  const [dbTours, setDbTours] = useState([]);

  const [selectedCarId, setSelectedCarId] = useState(FALLBACK_CARS[0].id);
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(FALLBACK_CARS[0].id);
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
            const cars = carsRes.value.data.map((c) => {
              const carCount = c.quantity !== undefined ? Number(c.quantity) : (c.availableCount ?? c.count ?? (c.isAvailable !== false ? 1 : 0));
              const isAvail = c.isAvailable !== false && carCount > 0 && c.availabilityStatus !== 'UNAVAILABLE' && c.availabilityStatus !== 'Currently Unavailable';
              return {
                id: c.slug || c._id || c.id,
                _id: c._id,
                rawId: c._id,
                vehicleId: c._id,
                name: c.name,
                color: c.color || 'Available',
                pricePerDay: c.pricing?.dailyRate || c.pricePerDay || 1499,
                priceDisplay: `₹${(c.pricing?.dailyRate || c.pricePerDay || 1499).toLocaleString('en-IN')}`,
                image: (c.images && c.images[0]) || c.image || '/images/vehicles/swift-2026-grey.jpg',
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

  return (
    <div className="w-full bg-gradient-to-b from-[#060D1E] via-[#091530] via-[#071127] to-[#040814] text-white relative overflow-hidden">
      {/* 1. STUDIO WHITE SPOTLIGHT DOME ON METALLIC LOGO */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[950px] h-[340px] bg-gradient-to-b from-white/20 via-sky-300/12 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* 2. SAPPHIRE BLUE & ELECTRIC CYAN AMBIENT BACKLIGHT */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1200px] h-[450px] bg-gradient-to-r from-blue-600/30 via-cyan-400/22 to-blue-700/30 rounded-full blur-[135px] pointer-events-none" />
      <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[550px] sm:w-[850px] h-[280px] bg-sky-500/18 rounded-full blur-[110px] pointer-events-none" />

      {/* 3. REFINED AUTOMOTIVE CYBER MESH */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.35) 1px, transparent 1px), linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)`,
          backgroundSize: '36px 36px, 36px 36px, 36px 36px',
        }}
      />

      {/* HERO SECTION WITH BOLD 3D CARZODRIVE PNG EMBLEM & BOOKING CONSOLE */}
      <section className="relative z-10 w-full pt-[76px] sm:pt-[88px] pb-8 sm:pb-12 border-b border-white/10">
        <Container className="w-full px-3.5 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* 1. CLEAN PROPORTIONED 3D METALLIC CARZODRIVE PNG EMBLEM */}
            <div className="w-full flex items-center justify-center pt-1 pb-1 overflow-visible">
              <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex items-center justify-center">
                <img
                  src={carzodriveLogo}
                  alt="CARZODRIVE — Drive Your World"
                  className="w-auto h-auto max-h-[190px] sm:max-h-[240px] md:max-h-[290px] lg:max-h-[330px] scale-x-[1.08] sm:scale-x-[1.12] object-contain drop-shadow-[0_18px_50px_rgba(0,210,255,0.35)] filter brightness-[1.04] contrast-[1.06] select-none block origin-center"
                  loading="eager"
                />
              </div>
            </div>

            {/* 2. THE 5 SERVICE OPTIONS TABS (ALIGNED DIRECTLY UNDER LOGO) */}
            <div className="w-full mt-2 sm:mt-3 mb-2.5 sm:mb-3.5">
              <HeroServiceTabs
                activeTab={activeTab}
                onTabSelect={setActiveTab}
                serviceMeta={SERVICE_META}
              />
            </div>

            {/* 3. UNIFIED INSTANT BOOKING SEARCH CONSOLE */}
            <div className="w-full">
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
            </div>

            {/* 4. TRUST GUARANTEE PILLS */}
            <div className="w-full grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-300 pt-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-slate-200 font-semibold">100% Insured Fleet</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-slate-200 font-semibold">₹0 Security Deposit</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-slate-200 font-semibold">Delivery in 45 Mins</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-slate-200 font-semibold">4.9★ (2,400+ Trips)</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
