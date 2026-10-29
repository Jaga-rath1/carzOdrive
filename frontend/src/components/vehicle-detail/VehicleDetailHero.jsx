import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, MapPin, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';
import { useDiscount } from '../../hooks/useDiscount';
import { VehicleWhatsAppModal } from './VehicleWhatsAppModal';

export const VehicleDetailHero = ({ vehicle }) => {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const isBike = vehicle.vehicleType === 'bike';
  const categoryLink = isBike ? '/bike-self-ride' : '/car-self-ride';
  const categoryLabel = isBike ? 'Self-Drive Bikes' : 'Self-Drive Cars';

  const { calculateDiscount, discountPercentage } = useDiscount();
  const serviceType = isBike ? 'self-drive-bike' : 'self-drive-car';
  const rawPrice = vehicle.priceNumeric || (
    typeof vehicle.pricePerDay === 'number'
      ? vehicle.pricePerDay
      : parseInt(String(vehicle.pricePerDay || '').replace(/[^0-9]/g, '')) || 2999
  );
  const priceCalc = calculateDiscount(rawPrice, serviceType);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} Rental - CARZODRIVE`,
        text: `Rent ${vehicle.name} on CARZODRIVE at ${vehicle.priceDisplay || vehicle.pricePerDay}/day`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to={categoryLink} className="hover:text-blue-600 transition-colors whitespace-nowrap">
          {categoryLabel}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-bold truncate">{vehicle.name}</span>
      </nav>

      {/* Header Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {vehicle.badge || vehicle.category}
            </span>
            {vehicle.color && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                Color: {vehicle.color}
              </span>
            )}
            {(vehicle.isAvailable !== false && (vehicle.quantity !== undefined ? Number(vehicle.quantity) : (vehicle.availableCount ?? 1)) > 0 && vehicle.availabilityStatus !== 'Currently Unavailable' && vehicle.availabilityStatus !== 'UNAVAILABLE') ? (
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {vehicle.quantity !== undefined ? Number(vehicle.quantity) : (vehicle.availableCount ?? 1)} Available in Hub
              </span>
            ) : (
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Currently Unavailable (0 Units)
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500">
              {vehicle.brand} • {vehicle.year || '2024'} Model
            </span>

          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {vehicle.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
            {vehicle.tagline || vehicle.description}
          </p>

          {/* Slashed Original Price & Discount Percentage Cut Badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-3 pt-2.5 border-t border-slate-100">
            {priceCalc.isDiscountActive && priceCalc.discountAmount > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base text-slate-400 line-through font-bold">
                    ₹{rawPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                    ₹{priceCalc.finalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">/ 24 hrs</span>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  <span>{priceCalc.badgeText} ({discountPercentage}% OFF)</span>
                </span>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  You Save ₹{priceCalc.discountAmount.toLocaleString('en-IN')} /day
                </span>
              </>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  ₹{rawPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-500">/ 24 hrs</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Fast Actions */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50/80 border border-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-sm font-black text-slate-950">{vehicle.rating || '4.95'}</span>
            <span className="text-xs text-slate-500 font-medium">({vehicle.reviewsCount || '150+'} reviews)</span>
          </div>

          <WhatsAppButton
            message={getVehicleWhatsAppMessage(vehicle)}
            label="Inquire WhatsApp"
            size="md"
            variant="outline"
            onClick={() => setIsWhatsAppModalOpen(true)}
          />

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share vehicle"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <VehicleWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
};
