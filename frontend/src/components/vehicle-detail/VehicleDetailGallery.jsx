import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const VehicleDetailGallery = ({ vehicle }) => {
  const images = (vehicle.gallery && vehicle.gallery.length > 0)
    ? vehicle.gallery
    : [vehicle.image];

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={vehicle.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Verification Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Inspected & Sanitized</span>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            {images.indexOf(activeImage) + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                activeImage === img
                  ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${vehicle.name} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
