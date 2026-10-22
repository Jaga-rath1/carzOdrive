import React from 'react';
import {
  Copy,
  Check,
  Edit3,
  Trash2,
  Calendar,
  Car,
  User,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { STATUS_COLORS, PAYMENT_STATUS_COLORS } from './bookingConstants';

export const BookingCardItem = ({
  b,
  copiedId,
  handleCopyCode,
  handleOpenEdit,
  handleOpenInvoice,
  setDeletingBooking,
  updatingId,
  handleQuickStatusUpdate,
}) => {
  const customerName = b.guestName || b.customerId?.name || 'Guest Customer';
  const customerPhone = b.guestPhone || b.customerId?.phone || '';
  const customerEmail = b.guestEmail || b.customerId?.email || '';
  const formattedTotal = Number(b.totalAmount || 0).toLocaleString('en-IN');
  const formattedPaid = Number(b.paidAmount || 0).toLocaleString('en-IN');
  const formattedBalance = Number(b.balanceAmount || 0).toLocaleString('en-IN');
  const formattedDeposit = Number(b.securityDeposit || 0).toLocaleString('en-IN');

  const waText = encodeURIComponent(
    `Hello ${customerName}! This is CARZODRIVE Odisha regarding your booking (${b.bookingNumber || b._id}):\n` +
    `• Vehicle: ${b.vehicleName || 'Self-Drive Vehicle'}\n` +
    `• Pickup: ${b.pickupDate || 'Scheduled date'} at ${b.pickupLocation || 'Bhubaneswar Hub'}\n` +
    `• Status: ${b.status}\n` +
    `• Payment: ${b.paymentStatus || 'PAID'} (Balance Due: ₹${formattedBalance})\n\n` +
    `Feel free to reach out for any help. Have a wonderful ride!`
  );

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 hover:border-zinc-300 p-5 sm:p-6 transition-all duration-200 shadow-2xs hover:shadow-xs space-y-4">
      {/* Header Row: Code, Badges, Dates & Top Action Icons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 text-white px-3 py-1 rounded-lg">
            <span className="font-mono text-xs font-black tracking-wide">
              {b.bookingNumber || b._id}
            </span>
            <button
              type="button"
              onClick={() => handleCopyCode(b.bookingNumber || b._id, b._id)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy Booking Code"
            >
              {copiedId === b._id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          <span
            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
              STATUS_COLORS[b.status] || STATUS_COLORS.PENDING
            }`}
          >
            Trip: {b.status}
          </span>

          <span
            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
              PAYMENT_STATUS_COLORS[b.paymentStatus] || PAYMENT_STATUS_COLORS.PENDING
            }`}
          >
            Payment: {b.paymentStatus?.replace('_', ' ')}
          </span>
        </div>

        {/* Header Right: Date + Direct Edit/Delete Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            {new Date(b.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          <div className="flex items-center gap-1 pl-2 border-l border-zinc-100">
            {handleOpenInvoice && (
              <button
                type="button"
                onClick={() => handleOpenInvoice(b)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                title="View & Download Tax Invoice / Travel Voucher"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenEdit(b)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              title="Edit Booking"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setDeletingBooking(b)}
              className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Booking"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Vehicle Info (4 cols), Customer Info (4 cols), Financials (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Vehicle Section */}
        <div className="md:col-span-4 flex items-center gap-3">
          {b.vehicleImage ? (
            <img
              src={b.vehicleImage}
              alt={b.vehicleName || 'Vehicle'}
              className="w-16 h-12 object-cover rounded-xl border border-zinc-200 shrink-0 shadow-2xs"
              onError={(e) => {
                e.target.src = '/images/vehicles/mahindra-thar.jpg';
              }}
            />
          ) : (
            <div className="w-16 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6 text-zinc-500" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-black text-zinc-950 truncate">
              {b.vehicleName || 'Self-Drive Vehicle'}
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              {b.serviceType?.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>
                {b.pickupDate} → {b.returnDate} ({b.days || 1} {b.days === 1 ? 'day' : 'days'})
              </span>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="md:col-span-4 space-y-1.5 text-xs">
          <div className="font-bold text-zinc-900 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>{customerName}</span>
          </div>

          {customerPhone && (
            <div className="flex items-center gap-2 text-zinc-600 text-[11px]">
              <Phone className="w-3 h-3 text-zinc-400" />
              <a href={`tel:${customerPhone}`} className="hover:underline font-mono">
                {customerPhone}
              </a>
              <a
                href={`https://wa.me/91${customerPhone.replace(/[^0-9]/g, '')}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Open WhatsApp chat with pre-filled details"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          )}

          {customerEmail && (
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] truncate">
              <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">{customerEmail}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] pt-0.5">
            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="truncate">Hub: {b.pickupLocation || 'SUM Hospital Hub'}</span>
          </div>
        </div>

        {/* Financial Breakdown Section */}
        <div className="md:col-span-4 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-zinc-600">
            <span>Total Booking Rate:</span>
            <span className="font-bold text-zinc-950 font-mono">₹{formattedTotal}</span>
          </div>

          <div className="flex items-center justify-between text-emerald-700">
            <span>Advance Paid Online:</span>
            <span className="font-bold font-mono">₹{formattedPaid}</span>
          </div>

          <div className="flex items-center justify-between text-amber-700 font-bold border-t border-zinc-200 pt-1 font-mono">
            <span>Balance on Pickup:</span>
            <span>₹{formattedBalance}</span>
          </div>

          {Number(b.securityDeposit || 0) > 0 && (
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>Security Deposit (Refundable):</span>
              <span>₹{formattedDeposit}</span>
            </div>
          )}

          {(b.paymentId?.paymentNumber || b.transactionId) && (
            <div className="text-[10px] font-mono text-zinc-600 truncate pt-1 border-t border-zinc-200">
              {b.paymentId?.paymentNumber ? (
                <span>Receipt: <strong className="text-zinc-900">{b.paymentId?.paymentNumber}</strong> • </span>
              ) : null}
              <span>TXN: {b.transactionId || 'ONLINE'}</span>
              <span className="text-zinc-400"> ({b.onlineMethod?.toUpperCase() || b.paymentMode?.toUpperCase()})</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Quick Actions Bar */}
      <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-zinc-500">Quick Trip Status:</span>
          {b.status !== 'CONFIRMED' && (
            <button
              type="button"
              disabled={updatingId === b._id}
              onClick={() => handleQuickStatusUpdate(b._id, 'CONFIRMED')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer disabled:opacity-50"
            >
              Confirm
            </button>
          )}
          {b.status === 'CONFIRMED' && (
            <button
              type="button"
              disabled={updatingId === b._id}
              onClick={() => handleQuickStatusUpdate(b._id, 'ACTIVE')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer disabled:opacity-50"
            >
              Start Trip (Active)
            </button>
          )}
          {b.status === 'ACTIVE' && (
            <button
              type="button"
              disabled={updatingId === b._id}
              onClick={() => handleQuickStatusUpdate(b._id, 'COMPLETED')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-900 text-white border border-zinc-900 hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
            >
              Mark Completed
            </button>
          )}
          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
            <button
              type="button"
              disabled={updatingId === b._id}
              onClick={() => handleQuickStatusUpdate(b._id, 'CANCELLED')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer disabled:opacity-50"
            >
              Cancel Trip
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Payment settlement button */}
          {b.paymentStatus !== 'PAID' && (
            <button
              type="button"
              disabled={updatingId === b._id}
              onClick={() => handleQuickStatusUpdate(b._id, b.status, 'PAID')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 cursor-pointer disabled:opacity-50 transition-colors"
              title="Mark remaining balance as received at hub"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Settle Balance (₹{formattedBalance})</span>
            </button>
          )}

          {handleOpenInvoice && (
            <button
              type="button"
              onClick={() => handleOpenInvoice(b)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              title="Download PDF / Print Tax Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenEdit(b)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
