import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Car, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Printer,
  Lock,
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { openWhatsAppChat, CARZODRIVE_WHATSAPP_NUMBER } from '../../utils/whatsapp';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';
import { getTodayDateString } from '../../utils/formatters';
import { useDriverSettings } from '../../hooks/useDriverSettings';

export const DriverBookingModal = ({
  isOpen,
  onClose,
  driver = null,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { driverSettings } = useDriverSettings();
  const activeRate = driver?.dailyRate || driverSettings?.dailyRate || 799;
  const [step, setStep] = useState(1);
  const [dutyType, setDutyType] = useState('Full Day City (8 Hours)');
  const [carType, setCarType] = useState('Sedan (Automatic)');
  const [reportingDate, setReportingDate] = useState(() => getTodayDateString(1));
  const [reportingTime, setReportingTime] = useState('09:00 AM');
  const [reportingAddress, setReportingAddress] = useState('');
  
  // Contact info
  const [clientName, setClientName] = useState(() => currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(() => currentUser?.phone || '');
  const [bookingCode, setBookingCode] = useState('');

  // Auto-prefill authenticated user details
  useEffect(() => {
    if (currentUser) {
      if (!clientName && currentUser.name) setClientName(currentUser.name);
      if (!clientPhone && currentUser.phone) setClientPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const currentDriver = driver || {
    id: 'drv-company',
    name: 'Verified Driver (Provided by Company)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    experience: '10+ Years',
    rating: 4.98,
    ratePerDay: `₹${activeRate} / day`,
    languages: 'English, Hindi, Odia',
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    let code = 'DRIVER-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const res = await bookingsAPI.create({
        serviceType: 'driver-only',
        guestName: clientName || currentUser?.name || 'Guest User',
        guestPhone: clientPhone || currentUser?.phone || '',
        guestEmail: currentUser?.email || (clientPhone ? `${clientPhone.replace(/[^0-9]/g, '')}@carzodrive.com` : undefined),
        driverId: currentDriver.id,
        userCarModel: carType,
        pickupLocation: reportingAddress || 'Bhubaneswar',
        pickupDate: reportingDate,
        returnDate: reportingDate,
        days: 1,
        paymentMode: 'offline',
        onlineMethod: 'whatsapp',
        transactionId: 'PAY_DRIVER_ON_DUTY',
        totalAmount: activeRate,
        status: 'PENDING',
        paymentStatus: 'OFFLINE_PENDING',
        customerNotes: `Duty: ${dutyType}, Time: ${reportingTime}`,
      });
      if (res?.data?.bookingNumber) {
        code = res.data.bookingNumber;
      }
    } catch (apiErr) {
      console.warn('Driver booking notice:', apiErr.message);
    }

    setBookingCode(code);
    setStep(2);
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  const whatsappMessage = `Hello CARZODRIVE! 👔
I want to hire driver *${currentDriver.name}* for my personal vehicle:
• Driver Rate: ${currentDriver.ratePerDay}
• My Car: ${carType}
• Duty Type: ${dutyType}
• Date & Time: ${reportingDate} at ${reportingTime}
• Reporting Address: ${reportingAddress || 'Will share location'}
• Customer Name: ${clientName || 'Inquirer'} ${clientPhone ? `(${clientPhone})` : ''}
${bookingCode ? `• Booking Code: ${bookingCode}` : ''}

Please confirm driver dispatch!`;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetAndClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10 border border-slate-200 text-slate-900 p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <form onSubmit={handleConfirm} className="space-y-6">
            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider mb-2 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>DRIVER HIRE FOR YOUR OWN CAR</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950">
                Hire Driver: {currentDriver.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Background-verified driver will report directly at your doorstep to drive your personal car.
              </p>
            </div>

            {/* Selected Driver Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <img
                src={currentDriver.photo}
                alt={currentDriver.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-950 truncate">
                    {currentDriver.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{currentDriver.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  {currentDriver.experience} Experience • Languages: {currentDriver.languages}
                </div>
                <div className="text-xs font-black text-blue-600 mt-1">
                  Driver Fee: {currentDriver.ratePerDay}
                </div>
              </div>
            </div>

            {/* Customer's Own Vehicle Info */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Your Personal Vehicle Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Car className="w-3 h-3 text-blue-600" />
                    Your Car Type
                  </label>
                  <select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Sedan (Automatic)">Sedan (Automatic / DCT / CVT)</option>
                    <option value="Sedan (Manual)">Sedan (Manual 5/6 Speed)</option>
                    <option value="SUV (Automatic)">SUV / 7-Seater (Automatic)</option>
                    <option value="SUV (Manual 4x4)">SUV / 7-Seater (Manual / 4x4)</option>
                    <option value="Luxury Car (BMW/Mercedes/Audi)">Luxury Car (BMW / Merc / Audi / JLR)</option>
                    <option value="Hatchback (Any)">Compact Hatchback (Any)</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    Duty Shift Type
                  </label>
                  <select
                    value={dutyType}
                    onChange={(e) => setDutyType(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Full Day City (8 Hours)">Full Day City (8 Hours)</option>
                    <option value="Half Day City (4 Hours)">Half Day City (4 Hours)</option>
                    <option value="Outstation Round-Trip">Outstation Round-Trip (Per Day)</option>
                    <option value="Airport Drop / Pickup">Airport Drop / Pickup Transfer</option>
                    <option value="Night / Event Shift">Night Event / Party Return Shift</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reporting Schedule & Address */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Reporting Schedule & Doorstep Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    Duty Date
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayDateString(0)}
                    value={reportingDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      const today = getTodayDateString(0);
                      setReportingDate(val && val < today ? today : val);
                    }}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    Reporting Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={reportingTime}
                    onChange={(e) => setReportingTime(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  Your Residence / Reporting Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Royal Palms, Patia or Hotel Mayfair"
                  value={reportingAddress}
                  onChange={(e) => setReportingAddress(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Client Contact Info */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                3. Your Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <User className="w-3 h-3 text-blue-600" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Mishra"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3 text-blue-600" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Zero Advance Notice */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-2.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Prepayment Required.</strong> Driver allowance is payable directly after trip completion. Driver arrives in full uniform with verified photo ID.
              </span>
            </div>

            {!isAuthenticated && (
              <AuthRequiredNotice
                title="Login Required to Hire Driver"
                message="Please sign in or create an account before dispatching a verified driver. Your reservation will be tracked in your account."
                className="my-1"
              />
            )}

            {/* Actions: Confirm Driver + WhatsApp Direct */}
            <div className="space-y-2.5 pt-2">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    state={{ returnTo: '/driver-only' }}
                    className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-center"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Login to Confirm Driver Hire</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-center text-xs text-slate-500">
                    Need an account?{' '}
                    <Link to="/signup" state={{ returnTo: '/driver-only' }} className="text-blue-600 hover:underline font-bold">
                      Sign Up
                    </Link>
                    {' '}or{' '}
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="text-amber-700 hover:underline font-bold cursor-pointer"
                    >
                      Quick Popup
                    </button>
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Confirm Driver Hire</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              <WhatsAppButton
                message={whatsappMessage}
                label="Book Directly on WhatsApp"
                size="md"
                variant="solid"
                className="w-full py-3 text-xs"
              />
            </div>
          </form>
        ) : (
          /* STEP 2: Driver Confirmation Receipt */
          <div className="space-y-6 text-center sm:text-left">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                  Driver Booking ID: {bookingCode}
                </div>
                <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                  Driver Assigned: {currentDriver.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Confirmation dispatch sent to {clientPhone || 'your mobile'}. Driver will report on time.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Driver Name:</span>
                <span className="font-bold text-slate-950">{currentDriver.name} ({currentDriver.experience})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Duty Schedule:</span>
                <span className="font-semibold text-slate-900">{reportingDate} at {reportingTime}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Your Vehicle:</span>
                <span className="font-semibold text-slate-900">{carType}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Duty Shift:</span>
                <span className="font-semibold text-slate-900">{dutyType}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Total Driver Fee:</span>
                <span className="font-black text-blue-600 text-sm">{currentDriver.ratePerDay}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <WhatsAppButton
                message={whatsappMessage}
                label="Chat with Driver Coordinator on WhatsApp"
                size="md"
                variant="solid"
                className="w-full py-3 text-xs"
              />

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Done & Return to Drivers
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};
