import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';

export const HeroSearchConsole = ({
  activeTab,
  activeService,
  activeMeta,
  dbCars,
  dbBikes,
  dbTours,
  selectedCarId,
  setSelectedCarId,
  selectedChauffeurId,
  setSelectedChauffeurId,
  selectedBikeId,
  setSelectedBikeId,
  selectedTourId,
  setSelectedTourId,
  pickupLocation,
  setPickupLocation,
  dropLocation,
  setDropLocation,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  setReturnDate,
  returnTime,
  setReturnTime,
  handleSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-left relative overflow-hidden"
    >
      {/* Ambient Cyan Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF]" />

      {/* Console Header with prominent Direct Page Redirect */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-cyan-400" />
          </span>
          <span className="text-[11px] sm:text-[13px] font-black text-white tracking-wide uppercase truncate">
            Live Fleet —{' '}
            <span className="text-cyan-400 font-extrabold">{activeService.label}</span>
          </span>
          <span className="hidden md:inline text-[9px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
            Instant Availability
          </span>
        </div>

        <Link
          to={activeMeta.route}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-400/50 text-[11px] sm:text-xs font-black transition-all group/link shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
          title={`Open full ${activeService.label} page`}
        >
          <span>Open {activeService.label} Page</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="space-y-2.5 sm:space-y-3 pt-2">
        {/* ROW 1: Available Model Selector + Pick-up Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* Contextual Available Item Selector */}
          <div className="space-y-1 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
            <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-cyan-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate">
                <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {activeTab === 'driver-only'
                    ? '1. Driver Assigned'
                    : activeTab === 'tour-packages'
                    ? '1. Select Package'
                    : activeTab === 'self-drive-bike'
                    ? '1. Select Bike'
                    : '1. Select Fleet Model'}
                </span>
              </span>
              <span className="text-[8px] sm:text-[8.5px] text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-800 shrink-0">
                Live
              </span>
            </label>

            {activeTab === 'self-drive-car' && (
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate py-0.5"
              >
                {dbCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    🟢 {c.name} ({c.color || 'Available'}) • {c.priceDisplay || `₹${c.pricePerDay}`}/day
                  </option>
                ))}
              </select>
            )}

            {activeTab === 'car-with-driver' && (
              <select
                value={selectedChauffeurId}
                onChange={(e) => setSelectedChauffeurId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate py-0.5"
              >
                {dbCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    🟢 {c.name} • {c.priceDisplay}/day with Chauffeur
                  </option>
                ))}
              </select>
            )}

            {activeTab === 'driver-only' && (
              <select
                value="provided-by-company"
                disabled
                className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-default truncate py-0.5"
              >
                <option value="provided-by-company">
                  🟢 Verified Commercial Driver (₹799/day)
                </option>
              </select>
            )}

            {activeTab === 'self-drive-bike' && (
              <select
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate py-0.5"
              >
                {dbBikes.map((b) => (
                  <option key={b.id || b.name} value={b.id || b.name}>
                    🟢 {b.name} • {b.priceDisplay || `₹${b.pricePerDay}`}/day
                  </option>
                ))}
              </select>
            )}

            {activeTab === 'tour-packages' && (
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate py-0.5"
              >
                {dbTours.map((t) => (
                  <option key={t.id} value={t.id}>
                    🟢 {t.name} ({t.startingPrice}) • {t.duration}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pick-up Hub in Bhubaneswar */}
          <div className="space-y-1 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
            <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>2. Pick-up Hub in Bhubaneswar</span>
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer py-0.5"
            >
              {BHUBANESWAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: Drop-off Hub + Pickup Date/Time + Return Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-3 items-start">
          {/* Drop-off Location */}
          <div className="lg:col-span-4 space-y-1 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
            <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>3. Drop-off Location</span>
            </label>
            <select
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer py-0.5"
            >
              <option value="Same as Pick-up Location">🔄 Same as Pick-up Location</option>
              {BHUBANESWAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Pick-up Date & Time */}
          <div className="lg:col-span-4 space-y-1 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
            <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>4. Pick-up Date & Time</span>
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="flex-1 min-w-0 bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark] py-0.5"
              />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-[74px] sm:w-20 shrink-0 bg-slate-800/80 px-1 py-0.5 rounded text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Return Date & Time */}
          <div className="lg:col-span-4 space-y-1 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
            <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>5. Return Date & Time</span>
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="flex-1 min-w-0 bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark] py-0.5"
              />
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-[74px] sm:w-20 shrink-0 bg-slate-800/80 px-1 py-0.5 rounded text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Special Bike notice if bike tab active */}
        {activeTab === 'self-drive-bike' && (
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>Two-Wheeler Fleet Coming Soon — Pre-bookings live via WhatsApp.</span>
            </div>
            <Link
              to="/bike-rental"
              className="font-black text-cyan-300 hover:text-white underline shrink-0 text-xs"
            >
              View Bike Fleet & Pre-Book →
            </Link>
          </div>
        )}

        {/* BOTTOM ACTIONS & GUARANTEES */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-semibold text-center sm:text-left justify-center sm:justify-start">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Free cancellation up to 6 hours before pickup</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link
              to={activeMeta.route}
              className="px-4 py-2.5 sm:py-3 rounded-xl border border-cyan-500/50 hover:border-cyan-400 text-xs sm:text-sm font-black text-cyan-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
              title={`Open full ${activeService.label} page`}
            >
              <span>Explore {activeService.label} Page</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {activeTab === 'self-drive-bike' ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-500 bg-slate-900 border border-slate-800 opacity-60 cursor-not-allowed select-none text-center"
              >
                Bikes Coming Soon
              </button>
            ) : (
              <button
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] border border-cyan-400/40 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span>Instant Book & Check Availability</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};
