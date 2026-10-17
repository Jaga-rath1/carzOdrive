import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICE_OPTIONS } from '../../config/bookingConfig';

export const HeroServiceTabs = ({ activeTab, onTabSelect, serviceMeta }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <div className="relative rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/30 p-1 sm:p-2 shadow-[0_12px_40px_rgba(0,210,255,0.16)]">
        {/* Top Cyan Neon Accent Line */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF]" />

        {/* 5 Service Tabs: Smooth Horizontal Swipe on Mobile, Even 5-Grid on Desktop */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 sm:py-0 snap-x lg:grid lg:grid-cols-5">
          {SERVICE_OPTIONS.map((item) => {
            const meta = serviceMeta[item.id] || serviceMeta['self-drive-car'];
            const Icon = meta.icon;
            const isActive = activeTab === item.id;

            const handleCardClick = () => {
              if (isActive) {
                navigate(meta.route);
              } else {
                onTabSelect(item.id);
              }
            };

            return (
              <motion.div
                key={item.id}
                onClick={handleCardClick}
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center justify-between py-2 sm:py-2.5 px-2 sm:px-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center min-w-[95px] xs:min-w-[105px] sm:min-w-0 flex-1 snap-start shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-950/80 via-slate-900/95 to-blue-950/80 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border border-transparent hover:border-cyan-500/35'
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

                {/* Icon */}
                <div className="relative mb-1 flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isActive
                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                        : 'text-slate-400'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] sm:text-[13px] font-black tracking-wide leading-tight whitespace-nowrap ${
                    isActive
                      ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]'
                      : 'text-white'
                  }`}
                >
                  {item.label}
                </span>

                {/* Micro info */}
                <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                  {meta.badge}
                </span>

                {/* Direct Page Redirect Link */}
                <Link
                  to={meta.route}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(meta.route);
                  }}
                  className={`mt-1.5 w-full py-0.5 px-1.5 rounded-md text-[8px] sm:text-[9px] font-black tracking-wider uppercase flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60'
                  }`}
                  title={`Open dedicated ${item.label} page`}
                >
                  <span>Explore Page</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
