import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Check, ShieldCheck, Gauge, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency, formatRating } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';

export const VehicleSpecsModal = ({
  vehicle,
  isOpen,
  onClose,
  onBookNow
}) => {
  if (!vehicle) return null;

  const [activeImage, setActiveImage] = useState(vehicle.image);
  const specs = vehicle.specs || {};
  const gallery = [vehicle.image, ...(vehicle.secondaryImages || [])];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle.name}
      subtitle={`${vehicle.brand} • ${vehicle.type} (${vehicle.year})`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-slate-900">
        {/* Main Image with Gallery Thumbnails */}
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
            <img
              src={activeImage || vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="blue" dot>
                {vehicle.badge || 'Verified Fleet'}
              </Badge>
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tagline & Pricing Overview */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-sm text-slate-800 font-semibold">
              {vehicle.tagline}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
              <span>Rating: <strong className="text-slate-900">{formatRating(vehicle.rating)}/5.0</strong> ({vehicle.reviewsCount} reviews)</span>
              <span>•</span>
              <span>Security Hold: <strong className="text-slate-900">{formatCurrency(vehicle.deposit || 1000)}</strong></span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-slate-950">
              {formatCurrency(vehicle.pricePerDay)}
              <span className="text-xs text-slate-500 font-normal"> / day</span>
            </div>
            <div className="text-xs text-slate-500">
              or {formatCurrency(vehicle.pricePerHour)} / hr
            </div>
          </div>
        </div>

        {/* Technical Specification Matrix */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-600" />
            Performance Specifications
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-950 block mt-0.5">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features & Inclusions */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Equipped Luxury Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riding Gear Included (For Bikes) */}
        {vehicle.gearIncluded && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">
              Complimentary Protective Gear
            </div>
            <div className="flex flex-wrap gap-2">
              {vehicle.gearIncluded.map((gear, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white text-slate-800 font-medium border border-blue-200">
                  {gear}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Booking Trigger */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Full Comprehensive Insurance Included</span>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              message={getVehicleWhatsAppMessage(vehicle)}
              label="Chat WhatsApp"
              variant="solid"
              size="md"
            />

            <Link
              to={`/vehicle/${vehicle.id}`}
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all bg-slate-50 hover:bg-white"
            >
              Full Page
            </Link>

            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                onClose();
                if (onBookNow) onBookNow(vehicle);
              }}
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
