import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  IndianRupee,
  Calendar,
  MapPin,
  Car,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Phone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Container } from '../../components/common/Container';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { bookingsAPI, getCurrentUser } from '../../services/api';

export const MyBookingsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const executeLookup = async (query) => {
    if (!query || !query.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSearched(true);

    try {
      const cleanQuery = query.trim();

      // Check if it's a booking voucher code lookup
      if (cleanQuery.toUpperCase().startsWith('CZ-') || cleanQuery.toUpperCase().startsWith('CRZ-')) {
        try {
          const res = await bookingsAPI.getByCode(cleanQuery.toUpperCase());
          if (res?.data) {
            setBookings([res.data]);
            return;
          }
        } catch (voucherErr) {
          console.warn('Voucher code direct lookup error, falling back to general lookup', voucherErr);
        }
      }

      // Public lookup by phone, booking code, or email (never requires token)
      const res = await bookingsAPI.lookup(cleanQuery);
      if (res?.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        setBookings([]);
        setErrorMessage('No booking found matching your search. Please check the booking code (e.g. CZ-2026-X892) or 10-digit mobile number.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'No booking found matching your search. Please check the booking code or mobile number.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyBookings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await bookingsAPI.getAll();
      setBookings(res?.data || []);
      setSearched(true);
    } catch (err) {
      console.warn('Could not auto-fetch user bookings:', err);
      if (currentUser?.phone || currentUser?.email) {
        try {
          const fallbackRes = await bookingsAPI.lookup(currentUser.phone || currentUser.email);
          setBookings(fallbackRes?.data || []);
          setSearched(true);
        } catch {
          // silently continue
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-detect booking code or phone from routing location.state or query params
  useEffect(() => {
    const codeParam = searchParams.get('code') || searchParams.get('bookingId') || location.state?.bookingCode;
    const phoneParam = searchParams.get('phone') || location.state?.phone;

    if (codeParam) {
      setSearchQuery(codeParam);
      executeLookup(codeParam);
    } else if (phoneParam) {
      setSearchQuery(phoneParam);
      executeLookup(phoneParam);
    } else if (currentUser) {
      loadMyBookings();
    }
  }, [location.state, searchParams]);

  const handleLookup = async (e) => {
    e.preventDefault();
    executeLookup(searchQuery);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden">
      {/* Light Ambient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] bg-gradient-to-r from-blue-100/50 via-sky-100/40 to-indigo-100/50 rounded-full blur-[110px] pointer-events-none" />

      <Container className="w-full max-w-6xl xl:max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Page Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Official Booking & Voucher Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            My Bookings & Payment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            View your confirmed vehicle reservations, track real-time advance & balance payments, download official GST Tax Invoices, or print travel vouchers.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.05)] max-w-3xl mx-auto w-full">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking Code (e.g. CZ-...), 10-digit Phone, or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <span>Find My Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Retrieving your reservation records...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
              <span>Found {bookings.length} reservation{bookings.length > 1 ? 's' : ''} & payment record{bookings.length > 1 ? 's' : ''}</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Vouchers</span>
              </button>
            </div>

            {bookings.map((b) => {
              const formattedTotal = Number(b.totalAmount || 0).toLocaleString('en-IN');
              const formattedPaid = Number(b.paidAmount || 0).toLocaleString('en-IN');
              const formattedBalance = Number(b.balanceAmount || 0).toLocaleString('en-IN');

              return (
                <div
                  key={b._id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_6px_25px_rgba(0,0,0,0.06)] hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  {/* Top Bar: Code & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black px-3.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                        {b.bookingNumber || b._id}
                      </span>
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Payment Mode: <strong className="text-slate-950 capitalize">{b.paymentMode || 'Online'}</strong>
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                        b.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.paymentStatus === 'PARTIALLY_PAID'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}>
                        {b.paymentStatus?.replace('_', ' ') || 'CONFIRMED'}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle & Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-5 flex items-center gap-4">
                      {b.vehicleImage ? (
                        <img
                          src={b.vehicleImage}
                          alt={b.vehicleName || 'Vehicle'}
                          className="w-20 h-16 object-cover rounded-2xl border border-slate-200 shrink-0 shadow-xs"
                          onError={(e) => {
                            e.target.src = '/images/vehicles/mahindra-thar.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Car className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-black text-slate-950">{b.vehicleName || 'Self-Drive Vehicle'}</h3>
                        <p className="text-xs text-slate-500 capitalize">{b.serviceType?.replace(/-/g, ' ')}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{b.pickupDate} → {b.returnDate} ({b.days || 1} Days)</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 text-xs space-y-1">
                      <div className="text-slate-600 font-semibold">
                        Guest: <span className="text-slate-950 font-bold">{b.guestName || b.customerId?.name}</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pickup Hub: {b.pickupLocation || 'SUM Hospital Bhubaneswar'}</span>
                      </div>
                      {(b.paymentId?.paymentNumber || b.transactionId) && (
                        <div className="text-[11px] font-mono text-blue-700 pt-1 font-bold">
                          Receipt: {b.paymentId?.paymentNumber || b.transactionId}
                        </div>
                      )}
                      {b.transactionId && (
                        <div className="text-[10px] font-mono text-slate-400">
                          TXN: {b.transactionId} ({b.onlineMethod?.toUpperCase() || b.paymentMode?.toUpperCase() || 'UPI'})
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Total Rate:</span>
                        <span className="font-bold text-slate-950">₹{formattedTotal}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Advance Paid:</span>
                        <span>₹{formattedPaid}</span>
                      </div>
                      <div className="flex justify-between text-amber-700 font-bold border-t border-slate-200 pt-1 mt-1">
                        <span>Due at Pickup:</span>
                        <span>₹{formattedBalance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Support Callout */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Official GST Tax Invoice & Confirmed Travel Voucher available for this reservation.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tax Invoice / Voucher</span>
                      </button>

                      <a
                        href={`https://wa.me/917978000000?text=${encodeURIComponent(`Hello CARZODRIVE! I need support regarding my booking: ${b.bookingNumber || b._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searched ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-950">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              We couldn't find any reservation for this code or phone number. If you just placed an order, please allow 1 minute for database sync.
            </p>
            <div className="mt-5">
              <Link
                to="/car-self-ride"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
              >
                <span>Browse Available Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Sparkles className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-950">Track Your Active Trip or Rental</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Enter your booking code from your SMS or WhatsApp confirmation message above to view your car/bike pickup voucher.
            </p>
          </div>
        )}
      </Container>

      <InvoiceModal
        isOpen={Boolean(selectedInvoiceBooking)}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
        bookingIdOrCode={selectedInvoiceBooking?.bookingNumber || selectedInvoiceBooking?._id}
      />
    </div>
  );
};
