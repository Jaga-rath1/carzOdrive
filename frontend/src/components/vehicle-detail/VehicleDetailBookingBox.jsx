import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';

export const VehicleDetailBookingBox = ({ vehicle, onOpenQuickBook }) => {
  const isAvailable = vehicle.isAvailable !== false && vehicle.availableCount !== 0;

  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');

  // Calculate day difference
  const daysDiff = Math.max(
    1,
    Math.round(
      (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 2
  );

  const priceNum = vehicle.priceNumeric || (
    typeof vehicle.pricePerDay === 'number' 
      ? vehicle.pricePerDay 
      : parseInt(String(vehicle.pricePerDay).replace(/[^0-9]/g, '')) || 2999
  );

  const estimatedTotal = priceNum * daysDiff;
  const depositText = vehicle.deposit || (vehicle.depositNumeric ? `₹${vehicle.depositNumeric}` : '₹5,000');

  const effectiveLocation = pickupLocation;

  const handleBookNow = () => {
    if (!isAvailable) return;
    onOpenQuickBook?.({
      vehicle,
      type: vehicle.vehicleType || 'vehicle',
      pickupDate,
      returnDate,
      location: effectiveLocation,
      pickupLocation: effectiveLocation,
    });
  };

  return (
    <div className="sticky top-28 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 space-y-6">
      {/* Price Header */}
      <div className="pb-5 border-b border-slate-100 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Rental Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-950">
              {vehicle.priceDisplay || (vehicle.pricePerDay ? (typeof vehicle.pricePerDay === 'string' ? vehicle.pricePerDay : `₹${vehicle.pricePerDay}`) : '₹4,999')}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ 24 hours</span>
          </div>
          {vehicle.color && (
            <span className="text-[11px] font-semibold text-slate-500 block mt-1">
              Color: <strong className="text-slate-800">{vehicle.color}</strong>
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block mb-1">
            Refundable Deposit
          </span>
          <span className="text-xs font-bold text-slate-700">
            {depositText}
          </span>
        </div>
      </div>

      {/* Date & Hub Pickers */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              Pick-up
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              Drop-off
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              Pick-up / Delivery Location
            </span>
          </label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            {BHUBANESWAR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fare Estimate */}
      <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-slate-900 block">Total for {daysDiff} Days</span>
          <span className="text-[10px] text-slate-500">Includes all taxes & FASTag</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-blue-600">
            ₹{estimatedTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Primary Actions: Book Now (faded if unavailable) + Chat on WhatsApp */}
      <div className="space-y-2.5">
        {isAvailable ? (
          <button
            type="button"
            onClick={handleBookNow}
            className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-[0_6px_20px_rgba(37,99,235,0.35)] cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Book Now Instant</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              disabled
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
              title="This vehicle is currently not available for booking"
            >
              Not Available
            </button>
            <p className="text-[11px] text-slate-500 text-center font-medium">
              This vehicle is currently not available for booking.
            </p>
          </div>
        )}

        <WhatsAppButton
          message={getVehicleWhatsAppMessage(vehicle)}
          label={isAvailable ? "Chat with Us on WhatsApp" : "Inquire Availability on WhatsApp"}
          size="lg"
          variant={isAvailable ? "solid" : "outline"}
          className="w-full rounded-2xl py-3.5 text-sm"
        />
      </div>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Zero pre-payment required. Pay on vehicle handoff.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Free cancellation up to 6 hours before trip starts.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>100% verified CARZODRIVE commercial fleet.</span>
        </div>
      </div>
    </div>
  );
};
