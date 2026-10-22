import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Loader2 } from 'lucide-react';

export const BookingDeleteModal = ({
  deletingBooking,
  isDeleting,
  handleConfirmDelete,
  onClose,
}) => {
  if (!deletingBooking || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-zinc-950">Delete Booking Record?</h3>
          <p className="text-xs text-zinc-500">
            Are you sure you want to permanently delete reservation{' '}
            <span className="font-mono font-bold text-zinc-900">
              #{deletingBooking.bookingNumber || deletingBooking._id}
            </span>{' '}
            for <span className="font-bold text-zinc-900">{deletingBooking.guestName || 'Customer'}</span>?
          </p>
          <p className="text-[11px] text-rose-600 font-semibold pt-1">
            ⚠️ This will permanently remove the voucher and payment entry from MongoDB. This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
          >
            No, Keep It
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
