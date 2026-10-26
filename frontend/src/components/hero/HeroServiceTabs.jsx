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
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/60 p-1 sm:p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
        {/* Top Cyan Neon Accent Line */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF]" />

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
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative flex flex-col items-center justify-between py-2 sm:py-2.5 px-2 sm:px-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center min-w-[95px] xs:min-w-[105px] sm:min-w-0 flex-1 snap-start shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-950/70 via-slate-900/95 to-blue-950/70 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.22)] ring-1 ring-cyan-400/40'
                    : 'bg-slate-950/40 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_8px_rgba(0,240,255,0.7)] animate-pulse">
                    Active
                  </span>
                )}

                {!isActive && meta.badge === 'Coming Soon' && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    Soon
                  </span>
                )}

                {/* Icon with glowing badge container */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-900/80 text-slate-400 group-hover:text-cyan-300 group-hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Label */}
                <span
                  className={`text-[11.5px] sm:text-[13px] font-black tracking-wide leading-tight whitespace-nowrap mt-1 ${
                    isActive
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                      : 'text-white group-hover:text-cyan-200'
                  }`}
                >
                  {item.label}
                </span>

                {/* Micro info */}
                <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                  {meta.badge}
                </span>

                {/* Book Now Button (Selects option inside the booking console box) */}
                <div
                  className={`mt-1.5 w-full py-1 px-1.5 rounded-lg text-[8.5px] sm:text-[9.5px] font-black tracking-wider uppercase flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                      : 'bg-slate-800/60 text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/15 border border-slate-700/50 group-hover:border-cyan-500/40'
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
