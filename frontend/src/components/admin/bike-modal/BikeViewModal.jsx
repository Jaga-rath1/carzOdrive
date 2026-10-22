import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Pencil,
  Gauge,
  Zap,
  Fuel,
  Timer,
  Cog,
  ShieldCheck,
  Scale,
  Calendar,
  Sparkles,
  MapPin,
  Bike,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Eye
} from 'lucide-react';
import { resolveDocumentUrl } from '../../../utils/documentUtils';

export const BikeViewModal = ({ isOpen, bike, onClose, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen || !bike) return null;

  const images = (bike.images && bike.images.length > 0)
    ? bike.images
    : [bike.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop'];

  const activeImage = selectedImage || images[0];

  const engineDisplay = bike.engineCC
    ? `${bike.engineCC} cc`
    : bike.engineCapacity
    ? (String(bike.engineCapacity).includes('cc') ? bike.engineCapacity : `${bike.engineCapacity} cc`)
    : bike.specs?.engine
    ? (String(bike.specs.engine).includes('cc') ? bike.specs.engine : `${bike.specs.engine} cc`)
    : '350 cc';

  const isAvailable = bike.isAvailable !== false && bike.availableCount !== 0;

  const specsList = [
    { label: 'Engine Capacity', value: engineDisplay, icon: Gauge, highlight: true },
    { label: 'Max Power', value: bike.power || bike.specs?.power || '20.2 HP @ 6100 rpm', icon: Zap },
    { label: 'Peak Torque', value: bike.torque || bike.specs?.torque || '27 Nm @ 4000 rpm', icon: Sparkles },
    { label: 'Fuel Economy', value: bike.mileage || bike.specs?.mileage || '35-45 km/l', icon: Fuel },
    { label: 'Top Speed', value: bike.topSpeed || bike.specs?.topSpeed || '120 km/h', icon: Timer },
    { label: 'Transmission', value: bike.transmission || bike.specs?.transmission || '5-Speed Manual', icon: Cog },
    { label: 'Braking System', value: bike.brakes || bike.specs?.brakes || 'Dual-Channel ABS', icon: ShieldCheck },
    { label: 'Fuel Type', value: bike.fuelType || bike.specs?.fuelType || 'Petrol', icon: Fuel },
    { label: 'Dry Weight', value: bike.dryWeight || bike.specs?.dryWeight || '195 kg', icon: Scale },
    { label: 'Manufacturing Year', value: bike.buyingYear || bike.year || 2024, icon: Calendar },
  ];

  const features = bike.features && bike.features.length > 0
    ? bike.features
    : [
        'Dual-Channel Anti-Lock Braking (ABS)',
        'Digital Instrument Cluster with Trip Meter',
        'Tubeless High-Grip All-Weather Tyres',
        'USB Mobile Charging Port Onboard',
        'Engine Kill Switch & Side Stand Sensor',
        'Halogen Headlamp with LED Pilot Ring',
      ];

  const gearItems = bike.gearIncluded && bike.gearIncluded.length > 0
    ? bike.gearIncluded
    : [
        '2x ISI-Certified Full Face Safety Helmets',
        'Vehicle Toolkit & First Aid Emergency Kit',
        '24x7 Roadside Assistance across Odisha Hubs',
        'Full Fuel Tank at Pickup (Return Equal)',
      ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-400">
                  {bike.brand}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  {bike.category || 'Motorcycle'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {isAvailable ? `ACTIVE (${bike.availableCount || 1} units)` : 'RESERVED'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {bike.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(bike)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Bike</span>
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
                  alt={bike.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {bike.badge || 'Verified Two-Wheeler'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Color: {bike.color || 'Stealth Black'}
                  </span>
                  <span className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {engineDisplay}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
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

              {/* Tagline / Description */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  {bike.tagline || `Top-rated ${bike.brand} ${bike.name} available for self-drive daily rental across Bhubaneswar and Odisha tourist circuits.`}
                </p>
              </div>
            </div>

            {/* Right: Pricing Cards & Location */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Pricing Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Daily Rental Rate
                  </span>
                  <span className="text-xl font-black text-blue-950 block mt-0.5">
                    ₹{Number(bike.pricePerDay || bike.priceNumeric || 499).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                    per calendar day
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Hourly Rate
                  </span>
                  <span className="text-xl font-black text-zinc-950 block mt-0.5">
                    ₹{Number(bike.pricePerHour || Math.round((bike.pricePerDay || 499) / 10)).toLocaleString('en-IN')}
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
                    ₹{Number(bike.depositNumeric || bike.securityDeposit || 1500).toLocaleString('en-IN')}
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
                    ₹{Number(bike.extraKmCharge || 4)}
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
                    {bike.registrationNumber || bike.rcNumber || 'OD-02-AX-2024'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">Available Units:</span>
                  <span className="font-bold text-zinc-900">
                    {bike.availableCount || 1} Bike(s) Ready
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Hub Station:</span>
                  </div>
                  <span className="font-bold text-zinc-900 text-right max-w-[200px] truncate">
                    {typeof bike.location === 'object'
                      ? `${bike.location.city || 'Bhubaneswar'}, ${bike.location.state || 'Odisha'}`
                      : (bike.location || 'Bhubaneswar Central Hub')}
                  </span>
                </div>
              </div>

              {/* Host / Owner & RC Document Info */}
              {(bike.ownerName || bike.ownerPhone || bike.rcDocumentUrl) && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Vendor / Host & Compliance Details
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      {bike.ownerName || 'Verified Partner'}
                    </span>
                    {bike.ownerPhone && (
                      <span className="text-zinc-600 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {bike.ownerPhone}
                      </span>
                    )}
                  </div>
                  {bike.rcDocumentUrl && (
                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Registration Certificate (RC)</span>
                      </span>
                      <a
                        href={resolveDocumentUrl(bike.rcDocumentUrl)}
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Technical Specifications & Performance Benchmarks</span>
              </h3>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Verified Engine CC: {engineDisplay}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {specsList.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      spec.highlight
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md col-span-2 sm:col-span-1'
                        : 'bg-zinc-50 hover:bg-white border-zinc-200/80 text-zinc-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1.5 ${spec.highlight ? 'text-white' : 'text-blue-600'}`} />
                    <span className={`text-[10px] uppercase font-bold block truncate ${
                      spec.highlight ? 'text-blue-100' : 'text-zinc-500'
                    }`}>
                      {spec.label}
                    </span>
                    <span className={`text-xs font-black block mt-0.5 truncate ${
                      spec.highlight ? 'text-white text-sm' : 'text-zinc-950'
                    }`}>
                      {spec.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gear Included & Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
            {/* Included Riding Gear */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Complimentary Riding Gear Included</span>
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-700">
                {gearItems.map((gear, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{gear}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standard Features */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Two-Wheeler Equipment & Features</span>
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-700">
                {features.slice(0, 5).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            Bike ID: <span className="font-mono font-bold text-zinc-700">{bike._id || bike.id}</span>
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
              onClick={() => onEdit?.(bike)}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Bike Specs</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
