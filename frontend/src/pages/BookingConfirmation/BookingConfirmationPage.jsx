import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  Car,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { Container } from '../../components/common/Container';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import { getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';

/**
 * Dedicated Booking Confirmation Page (Preserved for Future Online Checkout Flow)
 * Can be activated by uncommenting the route in AppRoutes.jsx
 */
export const BookingConfirmationPage = () => {
  const location = useLocation();
  const state = location.state || {};

  const bookingCode = state.bookingCode || 'CZ-OD-2026';
  const guestName = state.guestName || 'Distinguished Guest';
  const guestEmail = state.guestEmail || 'guest@example.com';
  const guestPhone = state.guestPhone || '+91 73777 33391';
  const serviceName = state.serviceName || 'Self-Drive Car';
  const vehicleName = state.vehicleName || 'Hyundai Creta SX';
  const pickupDate = state.pickupDate || '2026-10-12';
  const returnDate = state.returnDate || '2026-10-15';
  const pickupLocation = state.pickupLocation || 'SUM Hospital';
  const dropLocation = state.dropLocation || 'SUM Hospital';
  const total = state.total || '₹8,997';

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen text-slate-900">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Reservation Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 pt-2">
                Booking Reference: {bookingCode}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Thank you, <strong>{guestName}</strong>! Your booking details have been registered. A voucher has been dispatched to <strong>{guestEmail}</strong>.
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Service</span>
                <span className="font-bold text-slate-900">{serviceName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Vehicle / Selection</span>
                <span className="font-bold text-blue-600">{vehicleName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Dates</span>
                <span className="font-semibold text-slate-900">{pickupDate} to {returnDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Pick-up Location</span>
                <span className="font-semibold text-slate-900">📍 {pickupLocation}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Drop-off Location</span>
                <span className="font-semibold text-slate-900">🔄 {dropLocation}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-700 font-bold">Estimated Total</span>
                <span className="text-base font-black text-slate-950">{total}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-3">
              <WhatsAppButton
                message={getQuickBookingWhatsAppMessage({
                  serviceName,
                  vehicleName,
                  pickupDate,
                  returnDate,
                  location: pickupLocation,
                  dropLocation,
                  total,
                  bookingCode,
                  guestName,
                  guestPhone,
                })}
                label="Chat with Concierge on WhatsApp"
                size="lg"
                className="w-full text-xs sm:text-sm font-bold"
              />

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-300 font-bold text-xs sm:text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
