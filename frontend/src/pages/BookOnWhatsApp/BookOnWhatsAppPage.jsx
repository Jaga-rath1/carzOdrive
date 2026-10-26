import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Car,
  Bike,
  Compass,
  UserCheck,
  Info,
  ExternalLink,
  Shield,
  Clock3,
} from 'lucide-react';
import { Container } from '../../components/common/Container';
import { openWhatsAppChat, getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';
import { CONTACT_CONFIG } from '../../config/contact';
import { getCurrentUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { getTodayDateString, getCurrentTimeString } from '../../utils/formatters';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';

export const BookOnWhatsAppPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Resolve booking intent data from location.state or sessionStorage or fallback defaults
  const bookingData = useMemo(() => {
    let raw = location.state;
    if (!raw) {
      try {
        const stored = sessionStorage.getItem('carzodrive_whatsapp_booking_intent');
        if (stored) {
          raw = JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }

    const defaultService = SERVICE_OPTIONS[0];
    return {
      activeTab: raw?.activeTab || 'self-drive-car',
      activeService: raw?.activeService || defaultService,
      currentSelectedItem: raw?.currentSelectedItem || {
        id: 'swift-2026',
        name: 'Swift 2026 New Model',
        color: 'Magma Grey',
        pricePerDay: 1499,
        priceDisplay: '₹1,499/day',
        seats: '5 Seats',
        deposit: '₹0 (Zero Deposit)',
        image: '/images/vehicles/swift-2026-grey.jpg',
      },
      pickupLocation: raw?.pickupLocation || BHUBANESWAR_LOCATIONS[0] || 'SUM Hospital',
      dropLocation: raw?.dropLocation || 'Same as Pick-up Location',
      pickupDate: raw?.pickupDate || getTodayDateString(0),
      pickupTime: raw?.pickupTime || getCurrentTimeString(30),
      returnDate: raw?.returnDate || getTodayDateString(2),
      returnTime: raw?.returnTime || '18:00',
      tripDays: raw?.tripDays || 2,
    };
  }, [location.state]);

  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // 2. Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    try {
      const user = currentUser || getCurrentUser();
      if (user) {
        if (user.name && !name) setName(user.name);
        if (user.phone && !phone) {
          const clean = String(user.phone).replace(/[^0-9]/g, '');
          setPhone(clean.slice(-10));
        }
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(clean);
    if (error) setError('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError('');
  };

  const handleSendToWhatsApp = (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!isAuthenticated) {
      setError('Please login or create an account to confirm your WhatsApp booking.');
      openAuthModal('login');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name so our support team knows who they are chatting with.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit WhatsApp mobile number.');
      return;
    }

    const effectivePickup = bookingData.pickupLocation;
    const effectiveDrop =
      bookingData.dropLocation === 'Same as Pick-up Location' || !bookingData.dropLocation
        ? bookingData.pickupLocation
        : bookingData.dropLocation;

    const itemName =
      bookingData.currentSelectedItem?.name ||
      (bookingData.activeTab === 'driver-only'
        ? 'Verified Commercial Driver (Provided by Company)'
        : 'Selected Fleet Vehicle');

    const priceRate =
      bookingData.currentSelectedItem?.priceDisplay ||
      (bookingData.currentSelectedItem?.pricePerDay
        ? `₹${bookingData.currentSelectedItem.pricePerDay}/day`
        : '');

    const message = getQuickBookingWhatsAppMessage({
      serviceName: bookingData.activeService?.label || 'Car Rental Service',
      vehicleName: itemName,
      pickupDate: `${bookingData.pickupDate} (${bookingData.pickupTime})`,
      returnDate: `${bookingData.returnDate} (${bookingData.returnTime})`,
      days: bookingData.activeTab === 'tour-packages' ? 1 : bookingData.tripDays,
      location: effectivePickup,
      dropLocation: effectiveDrop,
      total: priceRate
        ? `${priceRate} (Estimated for ${bookingData.tripDays} ${bookingData.tripDays === 1 ? 'Day' : 'Days'})`
        : '',
      deposit: bookingData.currentSelectedItem?.deposit || '₹0 (Zero Security Deposit)',
      guestName: name.trim(),
      guestPhone: cleanPhone,
      notes: notes.trim(),
    });

    setLastMessage(message);
    setIsSubmitted(true);
    openWhatsAppChat(message);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const serviceIcon = useMemo(() => {
    switch (bookingData.activeTab) {
      case 'self-drive-bike':
        return Bike;
      case 'driver-only':
        return UserCheck;
      case 'tour-packages':
        return Compass;
      case 'car-with-driver':
        return ShieldCheck;
      case 'self-drive-car':
      default:
        return Car;
    }
  }, [bookingData.activeTab]);

  const ServiceIconComponent = serviceIcon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 sm:pt-28 pb-16 sm:pb-24 relative overflow-hidden">
      {/* SOFT LIGHT AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] sm:w-[950px] h-[320px] bg-gradient-to-r from-emerald-100/60 via-teal-100/50 to-sky-100/60 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-72 right-12 w-[350px] h-[260px] bg-emerald-100/50 rounded-full blur-[90px] pointer-events-none" />

      {/* REFINED LIGHT CYBER MESH ACCENT */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.12) 1px, transparent 1px), linear-gradient(to right, rgba(226, 232, 240, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 32px 32px, 32px 32px',
        }}
      />

      <Container className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* 1. TOP HEADER & NAVIGATION BAR WITH BACK BUTTON */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-slate-900 transition-all text-xs sm:text-sm font-bold shadow-xs cursor-pointer group active:scale-95"
              title="Return to Previous Screen or Home"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate max-w-[140px] sm:max-w-none">
                WhatsApp Booking
              </span>
            </div>
          </div>

          {/* LIVE STATUS BADGE */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>Bhubaneswar Desk Online • Instant Confirmation</span>
          </div>
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
            <span>Direct WhatsApp Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Confirm Your Ride on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
              WhatsApp
            </span>
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Zero advance deposit required! Enter your name and WhatsApp number below. Our team in Bhubaneswar
            will instantly verify vehicle availability and confirm your reservation directly on WhatsApp.
          </p>
        </div>

        {/* 3. TWO-COLUMN SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN: SELECTED TRIP & VEHICLE SNAPSHOT (WHITE CARD)
             ======================================================== */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              {/* TOP ACCENT LINE */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <ServiceIconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">Your Selected Ride</h2>
                    <p className="text-xs text-emerald-700 font-bold">
                      {bookingData.activeService?.label || 'Rental Service'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  Zero Deposit
                </span>
              </div>

              {/* VEHICLE PREVIEW CARD */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-4">
                <div className="flex items-center gap-4">
                  {bookingData.currentSelectedItem?.image ? (
                    <img
                      src={bookingData.currentSelectedItem.image}
                      alt={bookingData.currentSelectedItem.name || 'Vehicle'}
                      className="w-24 h-16 object-cover rounded-xl border border-slate-200 bg-white shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/vehicles/swift-2026-grey.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Car className="w-8 h-8 text-emerald-600/70" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                      {bookingData.currentSelectedItem?.name || 'Standard Fleet Vehicle'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      {bookingData.currentSelectedItem?.seats && (
                        <span>{bookingData.currentSelectedItem.seats}</span>
                      )}
                      {bookingData.currentSelectedItem?.color && (
                        <>
                          <span>•</span>
                          <span>{bookingData.currentSelectedItem.color}</span>
                        </>
                      )}
                    </div>
                    {bookingData.currentSelectedItem?.priceDisplay && (
                      <div className="text-sm font-black text-emerald-600 mt-1">
                        {bookingData.currentSelectedItem.priceDisplay}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TRIP ITINERARY DETAILS */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] text-slate-500 block font-semibold">Pick-up Hub</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {bookingData.pickupLocation}
                    </span>
                  </div>
                </div>

                {bookingData.dropLocation &&
                  bookingData.dropLocation !== 'Same as Pick-up Location' &&
                  bookingData.dropLocation !== bookingData.pickupLocation && (
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-slate-500 block font-semibold">Drop-off Hub</span>
                        <span className="font-bold text-slate-900 truncate block">
                          {bookingData.dropLocation}
                        </span>
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Pick-up</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{bookingData.pickupDate}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{bookingData.pickupTime}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Return</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{bookingData.returnDate}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{bookingData.returnTime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="text-slate-600 font-medium">Total Duration:</span>
                  <span className="font-black text-emerald-700">
                    {bookingData.tripDays} {bookingData.tripDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
              </div>

              {/* CHANGE CAR / DATES ACTION */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Need to modify car or dates?</span>
                <Link
                  to="/"
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
                >
                  <span>Edit on Home</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* TRUST PILLARS */}
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px]">100% Insured Fleet</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                <Clock3 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="font-semibold text-[11px]">45-Min Hub Delivery</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: GUEST FORM (NAME, PHONE, NOTES, WHATSAPP CTA, BACK)
             ======================================================== */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-emerald-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(16,185,129,0.08)] relative overflow-hidden">
              {/* TOP EMERALD ACCENT GLOW BAR */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-xs" />

              {/* CARD TITLE */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">Enter Contact Details</h2>
                  <p className="text-xs text-slate-500">
                    We will format your booking request and open it directly in WhatsApp
                  </p>
                </div>
              </div>

              {/* POST-SUBMISSION BANNER */}
              {isSubmitted && (
                <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <div className="font-extrabold text-slate-900">
                        WhatsApp Chat Launched Successfully!
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Please check your WhatsApp window to press <strong>Send</strong>. Our team in
                        Bhubaneswar will reply within 5 minutes to confirm car allocation.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => openWhatsAppChat(lastMessage)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Re-open WhatsApp Chat</span>
                        </button>
                        <a
                          href={`tel:+${CONTACT_CONFIG.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call Hotline ({CONTACT_CONFIG.phoneDisplay})</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUTH REQUIRED NOTICE BANNER */}
              {!isAuthenticated && (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold text-base shrink-0">
                      🔒
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                        Login or Sign Up Required
                      </span>
                      <span className="text-[11px] text-amber-800 font-medium">
                        You must be signed in to confirm your booking with CARZODRIVE.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}

              {/* ERROR ALERT */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Info className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSendToWhatsApp} className="space-y-4">
                {/* 1. FULL NAME */}
                <div>
                  <label htmlFor="wa-full-name" className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="wa-full-name"
                      type="text"
                      required
                      placeholder="e.g. Soumya Ranjan Mohapatra"
                      value={name}
                      onChange={handleNameChange}
                      className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-xl pl-10 pr-3.5 py-3 outline-none transition-all placeholder:text-slate-400 shadow-xs"
                      autoFocus
                    />
                  </div>
                </div>

                {/* 2. PHONE NUMBER */}
                <div>
                  <label htmlFor="wa-phone-number" className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold select-none">
                      🇮🇳 +91
                    </span>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="wa-phone-number"
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number (e.g. 9876543210)"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-900 rounded-r-xl pl-9 pr-3.5 py-3 outline-none transition-all placeholder:text-slate-400 shadow-xs"
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    We will send your key handover voucher & vehicle location directly to this WhatsApp number.
                  </p>
                </div>

                {/* 3. OPTIONAL NOTES / PICKUP LANDMARK */}
                <div>
                  <label htmlFor="wa-notes" className="text-xs font-bold text-slate-700 block mb-1.5">
                    Pickup Landmark / Special Notes <span className="text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="wa-notes"
                      type="text"
                      placeholder="e.g. Deliver near SUM Hospital Gate 2 or Airport Arrival Gate"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition-all placeholder:text-slate-400 shadow-xs"
                    />
                  </div>
                </div>

                {/* 4. ACTIONS: SEND TO WHATSAPP & GO BACK */}
                <div className="pt-3 space-y-3">
                  {/* PRIMARY OPTION: SEND TO WHATSAPP */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.45)] transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
                    title="Send Details to WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Send to WhatsApp</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* SECONDARY OPTION: BACK BUTTON */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-500" />
                      <span>Back to Home Screen</span>
                    </button>

                    <Link
                      to="/"
                      className="shrink-0 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors text-center"
                    >
                      Change Vehicle
                    </Link>
                  </div>
                </div>

                {/* PRIVACY & ZERO PAYMENT GUARANTEE */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pay at pickup — No credit card required</span>
                  </div>
                  <span className="text-slate-400">🔒 100% Privacy Protected</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM TRUST BADGES */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-emerald-600">⚡ &lt; 5 Mins</div>
            <div className="text-xs font-bold text-slate-800 mt-1">Instant Confirmation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Quick booking via WhatsApp chat</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-cyan-600">₹0 Deposit</div>
            <div className="text-xs font-bold text-slate-800 mt-1">Zero Security Deposit</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Keep your money in your bank</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-amber-600">45 Mins</div>
            <div className="text-xs font-bold text-slate-800 mt-1">Doorstep Delivery</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Anywhere in Bhubaneswar</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-xl sm:text-2xl font-black text-indigo-600">100% Free</div>
            <div className="text-xs font-bold text-slate-800 mt-1">Easy Cancellation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Up to 6 hours before pickup</div>
          </div>
        </div>
      </Container>
    </div>
  );
};
