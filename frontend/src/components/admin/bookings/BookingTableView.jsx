import React from 'react';
import { Copy, Check, Edit3, Trash2, FileText } from 'lucide-react';
import { STATUS_COLORS, PAYMENT_STATUS_COLORS } from './bookingConstants';

export const BookingTableView = ({
  filteredBookings,
  copiedId,
  handleCopyCode,
  handleOpenEdit,
  handleOpenInvoice,
  setDeletingBooking,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600">
          <thead className="bg-zinc-50 text-zinc-700 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200">
            <tr>
              <th className="py-3 px-4">Booking Code</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle / Fleet</th>
              <th className="py-3 px-4">Trip Dates</th>
              <th className="py-3 px-4">Financials</th>
              <th className="py-3 px-4">Trip Status</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredBookings.map((b) => {
              const customerName = b.guestName || b.customerId?.name || 'Guest Customer';
              const customerPhone = b.guestPhone || b.customerId?.phone || '';
              const total = Number(b.totalAmount || 0).toLocaleString('en-IN');
              const paid = Number(b.paidAmount || 0).toLocaleString('en-IN');
              const balance = Number(b.balanceAmount || 0).toLocaleString('en-IN');

              return (
                <tr key={b._id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-black text-zinc-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{b.bookingNumber || b._id.slice(-8)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(b.bookingNumber || b._id, b._id)}
                        className="text-zinc-400 hover:text-black cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedId === b._id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-zinc-900">{customerName}</div>
                    {customerPhone && (
                      <div className="text-[11px] text-zinc-500 font-mono">{customerPhone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-zinc-900">{b.vehicleName || 'Vehicle'}</div>
                    <div className="text-[10px] uppercase font-semibold text-zinc-400">
                      {b.serviceType?.replace(/-/g, ' ')}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>{b.pickupDate || 'Scheduled'}</div>
                    <div className="text-[11px] text-zinc-400">
                      {b.days || 1} day{(b.days || 1) > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    <div className="font-bold text-zinc-900">₹{total}</div>
                    <div className="text-[11px] text-emerald-600">Paid: ₹{paid}</div>
                    {Number(b.balanceAmount || 0) > 0 && (
                      <div className="text-[10px] text-amber-600 font-bold">Due: ₹{balance}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        STATUS_COLORS[b.status] || STATUS_COLORS.PENDING
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        PAYMENT_STATUS_COLORS[b.paymentStatus] || PAYMENT_STATUS_COLORS.PENDING
                      }`}
                    >
                      {b.paymentStatus?.replace('_', ' ')}
                    </span>
                    {(b.paymentId?.paymentNumber || b.transactionId) && (
                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        {b.paymentId?.paymentNumber || b.transactionId}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {handleOpenInvoice && (
                        <button
                          type="button"
                          onClick={() => handleOpenInvoice(b)}
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View & Download Tax Invoice / Voucher"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Edit Booking"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBooking(b)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
