import React from 'react';
import { CreditCard, Coins, MessageCircle, Check, Ban } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BookingPaymentModeSelector = ({
  paymentMode = 'offline',
  setPaymentMode,
  total,
  partialAmount,
  remainingAmount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      {/* Option 1: Full Payment (Faded & Disabled per user request) */}
      <div
        className="relative text-left p-3.5 rounded-2xl border border-slate-200 bg-slate-100/60 opacity-40 cursor-not-allowed select-none transition-all"
        title="Online Full Payment is temporarily paused. Please use WhatsApp booking."
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-500">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
            <Ban className="w-2.5 h-2.5" />
            Disabled
          </span>
        </div>
        <div className="text-xs font-bold text-slate-600">Full Online Payment</div>
        <div className="text-sm font-bold text-slate-500 mt-0.5">{formatCurrency(total)}</div>
        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
          100% online gateway (Temporarily disabled)
        </p>
      </div>

      {/* Option 2: Partial Payment (Faded & Disabled per user request) */}
      <div
        className="relative text-left p-3.5 rounded-2xl border border-slate-200 bg-slate-100/60 opacity-40 cursor-not-allowed select-none transition-all"
        title="Partial Payment is temporarily paused. Please use WhatsApp booking."
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-500">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
            <Ban className="w-2.5 h-2.5" />
            Disabled
          </span>
        </div>
        <div className="text-xs font-bold text-slate-600">Partial Payment (25%)</div>
        <div className="text-sm font-bold text-slate-500 mt-0.5">
          {formatCurrency(partialAmount)}{' '}
          <span className="text-[10px] font-medium text-slate-400">now</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
          25% advance token (Temporarily disabled)
        </p>
      </div>

      {/* Option 3: WhatsApp Booking / Pay on Pickup (Active Primary Option) */}
      <button
        type="button"
        onClick={() => setPaymentMode && setPaymentMode('offline')}
        className="relative text-left p-3.5 rounded-2xl border border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/25 shadow-sm transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
            Active Now
          </span>
        </div>
        <div className="text-xs font-bold text-emerald-950">Book on WhatsApp</div>
        <div className="text-sm font-black text-emerald-600 mt-0.5">
          ₹0 <span className="text-[10px] font-medium text-slate-500">advance online</span>
        </div>
        <p className="text-[10px] text-slate-600 mt-1 leading-snug">
          Direct WhatsApp concierge. Pay {formatCurrency(total)} on pickup via Cash / UPI.
        </p>
        <div className="mt-2 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-600" />
          Pay at vehicle pickup
        </div>
      </button>
    </div>
  );
};
