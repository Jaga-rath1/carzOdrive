import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Compass, ArrowRight, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatRating } from '../../utils/formatters';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const TourCard = ({ tour, onInquire }) => {
  const detailUrl = `/tour/${tour.id}`;

  return (
    <Card variant="glass" className="group flex flex-col h-full bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Tour Destination Image */}
      <Link to={detailUrl} className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900 block">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant="blue" size="sm" dot>
            {tour.badge}
          </Badge>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-900 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{formatRating(tour.rating)}</span>
            <span className="text-slate-400 text-[10px]">({tour.reviews})</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-bold drop-shadow-md">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            {tour.distance}
          </span>
        </div>
      </Link>

      {/* Tour Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={detailUrl}>
            <h3 className="text-xl font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
              {tour.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
            {tour.tagline}
          </p>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium">
            <span className="text-slate-500">Featured Machinery: </span>
            <strong className="text-blue-600 font-bold">{tour.featuredVehicle}</strong>
          </div>

          {/* Highlights */}
          <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100">
            {tour.highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-2xl font-black text-slate-950">
              {formatCurrency(tour.price)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {tour.priceNote}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              message={getTourWhatsAppMessage(tour)}
              variant="icon-only"
              size="md"
            />

            <Link
              to={detailUrl}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
