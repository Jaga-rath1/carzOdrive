import React, { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { DrivoraLogo } from './DrivoraLogo';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export const Navbar = ({ onOpenQuickBook }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-2xl border-b border-blue-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2 sm:py-2.5'
            : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            {/* Logo: DRIVORA */}
            <DrivoraLogo />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center">
              <NavLinks />
            </nav>

            {/* Right Action CTA: Book a Ride */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenQuickBook}
                className="group relative inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 px-5 py-2 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.65)] border border-blue-400/30 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-200 transition-transform group-hover:rotate-12" />
                <span>Book a Ride</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={onOpenQuickBook}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer border border-blue-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Book a Ride</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 rounded-lg text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenQuickBook={onOpenQuickBook}
      />
    </>
  );
};
