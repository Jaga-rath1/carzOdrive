import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  X,
  Calendar,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const TourQuickModal = ({ tour, isOpen, onClose, onOpenQuickBook }) => {
  if (!isOpen || !tour) return null;

  const detailUrl = `/tour/${tour.id || tour.slug || tour._id}`;

  const handleBook = () => {
    onClose();
    onOpenQuickBook?.({
      serviceType: 'tour-packages',
      vehicle: tour,
      tour: tour,
      name: tour.title || tour.name,
      location: tour.destination,
      price: tour.startingPrice,
      pickupDate: tour.pickupDate,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10 border border-slate-200 overflow-hidden text-slate-900"
        >
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                {tour.duration} • {tour.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">{tour.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{tour.destination}</span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Price & Inclusions */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-700 font-bold block uppercase tracking-wider">
                  All-Inclusive Package Price
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {tour.startingPrice}
                </span>
                <span className="text-xs text-slate-500 ml-1">per couple / vehicle</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <WhatsAppButton
                  message={getTourWhatsAppMessage(tour)}
                  label="WhatsApp"
                  size="md"
                  variant="solid"
                />

                <button
                  type="button"
                  onClick={handleBook}
                  className="py-3 px-5 rounded-xl font-black text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to={detailUrl}
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl font-bold text-xs text-blue-700 bg-blue-100/70 hover:bg-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Full Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Day by Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Detailed Day-by-Day Itinerary</span>
                </h4>
                <div className="space-y-3">
                  {tour.itinerary.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-xs font-black font-mono text-blue-600 uppercase">
                        {step.day} • {step.title}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.desc || step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions List */}
            {tour.inclusions && tour.inclusions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>What’s Included</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  {tour.inclusions.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
