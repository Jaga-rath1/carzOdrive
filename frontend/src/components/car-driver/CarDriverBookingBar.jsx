import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Car, CheckCircle2, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

export const CarDriverBookingBar = ({ selectedCar, onQuickBook }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('2026-10-14');
  const [time, setTime] = useState('10:00');
  const [carType, setCarType] = useState(selectedCar || 'Mercedes-Benz S-Class Maybach');
  const [bookedSubmitted, setBookedSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onQuickBook) {
      onQuickBook({
        pickupLocation: pickup || 'SUM Hospital',
        dropLocation: destination || 'Hotel / Office',
        pickupDate: date,
        serviceType: 'car-with-driver',
      });
    } else {
      setBookedSubmitted(true);
    }
  };

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
              <button
                type="button"
                onClick={() => setBookedSubmitted(false)}
                className="text-xs font-bold text-blue-400 hover:underline pt-2 cursor-pointer"
              >
                Modify Reservation
              </button>
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
                      placeholder="e.g. SUM Hospital / Jayadev Vatika"
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
                      <option value="Mercedes-Benz S-Class Maybach">Mercedes Maybach</option>
                      <option value="BMW 7 Series Protection">BMW 7 Series</option>
                      <option value="Toyota Vellfire VIP Lounge">Toyota Vellfire</option>
                      <option value="Audi A8 L Quattro">Audi A8 L</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>Confirm Chauffeur Ride</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
};
