import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SERVICE_OPTIONS } from '../../config/bookingConfig';

export const HeroServiceTabs = ({ activeTab, onTabSelect, serviceMeta, serviceData = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <div className="relative rounded-2xl bg-white/90 backdrop-blur-2xl border border-slate-200/90 p-1.5 sm:p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        {/* Top Royal Blue Accent Line */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.45)]" />

        {/* 5 Service Tabs: Smooth Horizontal Swipe on Mobile, Balanced 5-Column Grid on Desktop */}
        <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 sm:py-0 snap-x touch-pan-x -mx-1 px-1 lg:grid lg:grid-cols-5">
          {SERVICE_OPTIONS.map((item) => {
            const meta = serviceMeta?.[item.id] || serviceMeta?.['self-drive-car'] || {};
            const data = serviceData?.[item.id] || {};
            const Icon = meta.icon;
            const isActive = activeTab === item.id;

            const handleCardClick = (e) => {
              if (e?.preventDefault) e.preventDefault();
              onTabSelect(item.id);
            };

            return (
              <motion.div
                key={item.id}
                onClick={handleCardClick}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex flex-col justify-between p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center min-w-[120px] xs:min-w-[130px] sm:min-w-0 flex-1 snap-start shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-700 text-white shadow-[0_10px_28px_rgba(37,99,235,0.38)] ring-2 ring-blue-400/50 border border-blue-400'
                    : 'bg-slate-50/80 hover:bg-white text-slate-800 hover:text-blue-700 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Active Floating Pill */}
                {isActive && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-white text-blue-700 shadow-md flex items-center gap-1 z-10">
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                    <span>Selected</span>
                  </span>
                )}

                {!isActive && meta.badge === 'Coming Soon' && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs z-10">
                    Soon
                  </span>
                )}

                {/* 1. The 3D Service App Tile directly from user's image */}
                <div className="w-full flex items-center justify-center pt-0.5">
                  <div
                    className={`relative w-[68px] h-[68px] xs:w-[76px] xs:h-[76px] sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? 'ring-2 ring-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.45)] scale-[1.05]'
                        : 'border border-slate-700/60 shadow-lg group-hover:scale-105 group-hover:shadow-2xl'
                    }`}
                  >
                    <img
                      src={data.image || meta.image || `/images/services/${item.id}.png`}
                      alt={item.label}
                      className="w-full h-full object-cover select-none"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* 2. Service Label */}
                <span
                  className={`text-[12px] sm:text-[13.5px] font-black tracking-wide leading-tight mt-2 line-clamp-1 ${
                    isActive ? 'text-white' : 'text-slate-900 group-hover:text-blue-700'
                  }`}
                >
                  {item.label}
                </span>

                {/* 3. Billboard Tagline & Live Rate */}
                <div className="flex flex-col items-center justify-center mt-0.5">
                  <span
                    className={`text-[8.5px] sm:text-[9.5px] font-bold line-clamp-1 ${
                      isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  >
                    {data.tagline || meta.tagline || meta.badge}
                  </span>
                  <span
                    className={`text-[9.5px] sm:text-[10.5px] font-black mt-0.5 ${
                      isActive ? 'text-cyan-200' : 'text-blue-600'
                    }`}
                  >
                    {data.rate || meta.badge}
                  </span>
                </div>

                {/* 4. Book Now CTA Pill */}
                <div
                  className={`mt-2 w-full py-1 sm:py-1.5 px-2 rounded-lg text-[9px] sm:text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 hover:bg-slate-50 shadow-sm'
                      : 'bg-slate-100/90 group-hover:bg-blue-600 text-slate-700 group-hover:text-white border border-slate-200/80 group-hover:border-blue-600 shadow-xs'
                  }`}
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

