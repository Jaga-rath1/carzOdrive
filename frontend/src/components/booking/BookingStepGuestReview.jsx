import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  Coins,
  MessageCircle,
  Check,
  Lock,
  QrCode,
  Building2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';

export const BookingStepGuestReview = ({
  currentItemName,
  effectivePickupLocation,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  guestNotes,
  setGuestNotes,
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
      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 flex items-center justify-between">
        <span className="font-semibold">
          Selected: <strong>{currentItemName}</strong>
        </span>
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

      {/* 3-Section Payment Selector */}
      <div className="pt-3 border-t border-slate-200">
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

        {/* 3 Payment Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Option 1: Full Payment */}
          <button
            type="button"
            onClick={() => setPaymentMode('full')}
            className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
              paymentMode === 'full'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Recommended
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Full Payment</div>
            <div className="text-sm font-black text-blue-600 mt-0.5">{formatCurrency(total)}</div>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              Pay 100% online now. ₹0 balance to pay at delivery.
            </p>
            <div className="mt-2 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              Instant confirmation
            </div>
          </button>

          {/* Option 2: Partial Payment */}
          <button
            type="button"
            onClick={() => setPaymentMode('partial')}
            className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
              paymentMode === 'partial'
                ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                25% Token
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Partial Payment</div>
            <div className="text-sm font-black text-indigo-600 mt-0.5">
              {formatCurrency(partialAmount)}{' '}
              <span className="text-[10px] font-medium text-slate-500">now</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              Pay 25% to lock car. Balance {formatCurrency(remainingAmount)} on delivery.
            </p>
            <div className="mt-2 text-[10px] font-semibold text-slate-600 flex items-center gap-1">
              <Check className="w-3 h-3 text-indigo-600" />
              Balance on pickup
            </div>
          </button>

          {/* Option 3: Offline Payment */}
          <button
            type="button"
            onClick={() => setPaymentMode('offline')}
            className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
              paymentMode === 'offline'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                WhatsApp
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Offline Payment</div>
            <div className="text-sm font-black text-emerald-600 mt-0.5">
              ₹0 <span className="text-[10px] font-medium text-slate-500">advance</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              Redirects to WhatsApp. Confirm details & pay {formatCurrency(total)} on pickup.
            </p>
            <div className="mt-2 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              Pay at vehicle pickup
            </div>
          </button>
        </div>

        {/* Sub-form: Online Payment Gateway */}
        {(paymentMode === 'full' || paymentMode === 'partial') && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Select Payment Method
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                256-Bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOnlineMethod('upi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  onlineMethod === 'upi'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlineMethod('card')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  onlineMethod === 'card'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlineMethod('netbanking')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  onlineMethod === 'netbanking'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Net Banking</span>
              </button>
            </div>

            {onlineMethod === 'upi' && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay' },
                    { id: 'phonepe', label: 'PhonePe' },
                    { id: 'paytm', label: 'Paytm' },
                    { id: 'other', label: 'Other UPI' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                        upiApp === app.id
                          ? 'border-blue-600 bg-white text-blue-700 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. yourname@okaxis)"
                    defaultValue="customer@upi"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {onlineMethod === 'card' && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="Card Number (XXXX XXXX XXXX 4242)"
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="12/28"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="CVV"
                    defaultValue="888"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}

            {onlineMethod === 'netbanking' && (
              <div className="pt-1">
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  defaultValue="HDFC Bank"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Summary Box */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Booking Cost:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                <span className="text-blue-700">Amount Payable Right Now:</span>
                <span className="text-sm font-black text-blue-600">
                  {formatCurrency(amountDueNow)}
                </span>
              </div>
              {paymentMode === 'partial' && (
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Remaining Balance on Pickup:</span>
                  <span className="font-bold text-indigo-700">
                    {formatCurrency(amountDueAtPickup)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offline Explanation Card */}
        {paymentMode === 'offline' && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Zero Online Advance • Direct WhatsApp Concierge Confirmation
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Clicking confirm will launch WhatsApp with your pre-filled vehicle details and
                  schedule. Our Bhubaneswar operations team will verify fleet availability and
                  confirm your booking. Pay <strong>{formatCurrency(total)}</strong> via Cash or UPI
                  when the car is delivered to you.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Fare:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                <span className="text-emerald-700">Payable Online Today:</span>
                <span className="text-sm font-black text-emerald-600">₹0 (Zero Advance)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 text-[11px]">
                <span>Payable on Vehicle Handover:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(total)} (Cash / UPI)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <AuthRequiredNotice
          title="Login Required to Complete Booking"
          message="Please log in or sign up with your phone number/email to confirm your vehicle reservation and receive your booking receipt."
          className="mt-3"
        />
      )}

      {/* Action Buttons */}
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
        ) : paymentMode === 'offline' ? (
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp (Pay ₹{total} on Pickup)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isProcessingPayment}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing {formatCurrency(amountDueNow)}...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {paymentMode === 'full'
                    ? `Pay ${formatCurrency(amountDueNow)} & Confirm Full Booking`
                    : `Pay ${formatCurrency(amountDueNow)} & Lock Vehicle (25%)`}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
