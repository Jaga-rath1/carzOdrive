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
  AlertCircle
} from 'lucide-react';
import { Container } from '../../components/common/Container';
import { bookingsAPI, getCurrentUser } from '../../services/api';

export const MyBookingsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
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
    <div className="pt-28 pb-20 bg-slate-950 text-white min-h-screen">
      <Container className="max-w-4xl space-y-8">
        {/* Page Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <CalendarCheck className="w-4 h-4" />
            <span>Official Booking & Voucher Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Bookings & Payment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            View your active vehicle reservations, download confirmed booking receipts, or track payment status in real-time.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking Code (e.g. CZ-...) or 10-digit Phone Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 border border-blue-500 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Retrieving your reservation records...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>Found {bookings.length} reservation{bookings.length > 1 ? 's' : ''}</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold"
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
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-slate-700 transition-all"
                >
                  {/* Top Bar: Code & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black px-3.5 py-1 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        {b.bookingNumber || b._id}
                      </span>
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Payment Mode: <strong className="text-white capitalize">{b.paymentMode || 'Online'}</strong>
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        b.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : b.paymentStatus === 'PARTIALLY_PAID'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
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
                          className="w-20 h-16 object-cover rounded-2xl border border-slate-800 shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/vehicles/mahindra-thar.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0">
                          <Car className="w-8 h-8 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-black text-white">{b.vehicleName || 'Self-Drive Vehicle'}</h3>
                        <p className="text-xs text-slate-400 capitalize">{b.serviceType?.replace(/-/g, ' ')}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>{b.pickupDate} → {b.returnDate} ({b.days || 1} Days)</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 text-xs space-y-1">
                      <div className="text-slate-300 font-semibold">
                        Guest: <span className="text-white font-bold">{b.guestName || b.customerId?.name}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pickup Hub: {b.pickupLocation || 'SUM Hospital Bhubaneswar'}</span>
                      </div>
                      {(b.paymentId?.paymentNumber || b.transactionId) && (
                        <div className="text-[11px] font-mono text-blue-400/90 pt-1">
                          Payment Receipt: {b.paymentId?.paymentNumber || b.transactionId}
                        </div>
                      )}
                      {b.transactionId && (
                        <div className="text-[10px] font-mono text-slate-500">
                          TXN: {b.transactionId} ({b.onlineMethod?.toUpperCase() || b.paymentMode?.toUpperCase() || 'UPI'})
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Total Rate:</span>
                        <span className="font-bold text-white">₹{formattedTotal}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Advance Paid:</span>
                        <span>₹{formattedPaid}</span>
                      </div>
                      <div className="flex justify-between text-amber-400 font-bold border-t border-slate-800 pt-1 mt-1">
                        <span>Due at Pickup:</span>
                        <span>₹{formattedBalance}</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support Callout */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Need to reschedule or modify pickup time? Contact our 24x7 Odisha operations desk.
                    </span>

                    <a
                      href={`https://wa.me/917978000000?text=${encodeURIComponent(`Hello CARZODRIVE! I need support regarding my booking: ${b.bookingNumber || b._id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searched ? (
          <div className="py-16 text-center bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              We couldn't find any reservation for this code or phone number. If you just placed an order, please allow 1 minute for database sync.
            </p>
            <div className="mt-5">
              <Link
                to="/car-self-ride"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
              >
                <span>Browse Available Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
            <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Track Your Active Trip or Rental</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Enter your booking code from your SMS or WhatsApp confirmation message above to view your car/bike pickup voucher.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};
