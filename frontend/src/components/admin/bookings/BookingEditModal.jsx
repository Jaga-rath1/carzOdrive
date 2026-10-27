import React from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3,
  X,
  User,
  Car,
  IndianRupee,
  ShieldCheck,
  Check,
  Loader2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { resolveDocumentUrl } from '../../../utils/documentUtils';

export const BookingEditModal = ({
  editingBooking,
  editFormData,
  setEditFormData,
  handleEditAmountChange,
  handleSaveEdit,
  isSavingEdit,
  onClose,
}) => {
  if (!editingBooking || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-black tracking-tight">
                Edit Booking #{editingBooking.bookingNumber || editingBooking._id}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Update customer contact, trip dates, vehicle model, and payment ledger
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSaveEdit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-zinc-700">
          {/* Section 1: Customer Contact Info */}
          <div className="space-y-3">
            <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-zinc-100">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>Customer Contact Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.guestName}
                  onChange={(e) => setEditFormData({ ...editFormData, guestName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Mobile Phone (10 digits)</label>
                <input
                  type="text"
                  required
                  value={editFormData.guestPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, guestPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editFormData.guestEmail}
                  onChange={(e) => setEditFormData({ ...editFormData, guestEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 1.5: KYC Documents & Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
              <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer KYC & Identity Documents</span>
              </h4>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  editingBooking.documentsVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {editingBooking.documentsVerified ? 'KYC Verified' : 'KYC Pending Verification'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Driving License Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. OD02 20180012345"
                  value={editFormData.drivingLicenseNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, drivingLicenseNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono uppercase outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Aadhaar / Passport / ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5421 8976 1234"
                  value={editFormData.idProofNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, idProofNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono uppercase outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Document Links / Previews */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {editingBooking.drivingLicenseDoc && (
                <a
                  href={resolveDocumentUrl(editingBooking.drivingLicenseDoc)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View DL Document</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}
              {editingBooking.idProofDoc && (
                <a
                  href={resolveDocumentUrl(editingBooking.idProofDoc)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View ID Proof</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}
              {editingBooking.documents && editingBooking.documents.length > 0 && (
                <span className="text-xs text-zinc-500 font-semibold">
                  + {editingBooking.documents.length} additional document{editingBooking.documents.length > 1 ? 's' : ''} in record
                </span>
              )}
              {!editingBooking.drivingLicenseDoc && !editingBooking.idProofDoc && (!editingBooking.documents || editingBooking.documents.length === 0) && (
                <span className="text-[11px] text-zinc-400 italic">No document files attached yet</span>
              )}
            </div>
          </div>

          {/* Section 2: Trip & Vehicle Info */}
          <div className="space-y-3">
            <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-zinc-100">
              <Car className="w-3.5 h-3.5 text-zinc-500" />
              <span>Vehicle & Trip Schedule</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Vehicle / Model Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.vehicleName}
                  onChange={(e) => setEditFormData({ ...editFormData, vehicleName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={editFormData.pickupDate}
                  onChange={(e) => setEditFormData({ ...editFormData, pickupDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Return Date</label>
                <input
                  type="date"
                  value={editFormData.returnDate}
                  onChange={(e) => setEditFormData({ ...editFormData, returnDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.days}
                  onChange={(e) => setEditFormData({ ...editFormData, days: Number(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Pickup Hub / Location</label>
                <input
                  type="text"
                  value={editFormData.pickupLocation}
                  onChange={(e) => setEditFormData({ ...editFormData, pickupLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financials & Payment Status */}
          <div className="space-y-3">
            <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-zinc-100">
              <IndianRupee className="w-3.5 h-3.5 text-zinc-500" />
              <span>Financial Breakdown & Payments</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Total Rate (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.totalAmount}
                  onChange={(e) => handleEditAmountChange('totalAmount', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-emerald-700 mb-1">Paid Online (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.paidAmount}
                  onChange={(e) => handleEditAmountChange('paidAmount', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono font-bold text-emerald-800 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-700 mb-1">Balance Due (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.balanceAmount}
                  onChange={(e) => setEditFormData({ ...editFormData, balanceAmount: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono font-bold text-amber-800 outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Deposit (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.securityDeposit}
                  onChange={(e) => setEditFormData({ ...editFormData, securityDeposit: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-700 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Payment Status</label>
                <select
                  value={editFormData.paymentStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
                >
                  <option value="PAID">PAID (100% Received)</option>
                  <option value="PARTIALLY_PAID">PARTIALLY_PAID (Token Advance)</option>
                  <option value="OFFLINE_PENDING">OFFLINE_PENDING (Pay at Hub)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Payment Mode</label>
                <select
                  value={editFormData.paymentMode}
                  onChange={(e) => setEditFormData({ ...editFormData, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
                >
                  <option value="full">Full Online</option>
                  <option value="partial">Partial (Token)</option>
                  <option value="offline">Offline / WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g. CF-TXN-12345"
                  value={editFormData.transactionId}
                  onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Operational Status & Notes */}
          <div className="space-y-3">
            <h4 className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-zinc-100">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Trip Lifecycle & Admin Notes</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Trip Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="ACTIVE">ACTIVE (On Trip)</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Customer requested extra helmet; verified Aadhaar on arrival"
                  value={editFormData.guestNotes}
                  onChange={(e) => setEditFormData({ ...editFormData, guestNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingEdit}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSavingEdit ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
