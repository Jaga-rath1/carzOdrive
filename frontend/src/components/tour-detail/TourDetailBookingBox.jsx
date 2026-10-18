import React, { useState } from 'react';
import { Calendar, Users, ArrowRight, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const TourDetailBookingBox = ({ tour, onOpenQuickBook }) => {
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [travelers, setTravelers] = useState('2 Adults');

  const handleReserve = () => {
    onOpenQuickBook?.({
      serviceType: 'tour-packages',
      vehicle: tour,
      tour: tour,
      packageId: tour.packageId || tour._id || tour.id,
      name: tour.title || tour.name,
      location: tour.destination,
      pickupDate: departureDate,
      departureDate,
      travelers,
      price: tour.startingPrice,
    });
  };

  return (
    <div className="sticky top-28 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 space-y-6">
      {/* Price Header */}
      <div className="pb-5 border-b border-slate-100 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Package Starting From
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-950">
              {tour.startingPrice}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ couple</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{tour.duration}</span>
          </span>
        </div>
      </div>

      {/* Date & Guests Pickers */}
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            Preferred Start Date
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-blue-600" />
            Number of Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="Couple (2 Adults)">Couple (2 Adults)</option>
            <option value="Family (3-4 Persons)">Family (3-4 Persons)</option>
            <option value="Group Caravan (5-8 Persons)">Group Caravan (5-8 Persons)</option>
            <option value="Solo Traveler">Solo Traveler</option>
          </select>
        </div>
      </div>

      {/* Primary Actions: Reserve + WhatsApp */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleReserve}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-[0_6px_20px_rgba(37,99,235,0.35)] cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>Reserve Tour Package</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <WhatsAppButton
          message={getTourWhatsAppMessage(tour)}
          label="Inquire via WhatsApp"
          size="lg"
          variant="solid"
          className="w-full rounded-2xl py-3.5 text-sm"
        />
      </div>

      {/* Guarantees */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Vehicle fuel, driver batta & tolls bundled upfront.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Customizable stops and flexible timings.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Verified 5-star verified chauffeur accompaniment.</span>
        </div>
      </div>
    </div>
  );
};
