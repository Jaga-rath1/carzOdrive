import React from 'react';
import {
  Bike,
  Zap,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';

export const AdminBikeCard = ({ bike, onView, onEdit, onDelete }) => {
  const primaryImg = (bike.images && bike.images[0]) || bike.image || '/images/vehicles/hero-splendor.jpg';
  const price = bike.pricePerDay || bike.priceNumeric || 499;
  const stockCount = bike.quantity !== undefined ? bike.quantity : (bike.availableCount ?? (bike.isAvailable !== false ? 1 : 0));
  const isAvailable = bike.isAvailable !== false && stockCount > 0 && bike.availabilityStatus !== 'Currently Unavailable';

  const engineDisplay = bike.engineCC
    ? `${bike.engineCC} cc Engine`
    : bike.engineCapacity
    ? (String(bike.engineCapacity).includes('cc') ? `${bike.engineCapacity} Engine` : `${bike.engineCapacity} cc Engine`)
    : bike.specs?.engine
    ? (String(bike.specs.engine).includes('cc') ? bike.specs.engine : `${bike.specs.engine} cc`)
    : '350 cc Engine';

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Bike Image Header */}
        <div
          className="relative aspect-[16/10] overflow-hidden bg-zinc-900 cursor-pointer"
          onClick={() => onView(bike)}
        >
          <img
            src={primaryImg}
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
              {bike.category || 'Motorcycle'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-zinc-900 shadow-xs uppercase">
              {bike.registrationNumber || bike.rcNumber || 'OD-BIKE'}
            </span>
          </div>

          {/* Bottom Price Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow-md">
            <span>
              ₹{Number(price).toLocaleString('en-IN')}{' '}
              <span className="text-[10px] text-zinc-300 font-normal">/ day</span>
            </span>
            <span className="text-[11px] text-zinc-200 truncate max-w-[140px]">
              {bike.brand}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <div>
            <h3
              onClick={() => onView(bike)}
              className="text-base font-black text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {bike.name}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mt-0.5">
              <span>{bike.buyingYear || bike.year || 2024}</span>
              <span>•</span>
              <span className="truncate">{bike.color || 'Stealth Black'}</span>
            </div>
            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
              {bike.tagline || 'Two-wheeler rental with free helmets & zero paperwork'}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 my-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600">
            <div className="flex items-center gap-1.5 truncate">
              <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate font-bold text-zinc-900">{engineDisplay}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">
                {typeof bike.location === 'object' ? (bike.location?.city || 'Bhubaneswar') : (bike.location || 'Bhubaneswar')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {isAvailable ? `ACTIVE (${stockCount} units)` : 'CURRENTLY UNAVAILABLE (0 units)'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(bike)}
            className="p-2 rounded-xl text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-all"
            title="View bike specifications & host info"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(bike)}
            className="p-2 rounded-xl text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-all"
            title="Edit bike & Cloudinary photos"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(bike._id, bike.name)}
            className="p-2 rounded-xl text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-all"
            title="Remove from fleet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
