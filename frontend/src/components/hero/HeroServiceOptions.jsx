import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  SelfDriveCarIcon,
  CarRentalKeyIcon,
  BikeRentalIcon,
  DriverRentalIcon,
  TourPackageIcon,
} from './HeroServiceIcons';

export const HERO_SERVICE_OPTIONS = [
  {
    id: 'self-drive-car',
    title: 'Self Drive',
    subtitle: 'Drive Yourself • Instant Fleet',
    iconComponent: SelfDriveCarIcon,
    route: '/car-self-ride',
    badgeText: 'Active Fleet',
    isAvailable: true,
  },
  {
    id: 'car-with-driver',
    title: 'Car Rental',
    subtitle: 'Car with Driver • Executive VIP',
    iconComponent: CarRentalKeyIcon,
    route: '/car-with-driver',
    badgeText: 'With Driver',
    isAvailable: true,
  },
  {
    id: 'self-drive-bike',
    title: 'Bike Rental',
    subtitle: 'Superbikes & Scooters',
    iconComponent: BikeRentalIcon,
    route: '/bike-rental',
    badgeText: 'Coming Soon',
    isAvailable: false,
  },
  {
    id: 'driver-only',
    title: 'Driver Rental',
    subtitle: 'Verified Pilots for Your Car',
    iconComponent: DriverRentalIcon,
    route: '/driver-only',
    badgeText: '₹799/Day',
    isAvailable: true,
  },
  {
    id: 'tour-packages',
    title: 'Tour Package',
    subtitle: 'Puri, Konark, Chilika Lake',
    iconComponent: TourPackageIcon,
    route: '/tours-packages',
    badgeText: 'Odisha Tours',
    isAvailable: true,
  },
];

export const HeroServiceOptions = ({ activeService = 'self-drive-car', onSelectService }) => {
  const navigate = useNavigate();

  const handleSelect = (item) => {
    if (onSelectService) {
      onSelectService(item.id);
    }
  };

  return (
    <div className="w-full">
      {/* 
        Sleek Cyber-Luxury Horizontal Button Dock
        Optimized compact height aligned to navbar scale:
        [ Self Drive ] | [ Car Rental ] | [ Bike Rental ] | [ Driver Rental ] | [ Tour Package ]
      */}
      <div className="relative rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/30 p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(0,210,255,0.16)]">
        {/* Ambient Top Cyan Neon Glow Edge */}
        <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF]" />

        {/* 5 Service Buttons Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-stretch gap-1 sm:gap-1.5">
          {HERO_SERVICE_OPTIONS.map((item, index) => {
            const Icon = item.iconComponent;
            const isActive = activeService === item.id;
            const isLast = index === HERO_SERVICE_OPTIONS.length - 1;

            return (
              <div key={item.id} className="relative flex items-center">
                {/* Clickable Service Button */}
                <motion.button
                  type="button"
                  onClick={() => handleSelect(item)}
                  whileHover={{ y: -1.5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-full group relative flex flex-col items-center justify-between py-2.5 sm:py-3 px-2 sm:px-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none text-center ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-950/70 via-slate-900/90 to-blue-950/70 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.22)] ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/40 hover:bg-slate-900/80 border border-transparent hover:border-cyan-500/35'
                  }`}
                  aria-pressed={isActive}
                >
                  {/* Active Indicator Top Pill */}
                  {isActive && (
                    <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_8px_rgba(0,240,255,0.7)] animate-pulse">
                      Selected
                    </span>
                  )}

                  {/* Badge for special status (e.g. Coming Soon) when not active */}
                  {!isActive && item.badgeText === 'Coming Soon' && (
                    <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      Soon
                    </span>
                  )}

                  {/* Service 3D Vector Icon */}
                  <div className="relative mb-1 flex items-center justify-center">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" active={isActive} />
                    {isActive && (
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm pointer-events-none" />
                    )}
                  </div>

                  {/* Button Label */}
                  <span
                    className={`text-xs sm:text-[13px] font-black tracking-wide leading-tight transition-colors ${
                      isActive
                        ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]'
                        : 'text-white group-hover:text-cyan-200'
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* Subtitle / Micro info */}
                  <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1 group-hover:text-slate-300">
                    {item.subtitle}
                  </span>
                </motion.button>

                {/* Glowing Cyan Vertical Divider Bar */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute -right-[1px] top-1/2 -translate-y-1/2 w-[2px] h-9 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_6px_rgba(0,240,255,0.7)] z-10 pointer-events-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
