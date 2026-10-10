import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Car, ArrowRight, Edit3 } from 'lucide-react';
import { Container } from '../common/Container';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';

export const QuickBookingBar = ({ onOpenQuickBook }) => {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');
  const [dropLocation, setDropLocation] = useState('Same as Pickup');
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [returnDate, setReturnDate] = useState('2026-10-15');
  const [vehicleType, setVehicleType] = useState('all');

  const effectivePickup = pickupLocation;
  const effectiveDrop = dropLocation === 'Same as Pickup' ? pickupLocation : dropLocation;

  const handleSearch = (e) => {
    e.preventDefault();
    if (onOpenQuickBook) {
      onOpenQuickBook({
        location: effectivePickup,
        pickupLocation: effectivePickup,
        dropLocation: effectiveDrop,
        pickupDate,
        returnDate,
        vehicleType,
      });
    } else {
      const targetRoute = vehicleType === 'bikes' ? '/bikes' : vehicleType === 'chauffeur' ? '/car-with-driver' : '/cars';
      navigate(targetRoute);
    }
  };

  return (
    <div className="relative z-30 -mt-10 sm:-mt-14 mb-12 sm:mb-16">
      <Container>
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* 1. Pickup Location */}
            <div className="lg:col-span-3 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Pickup Location
                </span>
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

            {/* 2. Drop Location */}
            <div className="lg:col-span-2 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Drop Location
                </span>
              </label>
              <select
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Same as Pickup">🔄 Same as Pickup</option>
                {BHUBANESWAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Pickup Date */}
            <div className="lg:col-span-2 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Pickup Date</span>
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* 4. Return Date */}
            <div className="lg:col-span-2 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Return Date</span>
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* 5. Vehicle Type */}
            <div className="lg:col-span-3 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>Vehicle Type</span>
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="all">All Vehicles (Cars & Bikes)</option>
                <option value="luxury">Available Fleet Cars (Swift, Creta, Sonet)</option>
                <option value="suv">Premium SUVs</option>
                <option value="sedan">Executive Sedans</option>
                <option value="bikes">Bikes & Scooters (Coming Soon)</option>
                <option value="chauffeur">Chauffeur Driven Car</option>
              </select>
            </div>

            {/* CTA Button: Search Vehicles */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-12 pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.65)] border border-blue-400/30 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Search Vehicles</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};
