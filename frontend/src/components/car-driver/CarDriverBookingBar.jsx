import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Car, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { Container } from '../common/Container';
import { vehiclesAPI } from '../../services/api';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';
import { getTodayDateString } from '../../utils/formatters';

export const CarDriverBookingBar = ({ selectedCar, onQuickBook }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [fleet, setFleet] = useState([]);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(() => getTodayDateString(1));
  const [time, setTime] = useState('10:00');
  const [carType, setCarType] = useState(selectedCar || '');
  const [bookedSubmitted, setBookedSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFleet() {
      try {
        const res = await vehiclesAPI.getAll();
        if (res?.data && isMounted) {
          const list = res.data.map((c) => ({
            id: c.slug || c._id,
            _id: c._id,
            name: c.name,
            price: `₹${(c.pricing?.withDriver?.daily || (c.pricePerDay ? c.pricePerDay + 500 : 3499)).toLocaleString('en-IN')}/day`,
            type: c.type || c.category || 'Executive Sedan',
            isAvailable: c.isAvailable !== false,
            rawVehicle: c,
          }));
          setFleet(list);
          if (list.length > 0 && !carType) {
            setCarType(selectedCar || list[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load chauffeur fleet for booking bar:', err);
      }
    }
    loadFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync selectedCar prop when changed from vehicle cards
  useEffect(() => {
    if (selectedCar && fleet.some((c) => c.name === selectedCar && c.isAvailable !== false)) {
      setCarType(selectedCar);
    }
  }, [selectedCar, fleet]);

  const selectedVehicleObj = fleet.find((c) => c.name === carType) || fleet[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (onQuickBook) {
      onQuickBook({
        pickupLocation: pickup || 'SUM Hospital, Bhubaneswar',
        dropLocation: destination || 'Hotel / Office',
        pickupDate: date,
        serviceType: 'car-with-driver',
        vehicle: selectedVehicleObj,
      });
    } else {
      setBookedSubmitted(true);
    }
  };

  const whatsappMessage = `Hello CARZODRIVE! 👋\n\nI want to book a Car with Driver (Executive Chauffeur):\n🚗 Vehicle: ${carType}\n📍 Pickup: ${pickup || 'SUM Hospital, Bhubaneswar'}\n🏁 Destination: ${destination || 'Hotel / Office'}\n📅 Date: ${date}\n⏰ Time: ${time}\n\nPlease confirm availability and rate quote!`;

  return (
    <section id="booking-form-section" className="py-16 sm:py-20 bg-slate-900 text-white relative">
      <Container>
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
              DIRECT RESERVATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Book With Driver
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Confirm your pickup details for instant chauffeur assignment.
            </p>
          </div>

          {bookedSubmitted ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Chauffeur Request Queued!</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Your luxury ride in the <strong>{carType}</strong> has been received. Our concierge officer will call you to confirm flight/pickup coordinates.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <WhatsAppButton
                  message={whatsappMessage}
                  label="Confirm on WhatsApp"
                  size="md"
                  className="w-full sm:w-auto"
                />
                <button
                  type="button"
                  onClick={() => setBookedSubmitted(false)}
                  className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Modify Reservation
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pickup Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="e.g. SUM Hospital / Airport Terminal"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Drop-off Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Corporate HQ / Puri Beach Resort"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pickup Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      min={getTodayDateString(0)}
                      value={date}
                      onChange={(e) => {
                        const val = e.target.value;
                        const today = getTodayDateString(0);
                        setDate(val && val < today ? today : val);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pickup Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Select Vehicle *
                  </label>
                  <div className="relative">
                    <Car className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {fleet.map((c) => (
                        <option
                          key={c.id || c.name}
                          value={c.name}
                          disabled={c.isAvailable === false}
                        >
                          {c.isAvailable !== false
                            ? `${c.name} — ${c.price} (${c.type})`
                            : `${c.name} — Currently Unavailable`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <AuthRequiredNotice
                  title="Login Required to Book Chauffeur"
                  message="Please sign in or create an account to book your executive car with verified chauffeur."
                  className="my-1 bg-amber-950/40 border-amber-500/30 text-amber-200"
                />
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {!isAuthenticated ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <Link
                      to="/login"
                      state={{ returnTo: '/car-with-driver' }}
                      className="flex-1 py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Login to Confirm Chauffeur Ride</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="py-3 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      Popup
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirm Chauffeur Ride</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <WhatsAppButton
                  message={whatsappMessage}
                  label="Book via WhatsApp"
                  variant="outline"
                  size="lg"
                  className="sm:w-auto justify-center bg-slate-900 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                />
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
};
