import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { resolveVehicleImageUrl } from '../../utils/documentUtils';

export const BookingFleetItemSelector = ({
  selectedService,
  currentItemName,
  currentItemImage,
  ratePerDay,
  deposit,
  isAvailable,
  dbCars,
  dbBikes,
  dbTours,
  dbDrivers,
  selectedCar,
  setSelectedCar,
  selectedChauffeurCar,
  setSelectedChauffeurCar,
  selectedBike,
  setSelectedBike,
  selectedTour,
  setSelectedTour,
  selectedDriver,
  setSelectedDriver,
}) => {
  return (
    <div className="space-y-3">
      <div
        className={`p-3.5 rounded-2xl border space-y-3 transition-all ${
          !isAvailable
            ? 'bg-rose-50/30 border-rose-300 opacity-80'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border ${
                !isAvailable ? 'border-rose-300 opacity-50 grayscale' : 'border-slate-200'
              }`}
            >
              <img
                src={resolveVehicleImageUrl(
                  currentItemImage,
                  selectedService === 'self-drive-bike'
                    ? '/images/vehicles/royal-enfield.jpg'
                    : '/images/vehicles/swift-2026-grey.jpg'
                )}
                alt={currentItemName}
                className={`w-full h-full object-cover object-center ${
                  !isAvailable ? 'opacity-40 grayscale' : ''
                }`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    selectedService === 'self-drive-bike'
                      ? '/images/vehicles/royal-enfield.jpg'
                      : selectedService === 'tour-packages'
                      ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
                      : '/images/vehicles/swift-2026-grey.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                {selectedService === 'driver-only'
                  ? 'Driver: Provided by Company'
                  : selectedService === 'tour-packages'
                  ? 'Selected Package'
                  : 'Selected Fleet'}
              </span>
              <h4 className="text-sm font-bold text-slate-950 truncate">{currentItemName}</h4>
              <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 flex-wrap">
                <span>{formatCurrency(ratePerDay)}/day</span>
                <span>•</span>
                <span>Hold: {deposit}</span>
                <span>•</span>
                {isAvailable ? (
                  <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10px]">
                    Available
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold bg-rose-100 px-1.5 py-0.2 rounded text-[10px]">
                    0 Available (Out of stock)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Selected Vehicle Badge (Read-Only) */}
          <div className="shrink-0">
            {isAvailable ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Selected</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Unavailable</span>
              </span>
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
                {formatCurrency(ratePerDay || selectedDriver?.dailyRate || 799)} / day
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
            <span className="font-black text-rose-800 block text-xs">Currently Not Available for Instant Booking</span>
            <span className="text-[11px] text-rose-700 font-medium leading-relaxed block mt-0.5">
              {currentItemName} is currently unavailable for instant reservation. Please select an available fleet vehicle or connect with support.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
