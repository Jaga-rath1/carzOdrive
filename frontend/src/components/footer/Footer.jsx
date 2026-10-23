import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { DrivoraLogo } from '../navbar/DrivoraLogo';

export const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 text-slate-300 pt-12 sm:pt-14 pb-10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container>
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8 pb-10 border-b border-slate-800">
          {/* Logo & Description (Col Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <DrivoraLogo />

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier vehicle rental and curated mobility platform. Luxury self-drive cars, superbikes, professional drivers, and road trip packages.
            </p>

            {/* Office Address */}
            <a
              href="https://www.google.com/maps/@20.2605665,85.7603121,21z/data=!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-xs text-slate-400 hover:text-slate-200 max-w-sm bg-slate-900/60 hover:bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 hover:border-blue-500/40 transition-all group"
            >
              <MapPin className="w-4 h-4 text-blue-500 group-hover:text-blue-400 shrink-0 mt-0.5 transition-colors" />
              <span className="leading-relaxed">
                Plot no -1774. Ananda Bana Main Road. Kalinga Nagar, Ghatikia, Bhubaneswar, Pin- 751029
              </span>
            </a>

            {/* Social Icons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Follow Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                  aria-label="CARZODRIVE Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                  aria-label="CARZODRIVE Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                  aria-label="CARZODRIVE LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                  aria-label="CARZODRIVE X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 1. Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/driver-registration" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/bike-rental" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Bike Rental
                </Link>
              </li>
              <li>
                <Link to="/car-self-ride" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Car Self Ride
                </Link>
              </li>
              <li>
                <Link to="/car-with-driver" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Car With Driver
                </Link>
              </li>
              <li>
                <Link to="/driver-only" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Driver Only
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/tours-packages" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Tours & Packages
                </Link>
              </li>
              <li>
                <Link to="/rent-your-car" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Rent Your Car
                </Link>
              </li>
              <li>
                <Link to="/rent-your-bike" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Rent Your Bike
                </Link>
              </li>
              <li>
                <Link to="/driver-registration" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Driver Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/my-bookings" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  My Bookings & Receipts
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright 2026 CARZODRIVE & Design Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CARZODRIVE. All rights reserved.
          </div>
          <div className="text-slate-400 text-center">
            Design & Developed by{' '}
            <a
              href="https://www.nexnuv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Nexnuv Private Limited
            </a>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/about" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Concierge Support</Link>
            <Link to="/admin/login" className="text-amber-400/80 hover:text-amber-300 transition-colors font-bold">Admin Portal</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
