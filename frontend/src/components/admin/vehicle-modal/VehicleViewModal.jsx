import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Pencil,
  Car,
  Gauge,
  Zap,
  Fuel,
  Timer,
  Cog,
  Users,
  Briefcase,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
  User,
  Phone,
  Mail,
  ExternalLink,
  Scale,
  Eye
} from 'lucide-react';
import { resolveDocumentUrl } from '../../../utils/documentUtils';

export const VehicleViewModal = ({ isOpen, vehicle, onClose, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen || !vehicle) return null;

  const images = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [vehicle.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop'];

  const activeImage = selectedImage || images[0];
  const specs = vehicle.specs || {};
  const isAvailable = vehicle.isAvailable !== false && vehicle.availableCount !== 0;

  const specsList = [
    { label: 'Seating Capacity', value: vehicle.seats ? `${vehicle.seats} Seats` : (specs.seats || '5 Seats'), icon: Users },
    { label: 'Transmission', value: vehicle.transmission || specs.transmission || 'Manual / Automatic', icon: Cog },
    { label: 'Fuel Type', value: vehicle.fuel || vehicle.fuelType || specs.fuelType || 'Petrol', icon: Fuel },
    { label: 'Fuel Economy', value: vehicle.mileage ? (String(vehicle.mileage).includes('km') ? vehicle.mileage : `${vehicle.mileage} km/l`) : (specs.mileage || '18-22 km/l'), icon: Fuel },
    { label: 'Horsepower', value: vehicle.power || specs.power || '115 HP', icon: Zap },
    { label: 'Engine', value: vehicle.engineCapacity || specs.engine || '1.5L Inline-4', icon: Gauge },
    { label: 'Top Speed', value: vehicle.topSpeed || specs.topSpeed || '175 km/h', icon: Timer },
    { label: 'Luggage Volume', value: vehicle.luggage || specs.luggage || '2 Large + 2 Small Bags', icon: Briefcase },
    { label: 'Airbags & Safety', value: specs.airbags || '6 Airbags (Dual Front + Side)', icon: ShieldCheck },
    { label: 'Buying Year', value: vehicle.buyingYear || vehicle.year || 2024, icon: Calendar },
  ];

  const features = vehicle.features && vehicle.features.length > 0
    ? vehicle.features
    : [
        'Full Climate Control Air Conditioning',
        'Touchscreen Infotainment with Apple CarPlay & Android Auto',
        'Keyless Push Button Start & Smart Entry',
        'Reverse Parking Camera with Ultrasonic Sensors',
        'Comprehensive Zero-Dep Insurance Included',
        '24x7 Roadside Assistance across Odisha Hubs',
      ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-400">
                  {vehicle.brand || 'Premium'}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  {vehicle.category || 'Sedan'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {isAvailable ? `ACTIVE (${vehicle.availableCount || 1} units)` : 'RESERVED'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {vehicle.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(vehicle)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Car</span>
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
          
          {/* Top Gallery & Quick Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Photos & Gallery */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-inner group">
                <img
                  src={activeImage}
                  alt={vehicle.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {vehicle.badge || 'Verified Fleet Vehicle'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Color: {vehicle.color || 'Pearl White'}
                  </span>
                  <span className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {vehicle.transmission || 'Manual / Auto'}
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
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  {vehicle.tagline || `Top-rated ${vehicle.brand} ${vehicle.name} available for self-drive and chauffeur rentals across Odisha.`}
                </p>
              </div>
            </div>

            {/* Right: Pricing Cards & Location */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Pricing Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Daily Self-Drive
                  </span>
                  <span className="text-xl font-black text-blue-950 block mt-0.5">
                    ₹{Number(vehicle.pricing?.dailyRate || vehicle.pricePerDay || vehicle.priceNumeric || 1999).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                    per calendar day
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Hourly Tariff
                  </span>
                  <span className="text-xl font-black text-zinc-950 block mt-0.5">
                    ₹{Number(vehicle.pricePerHour || vehicle.pricing?.extraHourCharge || 150).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold block mt-0.5">
                    per extra hour
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Security Deposit
                  </span>
                  <span className="text-xl font-black text-emerald-950 block mt-0.5">
                    ₹{Number(vehicle.pricing?.securityDeposit || vehicle.depositNumeric || vehicle.securityDeposit || 3000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    100% Refundable
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    Extra KM Charge
                  </span>
                  <span className="text-xl font-black text-purple-950 block mt-0.5">
                    ₹{Number(vehicle.pricing?.extraKmCharge || vehicle.extraKmCharge || 12)}
                  </span>
                  <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">
                    per extra kilometer
                  </span>
                </div>
              </div>

              {/* Registration & Hub Location */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">Registration / Vehicle No:</span>
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200 uppercase">
                    {vehicle.registrationNumber || vehicle.rcNumber || vehicle.vehicleNumber || 'OD-02-AB-1234'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">Available Fleet Units:</span>
                  <span className="font-bold text-zinc-900">
                    {vehicle.availableCount || 1} Unit(s) Ready in Hub
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Hub Station:</span>
                  </div>
                  <span className="font-bold text-zinc-900 text-right max-w-[200px] truncate">
                    {typeof vehicle.location === 'object'
                      ? `${vehicle.location.city || 'Bhubaneswar'}, ${vehicle.location.state || 'Odisha'}`
                      : (vehicle.location || 'Bhubaneswar Central Station')}
                  </span>
                </div>
              </div>

              {/* Host / Vendor & RC Document Info */}
              {(vehicle.ownerName || vehicle.ownerPhone || vehicle.rcDocumentUrl) && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Host & Compliance Details
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      {vehicle.ownerName || 'Verified Fleet Partner'}
                    </span>
                    {vehicle.ownerPhone && (
                      <span className="text-zinc-600 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {vehicle.ownerPhone}
                      </span>
                    )}
                  </div>
                  {vehicle.rcDocumentUrl && (
                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Registration Certificate (RC)</span>
                      </span>
                      <a
                        href={resolveDocumentUrl(vehicle.rcDocumentUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View RC</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="space-y-3 pt-2 border-t border-zinc-200">
            <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Technical Specifications & Engineering Benchmarks</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {specsList.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border text-center transition-all bg-zinc-50 hover:bg-white border-zinc-200/80 text-zinc-900"
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1.5 text-blue-600" />
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block truncate">
                      {spec.label}
                    </span>
                    <span className="text-xs font-black text-zinc-950 block mt-0.5 truncate">
                      {spec.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standard Features Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-200">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Vehicle Features & Factory Equipment</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            Car ID: <span className="font-mono font-bold text-zinc-700">{vehicle._id || vehicle.id}</span>
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
              onClick={() => onEdit?.(vehicle)}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Car Specs</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
