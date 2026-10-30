import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Phone, X, ArrowRight } from 'lucide-react';
import { openWhatsAppChat, getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';
import { getCurrentUser } from '../../services/api';

export const HeroWhatsAppModal = ({
  isOpen,
  onClose,
  activeService,
  currentSelectedItem,
  pickupLocation,
  dropLocation,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  tripDays,
  activeTab,
}) => {
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waNotes, setWaNotes] = useState('');
  const [waError, setWaError] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    if (!isOpen) return;
    try {
      const user = getCurrentUser();
      if (user) {
        if (user.name && !waName) setWaName(user.name);
        if (user.phone && !waPhone) setWaPhone(user.phone);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceedWhatsApp = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!waName.trim()) {
      setWaError('Please enter your full name.');
      return;
    }
    const cleanPhone = waPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setWaError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    const effectivePickup = pickupLocation;
    const effectiveDrop = dropLocation === 'Same as Pick-up Location' ? pickupLocation : dropLocation;
    const itemName = currentSelectedItem?.name || (activeTab === 'driver-only' ? 'Verified Driver (Provided by Company)' : 'Selected Fleet Vehicle');

    const numericRate =
      currentSelectedItem?.priceNumeric ||
      currentSelectedItem?.pricePerDay ||
      (typeof currentSelectedItem?.priceDisplay === 'string'
        ? parseInt(currentSelectedItem.priceDisplay.replace(/[^0-9]/g, ''), 10)
        : 0) ||
      (typeof currentSelectedItem?.startingPrice === 'string'
        ? parseInt(currentSelectedItem.startingPrice.replace(/[^0-9]/g, ''), 10)
        : 0) ||
      0;

    const scaledTotal =
      numericRate > 0
        ? `₹${(numericRate * tripDays).toLocaleString('en-IN')} (₹${numericRate.toLocaleString('en-IN')}/day × ${tripDays} ${tripDays === 1 ? 'Day' : 'Days'})`
        : currentSelectedItem?.priceDisplay || '';

    const message = getQuickBookingWhatsAppMessage({
      serviceName: activeService?.label || 'Rental Service',
      vehicleName: itemName,
      pickupDate: `${pickupDate} (${pickupTime})`,
      returnDate: `${returnDate} (${returnTime})`,
      days: tripDays,
      location: effectivePickup,
      dropLocation: effectiveDrop,
      total: scaledTotal,
      deposit: currentSelectedItem?.deposit || '₹0 (Zero Deposit)',
      guestName: waName.trim(),
      guestPhone: cleanPhone,
      notes: waNotes?.trim() || '',
    });

    openWhatsAppChat(message);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.18)] relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Emerald Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-t-3xl" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-5 h-5 fill-emerald-600 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Book on WhatsApp</h3>
              <p className="text-xs text-slate-500">Connect instantly with our Bhubaneswar team</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Booking Summary Snapshot */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Selected Service:</span>
            <span className="font-bold text-emerald-700 truncate max-w-[220px]">
              {activeService?.label}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Fleet / Ride:</span>
            <span className="font-bold text-slate-900 truncate max-w-[220px]">
              {currentSelectedItem?.name || 'Standard Fleet Model'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Pick-up Hub:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[220px]">
              📍 {pickupLocation}
            </span>
          </div>
          {dropLocation && dropLocation !== 'Same as Pick-up Location' && dropLocation !== pickupLocation && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Drop-off Hub:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                🔄 {dropLocation}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Dates & Duration:</span>
            <span className="font-bold text-blue-700">
              {pickupDate} → {returnDate} ({tripDays} {tripDays === 1 ? 'Day' : 'Days'})
            </span>
          </div>
          {currentSelectedItem?.priceDisplay && (
            <div className="flex items-center justify-between text-slate-600 border-t border-slate-200/60 pt-1.5">
              <span className="font-medium">Rate / Pricing:</span>
              <div className="flex items-center gap-1.5">
                {currentSelectedItem.originalPrice && currentSelectedItem.originalPrice > (currentSelectedItem.priceNumeric || currentSelectedItem.pricePerDay) && (
                  <span className="text-xs text-slate-400 line-through decoration-rose-500 decoration-2 font-bold">
                    ₹{currentSelectedItem.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-black text-emerald-600 text-sm">
                  {currentSelectedItem.priceDisplay}
                </span>
                {currentSelectedItem.discountBadge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                    {currentSelectedItem.discountBadge}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {waError && (
          <div className="p-2.5 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ⚠️ {waError}
          </div>
        )}

        <form onSubmit={handleProceedWhatsApp} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Soumya Ranjan Mohapatra"
                value={waName}
                onChange={(e) => setWaName(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              WhatsApp Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              title="Submit details and book on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>Book on WhatsApp</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Optional notes + Cancel */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              Special Instructions / Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near SUM Hospital Gate 2 or Airport Arrival"
              value={waNotes}
              onChange={(e) => setWaNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 text-xs font-semibold text-slate-800 rounded-xl px-3.5 py-2 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
