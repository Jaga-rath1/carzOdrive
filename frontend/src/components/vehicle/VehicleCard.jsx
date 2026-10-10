import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatRating } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';

export const VehicleCard = ({
  vehicle,
  onQuickBook,
  onViewSpecs,
  mode = 'car',
}) => {
  const isBike = mode === 'bike';
  const specs = vehicle.specs || {};
  const detailUrl = `/vehicle/${vehicle.id}`;

  return (
    <Card variant="glass" className="group flex flex-col h-full bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Vehicle Image Header */}
      <Link to={detailUrl} className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900 block">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge variant="blue" size="sm" dot>
            {vehicle.badge || vehicle.type}
          </Badge>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 text-xs font-bold text-slate-900 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{formatRating(vehicle.rating)}</span>
            <span className="text-slate-400 text-[10px]">({vehicle.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom Tagline Over Image */}
        <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
          <span className="text-[11px] font-medium text-slate-200 line-clamp-1 drop-shadow-md">
            {vehicle.tagline}
          </span>
        </div>
      </Link>

      {/* Vehicle Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Name */}
          <div className="text-xs uppercase tracking-wider text-blue-600 font-bold">
            {vehicle.brand} • {vehicle.year}
          </div>
          <Link to={detailUrl}>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight mt-1 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>
          </Link>

          {/* Quick Specs 3-Item Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-200/60">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                {isBike ? 'Engine' : '0-100'}
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">
                {isBike ? specs.engine : specs.acceleration}
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-200/60">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                Top Speed
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {specs.topSpeed}
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-200/60">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                {isBike ? 'Weight' : 'Power'}
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {isBike ? specs.dryWeight : specs.power}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-950">
                {formatCurrency(vehicle.pricePerDay)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/day</span>
            </div>
            <div className="text-[11px] text-slate-500">
              or {formatCurrency(vehicle.pricePerHour)}/hr
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <WhatsAppButton
              message={getVehicleWhatsAppMessage(vehicle)}
              variant="icon-only"
              size="md"
            />

            <Link
              to={detailUrl}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
              title="View full specifications & features"
              aria-label="View specs"
            >
              <Info className="w-4 h-4" />
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onQuickBook && onQuickBook(vehicle)}
              icon={ArrowRight}
              iconPosition="right"
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
