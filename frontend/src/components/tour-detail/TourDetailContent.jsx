import React from 'react';
import { Calendar, CheckCircle2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const TourDetailContent = ({ tour }) => {
  return (
    <div className="space-y-10">
      {/* Cover Image Banner */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">
            {tour.duration} • {tour.category}
          </span>
          <h2 className="text-xl sm:text-3xl font-black">{tour.destination}</h2>
        </div>
      </div>

      {/* Highlights List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-black text-slate-950">Tour Highlights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tour.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-semibold">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day by Day Itinerary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-black text-slate-950">Detailed Day-by-Day Itinerary</h3>
        </div>
        <div className="space-y-3">
          {tour.itinerary.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-400/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-black uppercase">
                  {step.day}
                </span>
                <span className="text-sm font-black text-slate-900">{step.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-black text-slate-950">What’s Included in the Package</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tour.inclusions.map((inc, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs font-semibold text-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{inc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
