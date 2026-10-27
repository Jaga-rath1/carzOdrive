import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CreditCard,
  AlertCircle,
  MessageCircle,
  Lock,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';
import { BookingPaymentModeSelector } from './BookingPaymentModeSelector';
import { BookingPaymentMethodPicker } from './BookingPaymentMethodPicker';

export const BookingStepGuestReview = ({
  currentItemName,
  effectivePickupLocation,
  effectiveDropoffLocation,
  pickupDate,
  returnDate,
  days,
  includeProtection,
  guestName,
  guestEmail,
  guestPhone,
  guestNotes,
  drivingLicenseNumber,
  drivingLicenseDoc,
  drivingLicenseDocName,
  idProofDoc,
  idProofDocName,
  subtotal = 0,
  discountAmount = 0,
  discountPercent = 0,
  paymentMode,
  setPaymentMode,
  paymentError,
  total,
  partialAmount,
  remainingAmount,
  amountDueNow,
  amountDueAtPickup,
  onlineMethod,
  setOnlineMethod,
  upiApp,
  setUpiApp,
  isProcessingPayment,
  isAuthenticated = true,
  openAuthModal,
  onBack,
  onSubmit,
}) => {
  const location = useLocation();

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      {/* 1. Page 2: Trip & Guest Details Summary Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Trip & Guest Details
            </span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Trip Details */}
          <div className="space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Ride & Trip</div>
            <div className="font-bold text-slate-900 text-sm truncate">{currentItemName}</div>
            <div className="text-slate-600 font-medium">📍 Pick-up: <strong>{effectivePickupLocation}</strong></div>
            {effectiveDropoffLocation && effectiveDropoffLocation !== effectivePickupLocation && (
              <div className="text-slate-600 font-medium">🔄 Drop-off: <strong>{effectiveDropoffLocation}</strong></div>
            )}
            <div className="text-slate-600 font-medium">
              📅 {pickupDate} to {returnDate} ({days} {days === 1 ? 'day' : 'days'})
            </div>
            {includeProtection && (
              <div className="text-emerald-700 font-bold text-[11px]">
                🛡️ Zero-Excess Protection Included
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Booked For</div>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{guestName}</span>
            </div>
            <div className="text-slate-600 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{guestPhone}</span>
            </div>
            <div className="text-slate-600 font-medium flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{guestEmail}</span>
            </div>
            {drivingLicenseNumber && (
              <div className="text-slate-700 font-bold flex items-center gap-1.5 text-[11px] truncate">
                <span>🪪 DL:</span>
                <span className="font-mono text-slate-950 uppercase">{drivingLicenseNumber}</span>
              </div>
            )}
            {drivingLicenseDoc && (
              <div className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <span>✓ DL Document Attached for Admin</span>
              </div>
            )}
            {idProofDoc && (
              <div className="text-blue-700 font-bold text-[11px] flex items-center gap-1">
                <span>✓ ID Proof Document Attached</span>
              </div>
            )}
            {guestNotes && (
              <div className="text-slate-500 text-[11px] italic truncate">
                📝 "{guestNotes}"
              </div>
            )}
          </div>
        </div>

        {/* Amount Banner with Discount Line */}
        <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-200">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                  {discountPercent}% OFF
                </span>
                <span>Promotional Discount:</span>
              </span>
              <span className="font-bold">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Net Booking Value:</span>
            <div className="flex items-baseline gap-2">
              {discountAmount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency((subtotal || 0) + (includeProtection ? (days * 499) : 0))}
                </span>
              )}
              <span className="text-base font-black text-slate-950">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3-Way Payment Mode Selector */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            Select Payment Option *
          </label>
          <span className="text-[11px] font-semibold text-slate-500">100% Safe & Verified</span>
        </div>

        {paymentError && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{paymentError}</span>
          </div>
        )}

        <BookingPaymentModeSelector
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          total={total}
          partialAmount={partialAmount}
          remainingAmount={remainingAmount}
        />

        {/* 3. Online / Offline Payment Gateway Sub-form */}
        <BookingPaymentMethodPicker
          paymentMode={paymentMode}
          onlineMethod={onlineMethod}
          setOnlineMethod={setOnlineMethod}
          upiApp={upiApp}
          setUpiApp={setUpiApp}
          total={total}
          amountDueNow={amountDueNow}
          amountDueAtPickup={amountDueAtPickup}
        />
      </div>

      {/* 4. Auth Verification Notice if Not Logged In */}
      {!isAuthenticated && (
        <AuthRequiredNotice
          title="Login Required to Complete Booking"
          message="Please log in or sign up with your phone number/email to confirm your vehicle reservation and receive your booking receipt."
          className="mt-3"
        />
      )}

      {/* 5. Action Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onBack}
          className="w-1/3"
          disabled={isProcessingPayment}
        >
          Back
        </Button>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <Link
              to="/login"
              state={{ returnTo: location.pathname }}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Complete Booking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => openAuthModal && openAuthModal('login')}
              className="py-3 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer"
              title="Open Quick Popup Modal"
            >
              Popup
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isProcessingPayment}
            className="flex-1 py-3.5 px-4 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75 disabled:cursor-wait"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to WhatsApp...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Book on WhatsApp</span>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
