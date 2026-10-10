import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CarFront,
  Bike,
  Shield,
  UserCheck,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HERO_SERVICE_OPTIONS = [
  {
    id: 'self-drive-car',
    title: 'SELF-DRIVE CAR',
    subtitle: 'Drive Yourself',
    icon: CarFront,
    route: '/car-self-ride',
    badgeText: 'Active Fleet',
  },
  {
    id: 'car-with-driver',
    title: 'CAR WITH DRIVER',
    subtitle: 'Executive Chauffeur Service',
    icon: Shield,
    route: '/car-with-driver',
    badgeText: 'VIP Chauffeur',
  },
  {
    id: 'driver-only',
    title: 'DRIVER ONLY',
    subtitle: 'Verified Drivers for Your Car',
    icon: UserCheck,
    route: '/driver-only',
    badgeText: 'On-Demand Pilots',
  },
  {
    id: 'self-drive-bike',
    title: 'SELF-DRIVE BIKE',
    subtitle: 'Coming Soon • Launching',
    icon: Bike,
    route: '/bike-rental',
    badgeText: 'Coming Soon',
  },
  {
    id: 'tour-packages',
    title: 'TOUR PACKAGES',
    subtitle: 'Puri, Konark, Chilika Lake',
    icon: Compass,
    route: '/tours-packages',
    badgeText: 'Odisha Tours',
  },
];

export const HeroServiceOptions = ({ activeService = 'self-drive-car', onSelectService }) => {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (activeService === item.id) {
      // If already active, direct redirect to the selected page
      navigate(item.route);
    } else if (onSelectService) {
      onSelectService(item.id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 5 Clickable Service Options Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {HERO_SERVICE_OPTIONS.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeService === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => handleCardClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(item);
                }
              }}
              className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 select-none text-center bg-white/95 backdrop-blur-md hover:bg-white border-2 hover:-translate-y-1.5 active:scale-95 shadow-[0_8px_25px_rgba(37,99,235,0.08)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.22)] ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-[0_10px_30px_rgba(37,99,235,0.18)]'
                  : 'border-slate-200/90 hover:border-blue-500'
              }`}
            >
              {/* Active Indicator Pin */}
              {isActive ? (
                <span className="absolute -top-2.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Active
                </span>
              ) : item.badgeText === 'Coming Soon' ? (
                <span className="absolute -top-2.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Coming Soon
                </span>
              ) : null}

              {/* Top Navy/Blue Circular Icon */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-md transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105'
                    : 'bg-[#0a1e3f] group-hover:scale-105 group-hover:bg-blue-600'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>

              {/* Middle Vibrant Blue Pill Badge */}
              <div className="mt-3 w-full">
                <div
                  className={`w-full py-1.5 px-2 rounded-full font-black text-[10px] sm:text-[11px] tracking-wider uppercase text-white shadow-xs transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 group-hover:from-blue-700 group-hover:to-indigo-900'
                  }`}
                >
                  {item.title}
                </div>
              </div>

              {/* Subtitle & Selection Action */}
              <div className="mt-2 w-full flex flex-col items-center">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors leading-tight line-clamp-1">
                  {item.subtitle}
                </span>

                {/* Direct Redirect Link on Card */}
                <Link
                  to={item.route}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.route);
                  }}
                  className={`mt-2.5 w-full py-1.5 px-2.5 rounded-xl font-black text-[10px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all duration-200 border shadow-2xs group/link cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                  }`}
                  title={`Open ${item.title} page directly`}
                >
                  <span>Explore Page</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
