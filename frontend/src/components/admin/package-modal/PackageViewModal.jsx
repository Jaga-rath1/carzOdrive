import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Pencil,
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Car,
  Navigation,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const PackageViewModal = ({ isOpen, pkg, onClose, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen || !pkg) return null;

  const images = (pkg.images && pkg.images.length > 0)
    ? pkg.images
    : [pkg.image || 'https://images.unsplash.com/photo-1596405835955-4532a4e21245?q=80&w=1200&auto=format&fit=crop'];

  const activeImage = selectedImage || images[0];

  const days = pkg.duration?.days || 2;
  const nights = pkg.duration?.nights || (days > 1 ? days - 1 : 0);
  const durationStr = typeof pkg.duration === 'string'
    ? pkg.duration
    : `${days} Days / ${nights} Nights`;

  const adultPrice = pkg.pricing?.adultPrice || pkg.priceNumeric || 4999;
  const childPrice = pkg.pricing?.childPrice || Math.round(adultPrice * 0.5);
  const infantPrice = pkg.pricing?.infantPrice || 0;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                  {pkg.odishaTheme || pkg.category || 'Odisha Tourism'}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-semibold text-zinc-400">
                  {durationStr}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {pkg.status || 'APPROVED'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {pkg.name || pkg.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(pkg)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Tour</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Top Gallery & Quick Pricing Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Photos */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-inner group">
                <img
                  src={activeImage}
                  alt={pkg.name || pkg.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {pkg.badge || 'Odisha Special'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {pkg.destination}
                  </span>
                  <span className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {durationStr}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImage === img ? 'border-blue-600 scale-105 shadow-md' : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tagline */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  {pkg.tagline || `Exclusive curated tour of ${pkg.destination} celebrating ${pkg.odishaTheme || pkg.category} with premium chauffeur mobility.`}
                </p>
              </div>
            </div>

            {/* Right: Pricing Cards & Key Specs */}
            <div className="md:col-span-6 space-y-4">
              {/* Tariff Breakdown */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Adult Price
                  </span>
                  <span className="text-lg font-black text-blue-950 block mt-0.5">
                    ₹{adultPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold block">
                    per guest
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Child (5-12Y)
                  </span>
                  <span className="text-lg font-black text-zinc-950 block mt-0.5">
                    ₹{childPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold block">
                    with bed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Infant (&lt;5Y)
                  </span>
                  <span className="text-lg font-black text-emerald-950 block mt-0.5">
                    ₹{infantPrice}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    Complimentary
                  </span>
                </div>
              </div>

              {/* Tour Logistics Card */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>Featured Vehicle:</span>
                  </span>
                  <span className="font-bold text-zinc-900">
                    {pkg.featuredVehicle || 'Toyota Innova Crysta / Luxury SUV'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Group Capacity:</span>
                  </span>
                  <span className="font-bold text-zinc-900">
                    {pkg.minPax || 1} to {pkg.maxPax || 12} Persons
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pickup Point:</span>
                  </span>
                  <span className="font-bold text-zinc-900 text-right max-w-[200px] truncate">
                    {pkg.pickupLocation || 'Bhubaneswar Airport / Station'}
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs pt-1">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Drop-off Point:</span>
                  </span>
                  <span className="font-bold text-zinc-900 text-right max-w-[200px] truncate">
                    {pkg.dropLocation || 'Bhubaneswar Hub'}
                  </span>
                </div>
              </div>

              {/* Odisha Circuit Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Circuit Highlights</span>
                  </span>
                  <ul className="space-y-1 text-xs text-amber-950 font-medium">
                    {pkg.highlights.slice(0, 3).map((hl, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {pkg.description && (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 block">
                Tour Overview & Narrative
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed font-normal whitespace-pre-line">
                {pkg.description}
              </p>
            </div>
          )}

          {/* Day-by-Day Itinerary Timeline */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-zinc-200">
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Day-Wise Itinerary Roadmap</span>
              </h3>

              <div className="space-y-3">
                {pkg.itinerary.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono font-black text-xs">
                        {step.day || `Day ${idx + 1}`}
                      </span>
                      <h4 className="text-xs font-black text-zinc-900">
                        {step.title || `Day ${idx + 1} Itinerary`}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed pl-1">
                      {step.description || step.desc}
                    </p>

                    {step.activities && step.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.activities.map((act, actIdx) => (
                          <span
                            key={actIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 text-[11px] font-semibold text-zinc-700"
                          >
                            <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{act}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions vs Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
            {/* Inclusions */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What is Included</span>
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {(pkg.inclusions || []).map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>What is Excluded</span>
              </span>
              <ul className="space-y-1.5 text-xs text-rose-900">
                {(pkg.exclusions || []).map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            Tour ID: <span className="font-mono font-bold text-zinc-700">{pkg._id || pkg.id}</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-300 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(pkg)}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Tour Package</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
