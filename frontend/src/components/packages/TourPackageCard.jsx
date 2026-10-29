import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight, CheckCircle2, Sparkles, Eye } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';
import { useAuth } from '../../hooks/useAuth';
import { getTodayDateString } from '../../utils/formatters';

export const TourPackageCard = ({ tour, onOpenQuickBook, onQuickLook }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const detailUrl = `/tour/${tour.id || tour.slug || tour._id}`;

  const handleBookNow = (e) => {
    e.stopPropagation();
    let durDays = 2;
    if (tour?.durationDays && Number(tour.durationDays) > 0) {
      durDays = Number(tour.durationDays);
    } else if (typeof tour?.duration === 'string') {
      const match = tour.duration.match(/(\d+)\s*Day/i);
      if (match) durDays = parseInt(match[1], 10);
    }
    const today = getTodayDateString(1);
    const returnDay = getTodayDateString(1 + Math.max(1, durDays));

    onOpenQuickBook?.({
      serviceType: 'tour-packages',
      vehicle: tour,
      tour: tour,
      name: tour.title || tour.name,
      location: tour.destination,
      price: tour.startingPrice,
      pickupDate: today,
      returnDate: returnDay,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500 transition-all duration-300 overflow-hidden"
    >
      {/* Large Image Header */}
      <Link to={detailUrl} className="relative h-64 w-full overflow-hidden bg-slate-100 block">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-900 shadow-xs">
            {tour.category || 'Odisha Tour'}
          </span>
          {tour.badge && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/90 text-white shadow-sm">
              {tour.badge}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-900 text-xs font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{tour.duration}</span>
        </div>

        <div className="absolute bottom-3 right-3 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-300 block leading-tight">Starting From</span>
          <span className="text-xl font-black text-white drop-shadow-md">
            {tour.startingPrice}
          </span>
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tour.destination}</span>
          </div>

          <Link to={detailUrl}>
            <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-1">
              {tour.title}
            </h3>
          </Link>

          {tour.featuredVehicle && (
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Fleet: {tour.featuredVehicle}</span>
            </div>
          )}

          {/* Highlights Bullet List */}
          <ul className="space-y-1.5 pt-1">
            {tour.highlights && tour.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons: View Details + Book Now + Quick Look + WhatsApp */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2">
            <Link
              to={detailUrl}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  openAuthModal('login');
                }
              }}
              className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 group/btn border border-slate-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </Link>

            <button
              type="button"
              onClick={handleBookNow}
              className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onQuickLook && (
              <button
                type="button"
                onClick={() => onQuickLook(tour)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-blue-400 font-bold text-xs text-slate-600 hover:text-blue-600 transition-all cursor-pointer bg-slate-50 hover:bg-white text-center"
              >
                Quick Itinerary
              </button>
            )}

            <WhatsAppButton
              message={getTourWhatsAppMessage(tour)}
              variant="outline"
              size="sm"
              label="WhatsApp"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
