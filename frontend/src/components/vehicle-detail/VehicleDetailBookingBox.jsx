import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Coins,
  MessageCircle
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { getTodayDateString } from '../../utils/formatters';

export const VehicleDetailBookingBox = ({ vehicle, onOpenQuickBook }) => {
  const count = vehicle.availableCount ?? vehicle.count ?? (vehicle.isAvailable !== false ? 1 : 0);
  const isAvailable = vehicle.isAvailable !== false && count > 0 && vehicle.availabilityStatus !== 'UNAVAILABLE';

  const [pickupDate, setPickupDate] = useState(() => getTodayDateString(1));
  const [returnDate, setReturnDate] = useState(() => getTodayDateString(3));
  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');
  const [paymentMode, setPaymentMode] = useState('full'); // 'full' | 'partial' | 'offline'

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
  const partialAmount = Math.max(499, Math.round(estimatedTotal * 0.25));
  const remainingAmount = Math.max(0, estimatedTotal - partialAmount);
  const depositText = vehicle.deposit || (vehicle.depositNumeric ? `₹${vehicle.depositNumeric}` : '₹5,000');

  const effectiveLocation = pickupLocation;

  const handleBookNow = () => {
    if (!isAvailable) return;
    const today = getTodayDateString(0);
    if (!pickupDate || pickupDate < today) {
      alert('Back-dated bookings are not allowed. Please choose today or a future date.');
      setPickupDate(today);
      return;
    }
    if (returnDate && returnDate < pickupDate) {
      alert('Drop-off date cannot be earlier than pick-up date.');
      setReturnDate(pickupDate);
      return;
    }
    onOpenQuickBook?.({
      vehicle,
      type: vehicle.vehicleType || 'vehicle',
      pickupDate,
      returnDate,
      location: effectiveLocation,
      pickupLocation: effectiveLocation,
      paymentMode,
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
          <div className="mt-2">
            {isAvailable ? (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {count} Units Available
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Currently Unavailable (0 Units)
              </span>
            )}
          </div>
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
              min={getTodayDateString(0)}
              value={pickupDate}
              onChange={(e) => {
                const val = e.target.value;
                const today = getTodayDateString(0);
                if (val && val < today) {
                  setPickupDate(today);
                  if (returnDate && returnDate < today) setReturnDate(today);
                } else {
                  setPickupDate(val);
                  if (returnDate && returnDate < val) setReturnDate(val);
                }
              }}
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
              min={pickupDate || getTodayDateString(0)}
              value={returnDate}
              onChange={(e) => {
                const val = e.target.value;
                const minAllowed = pickupDate || getTodayDateString(0);
                if (val && val < minAllowed) {
                  setReturnDate(minAllowed);
                } else {
                  setReturnDate(val);
                }
              }}
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

      {/* Payment Options Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Payment Preference
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setPaymentMode('full')}
            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
              paymentMode === 'full'
                ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold ring-1 ring-blue-500/30'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold leading-tight">Full Pay</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% Online</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('partial')}
            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
              paymentMode === 'partial'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold ring-1 ring-indigo-500/30'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold leading-tight">25% Token</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Advance</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('offline')}
            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
              paymentMode === 'offline'
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 font-bold ring-1 ring-emerald-500/30'
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold leading-tight">Offline</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">WhatsApp</div>
          </button>
        </div>
      </div>

      {/* Fare Estimate with dynamic breakdown */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
          <div>
            <span className="font-bold text-slate-900 block">Total for {daysDiff} Days</span>
            <span className="text-[10px] text-slate-500">Includes all taxes & FASTag</span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-900">
              ₹{estimatedTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between font-semibold pt-0.5">
          <span className="text-slate-600 text-[11px]">
            {paymentMode === 'full'
              ? 'Pay Online Now (100%):'
              : paymentMode === 'partial'
              ? 'Pay Online Now (25% Token):'
              : 'Pay Online Now:'}
          </span>
          <span
            className={`text-sm font-black ${
              paymentMode === 'offline' ? 'text-emerald-600' : 'text-blue-600'
            }`}
          >
            {paymentMode === 'full'
              ? `₹${estimatedTotal.toLocaleString('en-IN')}`
              : paymentMode === 'partial'
              ? `₹${partialAmount.toLocaleString('en-IN')}`
              : '₹0 (Zero Advance)'}
          </span>
        </div>

        {paymentMode !== 'full' && (
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Pay on Vehicle Handover:</span>
            <span className="font-bold text-slate-800">
              {paymentMode === 'partial'
                ? `₹${remainingAmount.toLocaleString('en-IN')} (Cash / UPI)`
                : `₹${estimatedTotal.toLocaleString('en-IN')} (Cash / UPI)`}
            </span>
          </div>
        )}
      </div>

      {/* Primary Actions: Book Now + Chat on WhatsApp */}
      <div className="space-y-2.5">
        {isAvailable ? (
          <button
            type="button"
            onClick={handleBookNow}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm text-white transition-all shadow-[0_6px_20px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center gap-2 group ${
              paymentMode === 'offline'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : paymentMode === 'partial'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
            }`}
          >
            {paymentMode === 'offline' ? (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Book via WhatsApp (Pay at Pickup)</span>
              </>
            ) : paymentMode === 'partial' ? (
              <>
                <Coins className="w-4 h-4" />
                <span>Lock with 25% (₹{partialAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Book Now (Pay ₹{estimatedTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              disabled
              className="w-full py-4 px-6 rounded-2xl font-black text-sm text-rose-500 bg-rose-50 border border-rose-200 cursor-not-allowed select-none text-center shadow-xs"
              title="This vehicle has 0 units available and is currently unavailable"
            >
              Currently Unavailable
            </button>
            <p className="text-[11px] text-rose-600 text-center font-medium">
              This vehicle currently has 0 units in stock and is unavailable for booking.
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
