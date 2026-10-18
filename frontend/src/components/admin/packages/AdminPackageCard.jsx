import React from 'react';
import {
  Calendar,
  MapPin,
  Car,
  Users,
  Eye,
  Pencil,
  Trash2,
  Sparkles
} from 'lucide-react';

export const AdminPackageCard = ({ pkg, onView, onEdit, onDelete }) => {
  const coverImage =
    (pkg.images && pkg.images[0]) ||
    pkg.image ||
    'https://images.unsplash.com/photo-1596405835955-4532a4e21245?q=80&w=1200&auto=format&fit=crop';

  const adultPrice = pkg.pricing?.adultPrice || pkg.priceNumeric || 4999;
  const days = pkg.duration?.days || 2;
  const nights = pkg.duration?.nights || (days > 1 ? days - 1 : 0);
  const durationStr =
    typeof pkg.duration === 'string'
      ? pkg.duration
      : `${days} Days / ${nights} Nights`;

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Photo Header */}
        <div
          className="relative aspect-[16/10] overflow-hidden bg-zinc-900 cursor-pointer"
          onClick={() => onView(pkg)}
        >
          <img
            src={coverImage}
            alt={pkg.name || pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
              {pkg.badge || 'Odisha Special'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-xs">
              {pkg.odishaTheme || pkg.category || 'Theme'}
            </span>
          </div>

          {/* Bottom Duration & Destination */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow-md">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {durationStr}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{pkg.destination}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3
              onClick={() => onView(pkg)}
              className="text-base font-black text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {pkg.name || pkg.title}
            </h3>
            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
              {pkg.tagline ||
                pkg.description ||
                'Exclusive curated Odisha tour package with dedicated chauffeur and priority assistance.'}
            </p>
          </div>

          {/* Featured Vehicle Tag */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 font-semibold">
            <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              {pkg.featuredVehicle || 'Toyota Innova Crysta / Luxury SUV'}
            </span>
          </div>

          {/* Pricing Overview */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Starting Tariff
              </span>
              <span className="text-lg font-black text-zinc-950 block">
                ₹{adultPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">per guest</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Capacity
              </span>
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1 justify-end mt-0.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {pkg.minPax || 1} - {pkg.maxPax || 12} Pax
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {pkg.status || 'APPROVED'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(pkg)}
            className="p-2 rounded-xl text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-all"
            title="View full package roadmap & itinerary"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(pkg)}
            className="p-2 rounded-xl text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-all"
            title="Edit package details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(pkg._id, pkg.name || pkg.title)}
            className="p-2 rounded-xl text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-all"
            title="Delete tour package"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
