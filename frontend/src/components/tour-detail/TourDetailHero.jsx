import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Clock, Share2, Sparkles } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const TourDetailHero = ({ tour }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tour.title} Tour - CARZODRIVE`,
        text: `Explore ${tour.title} with CARZODRIVE starting at ${tour.startingPrice}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Tour link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to="/tours-packages" className="hover:text-blue-600 transition-colors whitespace-nowrap">
          Tours & Packages
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-bold truncate">{tour.title}</span>
      </nav>

      {/* Header Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {tour.category} EXPEDITION
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <MapPin className="w-3.5 h-3.5" />
              <span>{tour.destination}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{tour.duration}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {tour.title}
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <WhatsAppButton
            message={getTourWhatsAppMessage(tour)}
            label="Inquire Tour on WhatsApp"
            size="md"
            variant="outline"
          />

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share tour"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
