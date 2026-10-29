import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Phone, X, ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { openWhatsAppChat } from '../../utils/whatsapp';
import { getCurrentUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const VehicleWhatsAppModal = ({
  isOpen,
  onClose,
  vehicle = {},
  pickupDate = '',
  returnDate = '',
  pickupLocation = '',
  daysDiff = 1,
  estimatedTotal = 0,
}) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Prefill name & phone if user is logged in
  useEffect(() => {
    if (!isOpen) return;
    setError('');
    try {
      const user = currentUser || getCurrentUser();
      if (user) {
        if (user.name && !name) setName(user.name);
        if (user.phone && !phone) {
          const clean = String(user.phone).replace(/[^0-9]/g, '');
          setPhone(clean.slice(-10));
        }
      }
    } catch {
      // ignore
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    const vehicleName = vehicle?.name || 'Selected Vehicle';
    const vehicleType = vehicle?.category || vehicle?.vehicleType || 'Self-Drive';
    const vehicleColor = vehicle?.color || 'Standard';
    const rateText = vehicle?.priceDisplay || (vehicle?.pricePerDay ? `₹${vehicle.pricePerDay}/day` : '');

    let msg = `Hello CARZODRIVE! 🏎️\n\n`;
    msg += `I want to connect regarding:\n`;
    msg += `🚗 *Vehicle:* ${vehicleName} (${vehicleType})\n`;
    if (vehicleColor && vehicleColor !== 'Standard') {
      msg += `🎨 *Color:* ${vehicleColor}\n`;
    }
    if (rateText) {
      msg += `💰 *Daily Rate:* ${rateText}\n`;
    }
    if (pickupDate && returnDate) {
      msg += `📅 *Trip Dates:* ${pickupDate} to ${returnDate} (${daysDiff} ${daysDiff === 1 ? 'Day' : 'Days'})\n`;
    }
    if (pickupLocation) {
      msg += `📍 *Pick-up Location:* ${pickupLocation}\n`;
    }
    if (estimatedTotal && estimatedTotal > 0) {
      msg += `💵 *Estimated Total:* ₹${estimatedTotal.toLocaleString('en-IN')}\n`;
    }
    msg += `\n👤 *Customer Name:* ${name.trim()}\n`;
    msg += `📞 *WhatsApp Number:* +91 ${cleanPhone.slice(-10)}\n`;
    if (notes.trim()) {
      msg += `📝 *Notes / Landmark:* ${notes.trim()}\n`;
    }
    msg += `\nPlease confirm availability and share booking details. Thank you!`;

    openWhatsAppChat(msg);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.22)] relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Emerald Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Chat with Us on WhatsApp
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Instant confirmation with our Bhubaneswar manager
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle & Trip Snapshot Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 mb-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Selected Vehicle:</span>
            <span className="font-bold text-slate-900 truncate max-w-[210px]">
              {vehicle?.name || 'CarzoDrive Fleet'}
            </span>
          </div>

          {pickupDate && returnDate && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>Dates:</span>
              </span>
              <span className="font-bold text-blue-700">
                {pickupDate} → {returnDate} ({daysDiff} {daysDiff === 1 ? 'Day' : 'Days'})
              </span>
            </div>
          )}

          {pickupLocation && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>Hub:</span>
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[210px]">
                {pickupLocation}
              </span>
            </div>
          )}

          {estimatedTotal > 0 && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span className="text-slate-600 font-bold">Estimated Total:</span>
              <span className="font-black text-sm text-emerald-600">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Soumya Ranjan Mohapatra"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition-all shadow-xs"
                autoFocus
              />
            </div>
          </div>

          {/* WhatsApp Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              WhatsApp Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '');
                  setPhone(digits);
                  if (error) setError('');
                }}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition-all shadow-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              We'll send the vehicle booking details directly to this WhatsApp number.
            </p>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">
              Special Request / Delivery Landmark <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Need vehicle delivered near Airport Terminal 1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-800 rounded-xl px-3.5 py-2 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-[0_6px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>Connect on WhatsApp</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Cancel */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
