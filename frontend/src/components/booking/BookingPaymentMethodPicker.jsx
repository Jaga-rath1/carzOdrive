import React from 'react';
import { Lock, QrCode, CreditCard, Building2, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BookingPaymentMethodPicker = ({
  paymentMode,
  onlineMethod,
  setOnlineMethod,
  upiApp,
  setUpiApp,
  total,
  amountDueNow,
  amountDueAtPickup,
}) => {
  if (paymentMode === 'offline') {
    return (
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
              Clicking confirm will launch WhatsApp with your pre-filled vehicle details and schedule.
              Our Bhubaneswar operations team will verify fleet availability and confirm your booking.
              Pay <strong>{formatCurrency(total)}</strong> via Cash or UPI when the car is delivered to you.
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
            <span className="font-bold text-slate-900">{formatCurrency(total)} (Cash / UPI)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
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

      {/* Amount Summary Box */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-600">
          <span>Total Booking Cost:</span>
          <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5">
          <span className="text-blue-700">Amount Payable Right Now:</span>
          <span className="text-sm font-black text-blue-600">{formatCurrency(amountDueNow)}</span>
        </div>
        {paymentMode === 'partial' && (
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Remaining Balance on Pickup:</span>
            <span className="font-bold text-indigo-700">{formatCurrency(amountDueAtPickup)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
