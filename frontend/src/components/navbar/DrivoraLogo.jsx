import React from 'react';
import { Link } from 'react-router-dom';

export const DrivoraLogo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group focus:outline-none select-none ${className}`}>
      {/* Aerodynamic Speed Curve Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-[1px] border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center p-1 overflow-hidden relative">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full transform -rotate-3"
            >
              {/* Upper aerodynamic hood silhouette */}
              <path
                d="M8 26C12 15 24 10 38 13C42 14 44 16 41 19C33 16 23 18 16 24C12 28 10 27 8 26Z"
                fill="url(#carzo-grad-white)"
              />
              {/* Lower sweeping road curve */}
              <path
                d="M6 31C13 31 22 28 32 21C34 20 37 20 34 23C24 30 15 35 6 35C4 35 4 31 6 31Z"
                fill="#38BDF8"
              />
              {/* Vibrant deep blue accelerating speed stripe */}
              <path
                d="M7 33C14 33 24 29 36 21C38 23 35 25 24 32C15 37 8 37 7 33Z"
                fill="url(#carzo-grad-blue)"
              />
              {/* GPS locator pin dot */}
              <circle cx="28" cy="18" r="3.2" fill="#2563EB" />
              <circle cx="28" cy="18" r="1.5" fill="#FFFFFF" />

              <defs>
                <linearGradient id="carzo-grad-blue" x1="6" y1="33" x2="36" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="carzo-grad-white" x1="8" y1="13" x2="42" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#94A3B8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500/40 rounded-full blur-xs pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Brand Typography Wordmark: CARZODRIVE */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className="font-black text-lg sm:text-xl text-white tracking-wider">
            CARZO<span className="text-blue-400">DRIVE</span>
          </span>
        </div>
        <span className="text-[7.5px] uppercase tracking-[0.24em] font-extrabold text-slate-400 mt-0.5">
          PREMIUM MOBILITY
        </span>
      </div>
    </Link>
  );
};

// Also export as CarzoDriveLogo for future use
export const CarzoDriveLogo = DrivoraLogo;
