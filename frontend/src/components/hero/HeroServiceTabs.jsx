import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICE_OPTIONS } from '../../config/bookingConfig';

export const HeroServiceTabs = ({ activeTab, onTabSelect, serviceMeta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <div className="relative rounded-2xl bg-white/85 backdrop-blur-2xl border border-slate-200/90 p-1 sm:p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        {/* Top Royal Blue Accent Line */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.4)]" />

        {/* 5 Service Tabs: Smooth Horizontal Swipe on Mobile, Even 5-Grid on Desktop */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 sm:py-0 snap-x lg:grid lg:grid-cols-5">
          {SERVICE_OPTIONS.map((item) => {
            const meta = serviceMeta[item.id] || serviceMeta['self-drive-car'];
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
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative flex flex-col items-center justify-between py-2 sm:py-2.5 px-2 sm:px-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center min-w-[95px] xs:min-w-[105px] sm:min-w-0 flex-1 snap-start shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-[0_8px_22px_rgba(37,99,235,0.35)] ring-2 ring-blue-400/40 border border-blue-500'
                    : 'bg-slate-50/70 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/70 hover:border-blue-300 shadow-xs hover:shadow-md'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-white text-blue-700 shadow-md">
                    Active
                  </span>
                )}

                {!isActive && meta.badge === 'Coming Soon' && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 font-black shadow-xs">
                    Soon
                  </span>
                )}

                {/* Icon with glowing badge container */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-blue-50/80 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Label */}
                <span
                  className={`text-[11.5px] sm:text-[13px] font-black tracking-wide leading-tight whitespace-nowrap mt-1 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-800 group-hover:text-blue-700'
                  }`}
                >
                  {item.label}
                </span>

                {/* Micro info */}
                <span
                  className={`text-[8.5px] sm:text-[10px] font-bold mt-0.5 line-clamp-1 ${
                    isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-600'
                  }`}
                >
                  {meta.badge}
                </span>

                {/* Book Now Button */}
                <div
                  className={`mt-1.5 w-full py-1 px-1.5 rounded-lg text-[8.5px] sm:text-[9.5px] font-black tracking-wider uppercase flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-white/95 text-blue-700 hover:bg-white shadow-sm'
                      : 'bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-700 border border-slate-200/70 group-hover:border-blue-200'
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
