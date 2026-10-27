import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Loader2,
  Banknote,
  X,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { bookingsAPI } from '../../services/api';
import { BookingTableView } from '../../components/admin/bookings/BookingTableView';
import { BookingCardItem } from '../../components/admin/bookings/BookingCardItem';
import { BookingEditModal } from '../../components/admin/bookings/BookingEditModal';
import { BookingDeleteModal } from '../../components/admin/bookings/BookingDeleteModal';
import { AdminCreateBookingModal } from '../../components/admin/bookings/AdminCreateBookingModal';
import { BookingDocumentsModal } from '../../components/admin/bookings/BookingDocumentsModal';
import { InvoiceModal } from '../../components/common/InvoiceModal';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // KYC Documents Modal State
  const [documentsBooking, setDocumentsBooking] = useState(null);

  // Edit Modal State
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Modal State
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Invoice / Voucher Modal State
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  // Manual Create Booking Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await bookingsAPI.getAll({}, { skipCache: true });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.bookings || []);
      setBookings(list);
    } catch (err) {
      console.warn('Failed to fetch bookings:', err);
      if (err.status === 401 || err.message?.toLowerCase().includes('token')) {
        setStatusMessage({
          type: 'auth_error',
          text: 'Your admin session has expired. Click below to sign in and refresh your secure session.',
        });
      } else {
        setStatusMessage({ type: 'error', text: err.message || 'Failed to load bookings' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showNotification = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickStatusUpdate = async (bookingId, newStatus, paymentStatus = undefined) => {
    setUpdatingId(bookingId);
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus, 'Quick update via Admin Portal', paymentStatus);
      showNotification('success', `Booking status changed to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      showNotification('error', err.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal with pre-filled fields
  const handleOpenEdit = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      guestName: booking.guestName || booking.customerId?.name || '',
      guestPhone: booking.guestPhone || booking.customerId?.phone || '',
      guestEmail: booking.guestEmail || booking.customerId?.email || '',
      guestNotes: booking.guestNotes || '',
      vehicleName: booking.vehicleName || '',
      pickupDate: booking.pickupDate || '',
      returnDate: booking.returnDate || '',
      days: booking.days || 1,
      pickupLocation: booking.pickupLocation || 'SUM Hospital Hub',
      dropoffLocation: booking.dropoffLocation || 'Same as Pick-up Address',
      status: booking.status || 'CONFIRMED',
      paymentStatus: booking.paymentStatus || 'PAID',
      paymentMode: booking.paymentMode || 'full',
      onlineMethod: booking.onlineMethod || 'upi',
      totalAmount: booking.totalAmount || 0,
      paidAmount: booking.paidAmount || 0,
      balanceAmount: booking.balanceAmount || 0,
      securityDeposit: booking.securityDeposit || 0,
      transactionId: booking.transactionId || '',
      drivingLicenseNumber: booking.drivingLicenseNumber || '',
      idProofNumber: booking.idProofNumber || '',
    });
  };

  // Auto-calculate balance in Edit Modal
  const handleEditAmountChange = (field, value) => {
    const numVal = Number(value) || 0;
    const updated = { ...editFormData, [field]: numVal };

    if (field === 'totalAmount') {
      updated.balanceAmount = Math.max(0, numVal - (updated.paidAmount || 0));
    } else if (field === 'paidAmount') {
      updated.balanceAmount = Math.max(0, (updated.totalAmount || 0) - numVal);
      if (numVal >= (updated.totalAmount || 0) && (updated.totalAmount || 0) > 0) {
        updated.paymentStatus = 'PAID';
      }
    }
    setEditFormData(updated);
  };

  // Save Edit Changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsSavingEdit(true);
    try {
      await bookingsAPI.update(editingBooking._id, editFormData);
      showNotification('success', `Booking #${editingBooking.bookingNumber || editingBooking._id} updated successfully!`);
      setEditingBooking(null);
      fetchBookings();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save booking updates');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deletingBooking) return;

    setIsDeleting(true);
    try {
      await bookingsAPI.delete(deletingBooking._id);
      showNotification('success', `Booking #${deletingBooking.bookingNumber || deletingBooking._id} has been permanently deleted.`);
      setDeletingBooking(null);
      fetchBookings();
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (b.bookingNumber || '').toLowerCase().includes(q) ||
      (b.guestName || b.customerId?.name || '').toLowerCase().includes(q) ||
      (b.guestPhone || b.customerId?.phone || '').toLowerCase().includes(q) ||
      (b.vehicleName || '').toLowerCase().includes(q) ||
      (b.transactionId || '').toLowerCase().includes(q) ||
      (b.pickupLocation || '').toLowerCase().includes(q);

    let matchesTab = true;
    if (filterTab === 'CONFIRMED') matchesTab = b.status === 'CONFIRMED';
    else if (filterTab === 'PAID') matchesTab = b.paymentStatus === 'PAID';
    else if (filterTab === 'PARTIAL') matchesTab = b.paymentStatus === 'PARTIALLY_PAID' || b.paymentMode === 'partial';
    else if (filterTab === 'OFFLINE') matchesTab = b.paymentMode === 'offline' || b.paymentStatus === 'OFFLINE_PENDING';
    else if (filterTab === 'ACTIVE') matchesTab = b.status === 'ACTIVE';
    else if (filterTab === 'COMPLETED') matchesTab = b.status === 'COMPLETED';
    else if (filterTab === 'CANCELLED') matchesTab = b.status === 'CANCELLED';

    return matchesSearch && matchesTab;
  });

  // Financial Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const collectedRevenue = bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const pendingCollection = bookings.reduce((sum, b) => sum + (b.balanceAmount || 0), 0);
  const totalPaidBookings = bookings.filter((b) => b.paymentStatus === 'PAID').length;
  const totalOfflinePending = bookings.filter((b) => b.paymentMode === 'offline' || b.paymentStatus === 'OFFLINE_PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Bookings & Payment History</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-zinc-900 text-white">
              {bookings.length}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage customer reservations, edit billing details, track payments, or delete test records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${viewMode === 'cards' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              title="Detailed Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              title="Compact Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Refresh bookings from server"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-zinc-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
            title="Create manual booking for walk-in or customer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Book For User</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'auth_error'
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'auth_error' ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          {statusMessage.type === 'auth_error' && (
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors shrink-0 shadow-xs"
            >
              <span>Sign In to Admin Portal</span>
            </a>
          )}
        </div>
      )}

      {/* Key Financial & Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-black text-zinc-950">{bookings.length}</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-medium">{totalPaidBookings} fully paid advance</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue Collected</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{collectedRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600/80 mt-1 font-medium">Bank / UPI advance verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Due on Pickup</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">₹{pendingCollection.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-600/80 mt-1 font-medium">Remaining balance to collect</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pay-on-Pickup Pending</span>
            <Banknote className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-700">{totalOfflinePending}</div>
          <div className="text-[10px] text-sky-600/80 mt-1 font-medium">Cash / WhatsApp offline reservations</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, customer name, mobile, car..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'ACTIVE', label: 'Active Trips' },
            { id: 'PAID', label: '100% Paid' },
            { id: 'PARTIAL', label: 'Token Paid' },
            { id: 'OFFLINE', label: 'Pay on Pickup' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${filterTab === tab.id
                  ? 'bg-black text-white border-black shadow-2xs'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-black'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main View: Cards or Table */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-zinc-200">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs font-bold text-zinc-500">Loading booking vouchers and transactions...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 p-8">
          <CalendarCheck className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900">No Bookings Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            {searchTerm
              ? `No bookings match your search query "${searchTerm}".`
              : 'As customers make reservations, their vouchers and payment logs will appear here.'}
          </p>
          {!searchTerm && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book For Customer Now</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <BookingTableView
          filteredBookings={filteredBookings}
          copiedId={copiedId}
          handleCopyCode={handleCopyCode}
          handleOpenEdit={handleOpenEdit}
          handleOpenInvoice={(b) => setInvoiceBooking(b)}
          handleOpenDocuments={(b) => setDocumentsBooking(b)}
          setDeletingBooking={setDeletingBooking}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <BookingCardItem
              key={b._id}
              b={b}
              copiedId={copiedId}
              handleCopyCode={handleCopyCode}
              handleOpenEdit={handleOpenEdit}
              handleOpenInvoice={(b) => setInvoiceBooking(b)}
              handleOpenDocuments={(b) => setDocumentsBooking(b)}
              setDeletingBooking={setDeletingBooking}
              updatingId={updatingId}
              handleQuickStatusUpdate={handleQuickStatusUpdate}
            />
          ))}
        </div>
      )}

      {/* Customer KYC Documents Inspection & Verification Modal */}
      <BookingDocumentsModal
        isOpen={Boolean(documentsBooking)}
        onClose={() => setDocumentsBooking(null)}
        booking={documentsBooking}
        onBookingUpdated={(updated) => {
          if (updated) {
            setBookings((prev) =>
              prev.map((item) =>
                (item._id === updated._id || item.id === updated.id) ? { ...item, ...updated } : item
              )
            );
            if (documentsBooking && (documentsBooking._id === updated._id || documentsBooking.id === updated.id)) {
              setDocumentsBooking((prev) => ({ ...prev, ...updated }));
            }
          }
          fetchBookings();
        }}
      />

      {/* Edit Booking Modal */}
      <BookingEditModal
        editingBooking={editingBooking}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleEditAmountChange={handleEditAmountChange}
        handleSaveEdit={handleSaveEdit}
        isSavingEdit={isSavingEdit}
        onClose={() => setEditingBooking(null)}
      />

      {/* Delete Confirmation Modal */}
      <BookingDeleteModal
        deletingBooking={deletingBooking}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
        onClose={() => setDeletingBooking(null)}
      />

      {/* Official Tax Invoice & Travel Voucher Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceBooking)}
        booking={invoiceBooking}
        bookingIdOrCode={invoiceBooking?.bookingNumber || invoiceBooking?._id}
        onClose={() => setInvoiceBooking(null)}
      />

      {/* Admin Manual Booking Creation Modal */}
      <AdminCreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newBooking) => {
          if (newBooking) {
            setBookings((prev) => [
              newBooking,
              ...prev.filter((x) => (x._id || x.id) !== (newBooking._id || newBooking.id)),
            ]);
            setInvoiceBooking(newBooking);
            showNotification(
              'success',
              `Booking #${newBooking.bookingNumber || newBooking._id} confirmed & invoice generated!`
            );
          }
          fetchBookings();
        }}
      />
    </div>
  );
};
