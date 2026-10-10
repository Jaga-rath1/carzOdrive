import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import { SERVICES_MENU } from './NavLinks';
import { DrivoraLogo } from './DrivoraLogo';

export const MobileMenu = ({ isOpen, onClose, onOpenQuickBook }) => {
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-slate-950 border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto text-white shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          >
            <div>
              {/* Header with DrivoraLogo */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <DrivoraLogo />

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-2.5">
                {/* 1. Home */}
                <NavLink
                  to="/"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Home
                </NavLink>

                {/* 2. About */}
                <NavLink
                  to="/about"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  About
                </NavLink>

                {/* 3. Services Collapsible */}
                <div className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className="w-full flex items-center justify-between p-3.5 text-sm font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        servicesExpanded ? 'rotate-180 text-blue-400' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {servicesExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-1">
                      {SERVICES_MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Tours & Packages */}
                <NavLink
                  to="/tours-packages"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Tours & Packages
                </NavLink>

                {/* 5. Rent Your Car */}
                <NavLink
                  to="/rent-your-car"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Rent Your Car
                </NavLink>

                {/* 6. Rent Your Bike */}
                <NavLink
                  to="/rent-your-bike"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Rent Your Bike
                </NavLink>

                {/* 7. Contact */}
                <NavLink
                  to="/contact"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-blue-400 bg-white/10 border border-blue-500/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>
            </div>

            {/* Bottom Actions CTA: Book a Ride */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.5)] border border-blue-400/40 cursor-pointer flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  if (onOpenQuickBook) onOpenQuickBook();
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Book a Ride</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
