import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, CheckCircle2, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { CHAUFFEUR_CARS } from './CarDriverFleetGrid';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const CarDriverBookingBar = ({ selectedCar, onQuickBook }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('2026-10-14');
  const [time, setTime] = useState('10:00');
  const firstAvailableCar = CHAUFFEUR_CARS.find((c) => c.isAvailable !== false)?.name || 'Hyundai Creta (2026)';
  const [carType, setCarType] = useState(
    selectedCar && CHAUFFEUR_CARS.find((c) => c.name === selectedCar && c.isAvailable !== false)
      ? selectedCar
      : firstAvailableCar
  );
  const [bookedSubmitted, setBookedSubmitted] = useState(false);

  // Sync selectedCar prop when changed from vehicle cards (only if available)
  useEffect(() => {
    if (selectedCar && CHAUFFEUR_CARS.find((c) => c.name === selectedCar && c.isAvailable !== false)) {
      setCarType(selectedCar);
    }
  }, [selectedCar]);

  const selectedVehicleObj = CHAUFFEUR_CARS.find((c) => c.name === carType) || CHAUFFEUR_CARS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
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
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
                      {CHAUFFEUR_CARS.map((c) => (
                        <option
                          key={c.id}
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

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm Chauffeur Ride</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

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
