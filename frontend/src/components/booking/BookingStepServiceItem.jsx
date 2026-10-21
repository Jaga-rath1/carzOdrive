import React from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { formatCurrency } from '../../utils/formatters';
import { resolveVehicleImageUrl } from '../../utils/documentUtils';
import { getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';

export const BookingStepServiceItem = ({
  selectedService,
  setSelectedService,
  currentService,
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
  pickupLocation,
  setPickupLocation,
  dropoffLocation,
  setDropoffLocation,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  includeProtection,
  setIncludeProtection,
  insurancePerDay,
  insuranceCost,
  days,
  total,
  userCarModel,
  effectivePickupLocation,
  effectiveDropoffLocation,
  onProceed,
}) => {
  return (
    <form onSubmit={onProceed} className="space-y-4">
      {/* 1. Service Category Selection */}
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
                src={resolveVehicleImageUrl(currentItemImage, selectedService === 'self-drive-bike' ? '/images/vehicles/royal-enfield.jpg' : '/images/vehicles/swift-2026-grey.jpg')}
                alt={currentItemName}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = selectedService === 'self-drive-bike'
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
              <div className="text-xs text-slate-500 truncate">
                {formatCurrency(ratePerDay)}/day • Hold: {deposit}
              </div>
            </div>
          </div>

          {/* Contextual Selector Dropdown */}
          <div className="shrink-0 max-w-[210px] sm:max-w-[240px]">
            {selectedService === 'self-drive-car' && (
              <select
                value={selectedCar?._id || selectedCar?.id || selectedCar?.name || ''}
                onChange={(e) => {
                  const found = dbCars.find(
                    (c) => (c._id || c.id) === e.target.value || c.name === e.target.value
                  );
                  if (found) setSelectedCar(found);
                }}
                className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
              >
                {dbCars.map((v) => {
                  const isAvail = v.isAvailable !== false && (v.availableCount ?? 1) > 0;
                  return (
                    <option key={v._id || v.id || v.name} value={v._id || v.id || v.name}>
                      {isAvail
                        ? `🟢 ${v.name} (${v.availableCount ?? 1} Available)`
                        : `🔴 ${v.name} — Currently Unavailable`}
                    </option>
                  );
                })}
              </select>
            )}

            {selectedService === 'car-with-driver' && (
              <select
                value={selectedChauffeurCar?._id || selectedChauffeurCar?.id || ''}
                onChange={(e) => {
                  const found = dbCars.find((c) => (c._id || c.id) === e.target.value);
                  if (found) setSelectedChauffeurCar(found);
                }}
                className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
              >
                {dbCars.map((c) => {
                  const isAvail = c.isAvailable !== false && (c.availableCount ?? 1) > 0;
                  return (
                    <option key={c._id || c.id} value={c._id || c.id} disabled={!isAvail}>
                      {isAvail
                        ? `🟢 ${c.name} (${c.availableCount ?? 1} Available)`
                        : `🔴 ${c.name} — Currently Unavailable`}
                    </option>
                  );
                })}
              </select>
            )}

            {selectedService === 'driver-only' && (
              <select
                value={selectedDriver?._id || 'provided-by-company'}
                onChange={(e) => {
                  const found = dbDrivers.find((d) => (d._id || d.id) === e.target.value);
                  if (found) setSelectedDriver(found);
                }}
                className="w-full bg-slate-100 border border-slate-300 text-xs text-slate-900 font-bold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
              >
                {dbDrivers.length > 0 ? (
                  dbDrivers.map((d) => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      🟢 {d.name} ({d.title}) • ₹799/day
                    </option>
                  ))
                ) : (
                  <option value="provided-by-company">
                    🟢 Provided by Company (Verified Pilot • ₹799/day)
                  </option>
                )}
              </select>
            )}

            {selectedService === 'self-drive-bike' && (
              <select
                value={selectedBike?._id || selectedBike?.id || selectedBike?.name || ''}
                onChange={(e) => {
                  const found = dbBikes.find(
                    (b) => (b._id || b.id) === e.target.value || b.name === e.target.value
                  );
                  if (found) setSelectedBike(found);
                }}
                className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
              >
                {dbBikes.map((b) => {
                  const isAvail = b.isAvailable !== false && (b.availableCount ?? 1) > 0;
                  return (
                    <option key={b._id || b.id || b.name} value={b._id || b.id || b.name}>
                      {isAvail
                        ? `🟢 ${b.name} (${b.availableCount ?? 1} Available • ₹${b.pricePerDay}/day)`
                        : `🔴 ${b.name} — Currently Unavailable`}
                    </option>
                  );
                })}
              </select>
            )}

            {selectedService === 'tour-packages' && (
              <select
                value={
                  selectedTour?._id ||
                  selectedTour?.packageId ||
                  selectedTour?.id ||
                  selectedTour?.slug ||
                  ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const found = dbTours.find(
                    (t) =>
                      t._id === val ||
                      t.id === val ||
                      t.slug === val ||
                      t.title === val ||
                      t.name === val
                  );
                  if (found) setSelectedTour(found);
                }}
                className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer truncate shadow-sm"
              >
                {dbTours.map((t) => (
                  <option key={t._id || t.id || t.slug} value={t._id || t.id || t.slug}>
                    🟢 {t.title || t.name} ({t.startingPrice})
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
                  <span className="text-[11px] text-blue-700">
                    Commercial background-verified pilot assigned by CARZODRIVE.
                  </span>
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
              Currently Not Available for Instant Booking
            </span>
            <span className="text-[11px] text-rose-700 font-medium leading-relaxed block mt-0.5">
              {currentItemName} is currently unavailable for instant reservation. Please select an
              available fleet vehicle from the dropdown above or connect with our support desk on
              WhatsApp.
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

      {/* 5. OPTIONAL PROTECTION ADD-ON */}
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
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${includeProtection
                ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
          >
            <input
              type="checkbox"
              checked={includeProtection}
              onChange={() => { }}
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
          Estimated Total for{' '}
          {selectedService === 'tour-packages' ? 'Package' : `${days} ${days === 1 ? 'Day' : 'Days'}`}:
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-slate-950">{formatCurrency(total)}</span>
          <span className="text-slate-500 block text-[10px]">
            {insuranceCost > 0
              ? `(Includes ${formatCurrency(insuranceCost)} Zero-Excess protection • Hold: ${deposit})`
              : `(Refundable Hold: ${deposit})`}
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
          <div className="space-y-1.5">
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs text-rose-500 bg-rose-50 border border-rose-200 cursor-not-allowed select-none text-center shadow-xs"
            >
              Currently Unavailable
            </button>
            <p className="text-[11px] text-rose-600 text-center font-medium">
              The selected vehicle has 0 units available in our fleet and is currently unavailable.
              Please select another available model.
            </p>
          </div>
        )}

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">
            OR INSTANT CHAT
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <WhatsAppButton
          message={getQuickBookingWhatsAppMessage({
            serviceName: currentService?.label,
            vehicleName: userCarModel
              ? `${currentItemName} (Client Car: ${userCarModel})`
              : currentItemName,
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
  );
};
