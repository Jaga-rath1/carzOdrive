import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Printer,
  AlertCircle,
  Car,
  UserCheck,
  Bike,
  Compass,
  Edit3
} from 'lucide-react';
import { ALL_CARS, ALL_BIKES } from '../../data/catalog';
import { VEHICLES } from '../../data/vehicles';
import { CHAUFFEUR_CARS } from '../car-driver/CarDriverFleetGrid';
import { DRIVERS } from '../../data/drivers';
import { ALL_TOUR_PACKAGES } from '../packages/ToursGrid';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';
import { formatCurrency } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';

// Combined catalog fleet for self-drive cars (with 4 active vehicles prioritized)
const ALL_SELF_DRIVE_CARS = [
  ...VEHICLES.filter((v) => v.isAvailable !== false),
  ...ALL_CARS.filter((c) => !VEHICLES.some((v) => v.id === c.id || v.name === c.name)),
  ...VEHICLES.filter((v) => v.isAvailable === false),
];

const getTodayOffset = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const QuickBookingModal = ({
  isOpen,
  onClose,
  initialVehicle = null,
  initialData = {}
}) => {
  const [step, setStep] = useState(1);

  // 1. Service Type selection
  const [selectedService, setSelectedService] = useState('self-drive-car');

  // 2. Selected contextual item (Car, Chauffeur Car, Driver, Bike, Tour Package)
  const [selectedCar, setSelectedCar] = useState(ALL_SELF_DRIVE_CARS[0]);
  const [selectedChauffeurCar, setSelectedChauffeurCar] = useState(CHAUFFEUR_CARS[0]);
  const [selectedDriver, setSelectedDriver] = useState(DRIVERS[0]);
  const [selectedBike, setSelectedBike] = useState(ALL_BIKES[0]);
  const [selectedTour, setSelectedTour] = useState(ALL_TOUR_PACKAGES[0]);
  const [userCarModel, setUserCarModel] = useState(''); // For Driver-Only service

  // 3. Location fields (Bhubaneswar Hubs)
  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');
  const [dropoffLocation, setDropoffLocation] = useState('Same as Pick-up Address');

  // 4. Dates & Optional Protection
  const [pickupDate, setPickupDate] = useState(getTodayOffset(1));
  const [returnDate, setReturnDate] = useState(getTodayOffset(3));
  const [includeProtection, setIncludeProtection] = useState(false);

  // 5. Guest fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  // Detect and synchronize initial props whenever modal opens or changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialData?.serviceType) {
      const matched = SERVICE_OPTIONS.find((s) => s.id === initialData.serviceType || s.type === initialData.serviceType);
      if (matched) setSelectedService(matched.id);
    } else if (initialVehicle) {
      if (initialVehicle.driver || initialVehicle.type?.toLowerCase().includes('chauffeur')) {
        setSelectedService('car-with-driver');
        const found = CHAUFFEUR_CARS.find((c) => c.id === initialVehicle.id || c.name === initialVehicle.name);
        if (found) setSelectedChauffeurCar(found);
      } else if (initialVehicle.languages || initialVehicle.tripsCount || initialVehicle.specialties) {
        setSelectedService('driver-only');
        const found = DRIVERS.find((d) => d.id === initialVehicle.id || d.name === initialVehicle.name);
        if (found) setSelectedDriver(found);
      } else if (initialVehicle.category === 'Tour' || initialVehicle.destination) {
        setSelectedService('tour-packages');
        const found = ALL_TOUR_PACKAGES.find((t) => t.id === initialVehicle.id || t.title === initialVehicle.title);
        if (found) setSelectedTour(found);
      } else if (initialVehicle.vehicleType === 'bike' || initialVehicle.type === 'bike' || ALL_BIKES.some((b) => b.id === initialVehicle.id)) {
        setSelectedService('self-drive-bike');
        const found = ALL_BIKES.find((b) => b.id === initialVehicle.id || b.name === initialVehicle.name);
        if (found) setSelectedBike(found);
      } else {
        setSelectedService('self-drive-car');
        const found = ALL_SELF_DRIVE_CARS.find((c) => c.id === initialVehicle.id || c.name === initialVehicle.name);
        if (found) setSelectedCar(found);
      }
    }

    if (initialData?.pickupDate) setPickupDate(initialData.pickupDate);
    if (initialData?.returnDate) setReturnDate(initialData.returnDate);
    if (initialData?.location || initialData?.pickupLocation) {
      const loc = initialData.location || initialData.pickupLocation;
      if (BHUBANESWAR_LOCATIONS.includes(loc)) {
        setPickupLocation(loc);
      }
    }
    if (initialData?.dropLocation || initialData?.dropoffLocation) {
      const dropLoc = initialData.dropLocation || initialData.dropoffLocation;
      if (dropLoc === 'Same as Pick-up Address' || dropLoc === 'Same as Pickup' || dropLoc === pickupLocation) {
        setDropoffLocation('Same as Pick-up Address');
      } else if (BHUBANESWAR_LOCATIONS.includes(dropLoc)) {
        setDropoffLocation(dropLoc);
      }
    }
  }, [initialVehicle, initialData, isOpen]);

  // Dynamic day calculation based on user selected dates
  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
  }, [pickupDate, returnDate]);

  // Current active service definition
  const currentService = useMemo(() => {
    return SERVICE_OPTIONS.find((s) => s.id === selectedService) || SERVICE_OPTIONS[0];
  }, [selectedService]);

  // Effective Pick-up and Drop-off locations
  const effectivePickupLocation = pickupLocation;
  const effectiveDropoffLocation = dropoffLocation === 'Same as Pick-up Address' ? pickupLocation : dropoffLocation;

  // Active item details & price per day depending on selected service
  const { currentItemName, currentItemImage, ratePerDay, deposit, isAvailable, itemSubtitle } = useMemo(() => {
    switch (selectedService) {
      case 'car-with-driver': {
        const parsed = parseInt(String(selectedChauffeurCar?.price || '3499').replace(/[^0-9]/g, ''), 10) || 3499;
        return {
          currentItemName: selectedChauffeurCar?.name || 'Hyundai Creta (2026)',
          currentItemImage: selectedChauffeurCar?.image || '/images/vehicles/hyundai-creta-white.jpg',
          ratePerDay: parsed,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: selectedChauffeurCar?.isAvailable !== false,
          itemSubtitle: `${selectedChauffeurCar?.seats || '5 Seats'} • Driver: Provided by Company`
        };
      }
      case 'driver-only': {
        return {
          currentItemName: 'Verified Driver (Provided by Company)',
          currentItemImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
          ratePerDay: 799,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: true,
          itemSubtitle: 'Background-Verified Commercial Pilot • Provided by Company'
        };
      }
      case 'self-drive-bike': {
        const parsed = typeof selectedBike?.pricePerDay === 'number'
          ? selectedBike.pricePerDay
          : parseInt(String(selectedBike?.pricePerDay || '1299').replace(/[^0-9]/g, ''), 10) || 1299;
        return {
          currentItemName: selectedBike?.name || 'Royal Enfield Classic 350',
          currentItemImage: selectedBike?.image || '/images/vehicles/royal-enfield.jpg',
          ratePerDay: parsed,
          deposit: selectedBike?.deposit || '₹2,000',
          isAvailable: false,
          itemSubtitle: `${selectedBike?.category || 'Cruiser'} • Coming Soon (Not Available)`
        };
      }
      case 'tour-packages': {
        const parsed = parseInt(String(selectedTour?.startingPrice || '5499').replace(/[^0-9]/g, ''), 10) || 5499;
        return {
          currentItemName: selectedTour?.title || 'Bhubaneswar Heritage Escape',
          currentItemImage: selectedTour?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          ratePerDay: parsed,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: true,
          itemSubtitle: `${selectedTour?.duration || 'Tour Package'} • ${selectedTour?.destination || 'Odisha'}`
        };
      }
      case 'self-drive-car':
      default: {
        const car = selectedCar || ALL_SELF_DRIVE_CARS[0];
        let rate = 2999;
        if (typeof car?.priceNumeric === 'number' && car.priceNumeric > 0) {
          rate = car.priceNumeric;
        } else if (typeof car?.pricePerDay === 'string') {
          const parsed = parseInt(car.pricePerDay.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(parsed) && parsed > 0) rate = parsed;
        } else if (typeof car?.pricePerDay === 'number' && car.pricePerDay > 0) {
          rate = car.pricePerDay < 1000 ? car.pricePerDay * 80 : car.pricePerDay;
        }
        const avail = car?.isAvailable !== false && car?.availableCount !== 0;
        return {
          currentItemName: car?.name || 'Swift 2026',
          currentItemImage: car?.image || '/images/vehicles/swift-2026-grey.jpg',
          ratePerDay: rate,
          deposit: car?.depositNumeric ? `₹${car.depositNumeric}` : (car?.deposit || '₹5,000'),
          isAvailable: avail,
          itemSubtitle: car?.color ? `Color: ${car.color} • Available Fleet` : 'Self-Drive Vehicle'
        };
      }
    }
  }, [selectedService, selectedCar, selectedChauffeurCar, selectedDriver, selectedBike, selectedTour]);

  // Dynamic total calculations in INR
  const subtotal = ratePerDay * (selectedService === 'tour-packages' ? 1 : days);
  const insurancePerDay = selectedService === 'driver-only' || selectedService === 'tour-packages' ? 0 : 499;
  const insuranceCost = includeProtection ? insurancePerDay * days : 0;
  const total = subtotal + insuranceCost;

  const handleProceedToDetails = (e) => {
    e.preventDefault();
    if (!isAvailable) return;
    setStep(2);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    const randomCode = 'CRZ-' + Math.floor(1000 + Math.random() * 9000) + '-EXP';
    setBookingCode(randomCode);
    setStep(3);
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={step === 3 ? 'Reservation Confirmed' : 'Instant Booking & Reservation'}
      subtitle={
        step === 1 ? 'Step 1 of 2: Service, Vehicle & Bhubaneswar Location' :
          step === 2 ? 'Step 2 of 2: Guest Details & Handover Notes' :
            'Your white-glove booking reservation is locked and verified.'
      }
      maxWidth="max-w-2xl"
    >
      {/* Step Indicator */}
      {step < 3 && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
              1
            </span>
            <span className={step >= 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Service, Fleet & Location
            </span>
          </div>
          <div className="h-[1px] flex-1 mx-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
              2
            </span>
            <span className={step >= 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Guest Verification
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: Service, Item Selection & Bhubaneswar Locations */}
      {step === 1 && (
        <form onSubmit={handleProceedToDetails} className="space-y-4">

          {/* 1. FIRST DROPDOWN: Service Selection (Driver only, Car with driver, Self-drive car, etc.) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-1.5 shadow-sm">
            <label className="text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Select Service Category
              </span>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md">
                1st Option
              </span>
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-white border border-blue-300 text-xs sm:text-sm font-bold text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <option value="self-drive-car">🚗 Self-Drive Car (Drive Yourself)</option>
              <option value="car-with-driver">👔 Car with Driver (Executive Chauffeur Service)</option>
              <option value="driver-only">🧑‍✈️ Driver Only (Hire Verified Driver for Your Own Car)</option>
              <option value="self-drive-bike">🏍️ Self-Drive Bike (Coming Soon • Not Available)</option>
              <option value="tour-packages">🌴 Tour Packages (Puri, Konark, Chilika Sightseeing)</option>
            </select>
            <p className="text-[11px] text-blue-800 font-medium">
              💡 {currentService?.tagline}
            </p>
          </div>

          {/* 2. DYNAMIC ITEM SELECTOR BASED ON SERVICE */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={currentItemImage}
                    alt={currentItemName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                    {selectedService === 'driver-only' ? 'Driver: Provided by Company' : selectedService === 'tour-packages' ? 'Selected Package' : 'Selected Fleet'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-950 truncate">{currentItemName}</h4>
                  <div className="text-xs text-slate-500 truncate">
                    {formatCurrency(ratePerDay)}/day • Hold: {deposit}
                  </div>
                </div>
              </div>

              {/* Contextual Selector Dropdown */}
              <div className="shrink-0 max-w-[210px] sm:max-w-[240px]">
                {selectedService === 'self-drive-car' && (
                  <select
                    value={selectedCar?.id || selectedCar?.name}
                    onChange={(e) => {
                      const found = ALL_SELF_DRIVE_CARS.find((c) => c.id === e.target.value || c.name === e.target.value);
                      if (found) setSelectedCar(found);
                    }}
                    className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
                  >
                    {ALL_SELF_DRIVE_CARS.map((v) => {
                      const isAvail = v.isAvailable !== false && v.availableCount !== 0;
                      return (
                        <option key={v.id || v.name} value={v.id || v.name}>
                          {isAvail ? `🟢 ${v.name} (${v.color || 'Available'})` : `🔴 ${v.name} (Not Available)`}
                        </option>
                      );
                    })}
                  </select>
                )}

                {selectedService === 'car-with-driver' && (
                  <select
                    value={selectedChauffeurCar?.id}
                    onChange={(e) => {
                      const found = CHAUFFEUR_CARS.find((c) => c.id === e.target.value);
                      if (found) setSelectedChauffeurCar(found);
                    }}
                    className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
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

                {selectedService === 'driver-only' && (
                  <select
                    value="provided-by-company"
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 text-xs text-slate-900 font-bold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-default truncate shadow-sm"
                  >
                    <option value="provided-by-company">
                      🟢 Provided by Company (Verified Commercial Pilot • ₹799/day)
                    </option>
                  </select>
                )}

                {selectedService === 'self-drive-bike' && (
                  <select
                    value={selectedBike?.id || selectedBike?.name}
                    onChange={(e) => {
                      const found = ALL_BIKES.find((b) => b.id === e.target.value || b.name === e.target.value);
                      if (found) setSelectedBike(found);
                    }}
                    className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
                  >
                    {ALL_BIKES.map((b) => (
                      <option key={b.id || b.name} value={b.id || b.name}>
                        🔴 {b.name} (Coming Soon • Not Available)
                      </option>
                    ))}
                  </select>
                )}

                {selectedService === 'tour-packages' && (
                  <select
                    value={selectedTour?.id}
                    onChange={(e) => {
                      const found = ALL_TOUR_PACKAGES.find((t) => t.id === e.target.value);
                      if (found) setSelectedTour(found);
                    }}
                    className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
                  >
                    {ALL_TOUR_PACKAGES.map((t) => (
                      <option key={t.id} value={t.id}>
                        🟢 {t.title} ({t.startingPrice})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* If driver only, company assigned notice */}
            {selectedService === 'driver-only' && (
              <div className="pt-2 border-t border-slate-200">
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧑‍✈️</span>
                    <div>
                      <span className="font-bold block text-blue-950">Driver: Provided by Company</span>
                      <span className="text-[11px] text-blue-700">Commercial background-verified pilot assigned by CARZODRIVE.</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
                    ₹799 / day
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Unavailable Vehicle Notice Banner */}
          {!isAvailable && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-rose-800 block text-xs">
                  {selectedService === 'self-drive-bike' ? 'Two-Wheeler Fleet Coming Soon' : 'Currently Not Available for Booking'}
                </span>
                <span className="text-[11px] text-rose-700 font-medium leading-relaxed block mt-0.5">
                  {selectedService === 'self-drive-bike'
                    ? `Two-wheeler rentals (${currentItemName}) are launching shortly in Bhubaneswar. Pre-booking inquiries open on WhatsApp.`
                    : `${currentItemName} is currently unavailable. Please select one of our 4 available fleet cars: Swift 2026 (Grey), Swift 2021 (Grey), Kia Sonet 2023 (Black), or Creta 2026 (White).`
                  }
                </span>
              </div>
            </div>
          )}

          {/* 3. BHUBANESWAR LOCATION DROPDOWNS */}
          <div className="space-y-3">
            {/* Pick-up Location Dropdown */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Pick-up / Delivery Location
              </label>

              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                {BHUBANESWAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Drop-off Location Dropdown */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Drop-off / Return Location
              </label>

              <select
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="Same as Pick-up Address">🔄 Same as Pick-up Address</option>
                {BHUBANESWAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. DATES SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Pick-up Date
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Return Date
              </label>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* 5. OPTIONAL PROTECTION ADD-ON (Standard Protection removed) */}
          {insurancePerDay > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Select Protection Level (Optional)</span>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Optional Add-On
                </span>
              </label>

              <div
                onClick={() => setIncludeProtection(!includeProtection)}
                role="button"
                tabIndex={0}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  includeProtection
                    ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeProtection}
                  onChange={() => {}}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Zero-Excess Damage Waiver
                    </span>
                    <span className="text-xs font-bold text-blue-600 shrink-0">
                      +{formatCurrency(insurancePerDay)}/day
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-relaxed">
                    100% collision waiver + zero deductible on vehicle handover.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. TOTAL BREAKDOWN PREVIEW */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="text-slate-600 font-medium">
              Estimated Total for {selectedService === 'tour-packages' ? 'Package' : `${days} ${days === 1 ? 'Day' : 'Days'}`}:
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-950">{formatCurrency(total)}</span>
              <span className="text-slate-500 block text-[10px]">
                {insuranceCost > 0 ? `(Includes ${formatCurrency(insuranceCost)} Zero-Excess protection • Hold: ${deposit})` : `(Refundable Hold: ${deposit})`}
              </span>
            </div>
          </div>

          {/* 7. ACTIONS */}
          <div className="space-y-2.5">
            {isAvailable ? (
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                icon={ArrowRight}
                iconPosition="right"
              >
                Continue to Guest Details
              </Button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
              >
                Not Available for Booking
              </button>
            )}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">OR INSTANT CHAT</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <WhatsAppButton
              message={getQuickBookingWhatsAppMessage({
                serviceName: currentService?.label,
                vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
                userCarModel,
                pickupDate,
                returnDate,
                days: selectedService === 'tour-packages' ? 1 : days,
                location: effectivePickupLocation,
                dropLocation: effectiveDropoffLocation,
                protection: includeProtection ? 'Zero-Excess Damage Waiver' : 'Standard / None',
                deposit,
                total: formatCurrency(total),
              })}
              label="Instant Booking & Chat via WhatsApp"
              size="md"
              variant="solid"
              className="w-full py-3 text-xs"
            />
          </div>
        </form>
      )}

      {/* STEP 2: Guest Details */}
      {step === 2 && (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-semibold">Selected: <strong>{currentItemName}</strong></span>
            <span className="text-blue-700 font-bold">{effectivePickupLocation}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Name (As on Driving License or ID) *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Soumya Ranjan Mohapatra"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Phone (WhatsApp active number) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Special Delivery Instructions / Landmark Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near SUM Hospital Emergency Gate, or DN Regalia East Gate"
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Direct WhatsApp Notice */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <span>
              Online reservation confirmation is currently disabled. Please click the green button below to forward all your entered booking details directly to our WhatsApp concierge.
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setStep(1)}
                className="w-1/3"
              >
                Back
              </Button>
              <button
                type="button"
                disabled
                className="flex-1 py-3 px-3 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-50 cursor-not-allowed select-none text-center"
                title="Online reservation confirmation is currently disabled. Please confirm via WhatsApp below."
              >
                Confirm Reservation (Disabled)
              </button>
            </div>

            <WhatsAppButton
              message={getQuickBookingWhatsAppMessage({
                serviceName: currentService?.label,
                vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
                userCarModel,
                pickupDate,
                returnDate,
                days: selectedService === 'tour-packages' ? 1 : days,
                location: effectivePickupLocation,
                dropLocation: effectiveDropoffLocation,
                protection: includeProtection ? 'Zero-Excess Damage Waiver' : 'Standard / None',
                deposit,
                total: formatCurrency(total),
                guestName,
                guestPhone,
                guestEmail,
                notes: guestNotes,
              })}
              label="Confirm & Forward All Details to WhatsApp"
              size="md"
              variant="solid"
              className="w-full py-3.5 text-xs sm:text-sm font-bold shadow-md"
            />
          </div>
        </form>
      )}

      {/* STEP 3: Reservation Confirmation Receipt */}
      {step === 3 && (
        <div className="space-y-5 text-center sm:text-left">
          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                Booking Reference: {bookingCode}
              </div>
              <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                Priority Allocation Secured for {guestName || 'Distinguished Guest'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                A confirmation voucher and handover link has been dispatched to {guestEmail || 'your email'}.
              </p>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Service Category:</span>
              <span className="font-bold text-slate-950">{currentService?.label}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Selected Item:</span>
              <span className="font-bold text-blue-600">
                {userCarModel ? `${currentItemName} (Own Car: ${userCarModel})` : currentItemName}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Schedule:</span>
              <span className="font-semibold text-slate-900">
                {pickupDate} to {returnDate} ({selectedService === 'tour-packages' ? 'Package' : `${days} ${days === 1 ? 'Day' : 'Days'}`})
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Pick-up Location:</span>
              <span className="font-bold text-slate-900">{effectivePickupLocation}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Drop-off Location:</span>
              <span className="font-bold text-slate-900">{effectiveDropoffLocation}</span>
            </div>
            {includeProtection && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Protection:</span>
                <span className="font-bold text-blue-600">Zero-Excess Damage Waiver</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-slate-900">Estimated Total:</span>
              <span className="text-base font-black text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full sm:w-1/2"
                icon={Printer}
                iconPosition="left"
                onClick={() => alert(`Receipt ${bookingCode} saved. CARZODRIVE Concierge notified.`)}
              >
                Print Voucher
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full sm:flex-1"
                onClick={resetAndClose}
              >
                Done & Return
              </Button>
            </div>

            <WhatsAppButton
              message={getQuickBookingWhatsAppMessage({
                serviceName: currentService?.label,
                vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
                userCarModel,
                pickupDate,
                returnDate,
                days: selectedService === 'tour-packages' ? 1 : days,
                location: effectivePickupLocation,
                dropLocation: effectiveDropoffLocation,
                protection: includeProtection ? 'Zero-Excess Damage Waiver' : 'Standard / None',
                deposit,
                total: formatCurrency(total),
                bookingCode,
                guestName,
                guestPhone,
                guestEmail,
                notes: guestNotes,
              })}
              label={`Chat with Concierge on WhatsApp (Ref: ${bookingCode})`}
              size="md"
              variant="solid"
              className="w-full py-3 text-xs"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
