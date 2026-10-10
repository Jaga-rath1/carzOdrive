import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronDown, 
  Car, 
  Bike, 
  Shield, 
  UserCheck, 
  Compass, 
  KeyRound, 
  UserPlus
} from 'lucide-react';

export const SERVICES_MENU = [
  {
    title: 'Bike Rental',
    desc: 'Explore the city on your own terms with premium bikes',
    to: '/bike-rental',
    icon: Bike,
    badge: 'Bikes',
  },
  {
    title: 'Car Self Ride',
    desc: 'Premium self-drive cars for complete freedom',
    to: '/car-self-ride',
    icon: Car,
    badge: 'Self Drive',
  },
  {
    title: 'Car With Driver',
    desc: 'Sit back and enjoy executive chauffeur journeys',
    to: '/car-with-driver',
    icon: Shield,
    badge: 'Chauffeur',
  },
  {
    title: 'Driver Only',
    desc: 'Professional verified drivers when you need them',
    to: '/driver-only',
    icon: UserCheck,
    badge: 'Verified',
  },
  {
    title: 'Tours & Packages',
    desc: 'Curated experiences for unforgettable journeys',
    to: '/tours-packages',
    icon: Compass,
    badge: 'Curated',
  },
  {
    title: 'Rent Your Bike',
    desc: 'Host your two-wheeler & earn guaranteed weekly payout',
    to: '/rent-your-bike',
    icon: Bike,
    badge: 'Host Bike',
  },
  {
    title: 'Rent Your Car',
    desc: 'Monetize your car with 100% insurance and verified renters',
    to: '/rent-your-car',
    icon: KeyRound,
    badge: 'Host Car',
  },
];

export const NavLinks = () => {
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-xs sm:text-[13px] font-bold tracking-normal transition-all duration-200 py-1.5 px-3 rounded-lg cursor-pointer select-none ${
      isActive
        ? 'text-blue-400 bg-white/10 shadow-[0_0_12px_rgba(37,99,235,0.25)] border border-blue-500/30'
        : 'text-slate-200 hover:text-white hover:bg-white/10'
    }`;

  return (
    <div className="flex items-center gap-1">
      {/* 1. Home */}
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>

      {/* 2. About */}
      <NavLink to="/about" className={navLinkClass}>
        About
      </NavLink>

      {/* 3. Services Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setServicesOpen(true)}
        onMouseLeave={() => setServicesOpen(false)}
      >
        <button
          type="button"
          onClick={() => setServicesOpen(!servicesOpen)}
          className={`text-xs sm:text-[13px] font-bold tracking-normal transition-all duration-200 py-1.5 px-3 rounded-lg inline-flex items-center gap-1 cursor-pointer select-none ${
            servicesOpen
              ? 'text-blue-400 bg-white/10 shadow-[0_0_12px_rgba(37,99,235,0.25)] border border-blue-500/30'
              : 'text-slate-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Services</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              servicesOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'
            }`}
          />
        </button>

        {/* Dropdown Menu Box */}
        {servicesOpen && (
          <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2.5 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-blue-400 flex items-center justify-between">
                <span>Mobility Services</span>
              </div>

              {SERVICES_MENU.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setServicesOpen(false)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 text-white group-hover:border-blue-400 transition-all">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-bold border border-blue-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Tours & Packages */}
      <NavLink to="/tours-packages" className={navLinkClass}>
        Tours & Packages
      </NavLink>

      {/* 5. Rent Your Car */}
      <NavLink to="/rent-your-car" className={navLinkClass}>
        Rent Your Car
      </NavLink>

      {/* 6. Rent Your Bike */}
      <NavLink to="/rent-your-bike" className={navLinkClass}>
        Rent Your Bike
      </NavLink>

      {/* 7. Contact */}
      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>
    </div>
  );
};
