import React from 'react';
import {
  Car,
  Fuel,
  Users,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Cog,
  Sparkles
} from 'lucide-react';

export const AdminVehicleCard = ({ car, onView, onEdit, onDelete }) => {
  const primaryImg = (car.images && car.images[0]) || car.image || '/images/vehicles/placeholder.jpg';
  const price = car.pricing?.dailyRate || car.pricePerDay || car.priceNumeric || 1999;
  const isAvailable = car.isAvailable !== false && car.availableCount !== 0;

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Car Image Header */}
        <div
          className="relative aspect-[16/10] overflow-hidden bg-zinc-900 cursor-pointer"
          onClick={() => onView(car)}
        >
          <img
            src={primaryImg}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
              {car.category || 'Sedan'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-zinc-900 shadow-xs uppercase">
              {car.registrationNumber || car.rcNumber || car.vehicleNumber || 'OD-FLEET'}
            </span>
          </div>

          {/* Bottom Price Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow-md">
            <span>
              ₹{Number(price).toLocaleString('en-IN')}{' '}
              <span className="text-[10px] text-zinc-300 font-normal">/ day</span>
            </span>
            <span className="text-[11px] text-zinc-200 truncate max-w-[140px]">
              {car.brand}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <div>
            <h3
              onClick={() => onView(car)}
              className="text-base font-black text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {car.name}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mt-0.5">
              <span>{car.year || 2024}</span>
              <span>•</span>
              <span className="truncate">{car.color || 'Pearl White'}</span>
            </div>
            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
              {car.tagline || 'Self-drive rental with doorstep delivery & zero hidden charges'}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-1.5 my-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600">
            <div className="flex items-center gap-1 truncate">
              <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{car.seats || 5} Seats</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Fuel className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{car.fuel || car.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Cog className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{car.transmission || 'Manual'}</span>
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
              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
          }`}
        >
          {isAvailable ? `ACTIVE (${car.availableCount || 1} units)` : 'RESERVED'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(car)}
            className="p-2 rounded-xl text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-all"
            title="View car specifications & host info"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(car)}
            className="p-2 rounded-xl text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-all"
            title="Edit car & Cloudinary photos"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(car._id, car.name)}
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
