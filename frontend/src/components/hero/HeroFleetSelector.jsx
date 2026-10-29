import React from 'react';
import { Car, Bike, AlertCircle } from 'lucide-react';
import { SelfDriveCarIcon } from './HeroServiceIcons';

export const HeroFleetSelector = ({
  activeTab,
  dbCars,
  dbBikes,
  dbTours,
  selectedCarId,
  setSelectedCarId,
  selectedChauffeurId,
  selectedWithDriverCarId,
  setSelectedChauffeurId,
  setSelectedWithDriverCarId,
  selectedBikeId,
  setSelectedBikeId,
  selectedTourId,
  setSelectedTourId,
  driverDailyRate = 799,
}) => {
  const withDriverId = selectedWithDriverCarId || selectedChauffeurId;
  const setWithDriverId = setSelectedWithDriverCarId || setSelectedChauffeurId;

  // Determine selected object for current active tab
  const selectedCarObj =
    activeTab === 'self-drive-car'
      ? dbCars.find((c) => c.id === selectedCarId)
      : activeTab === 'car-with-driver'
      ? dbCars.find((c) => c.id === withDriverId)
      : activeTab === 'self-drive-bike'
      ? (dbBikes.find((b) => (b.id || b.name) === selectedBikeId) || dbBikes[0])
      : null;

  const isSelectedUnavailable = selectedCarObj && selectedCarObj.isAvailable === false;

  return (
    <div
      className={`space-y-1 p-2 sm:p-2.5 rounded-xl transition-all border ${
        isSelectedUnavailable
          ? 'bg-rose-50/80 border-rose-300'
          : 'bg-slate-50/90 hover:bg-white focus-within:bg-white border-slate-200/90 hover:border-blue-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 shadow-xs'
      }`}
    >
      <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5 truncate">
          {activeTab === 'self-drive-car' ? (
            <SelfDriveCarIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          ) : activeTab === 'self-drive-bike' ? (
            <Bike className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          ) : (
            <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          )}
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
        <span
          className={`text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${
            isSelectedUnavailable
              ? 'text-rose-700 bg-rose-50 border-rose-200'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}
        >
          {isSelectedUnavailable ? '0 Available' : 'Live Fleet'}
        </span>
      </label>

      {activeTab === 'self-drive-car' && (
        <select
          value={selectedCarId}
          onChange={(e) => setSelectedCarId(e.target.value)}
          className={`w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0 ${
            isSelectedUnavailable ? 'text-rose-600 opacity-60' : ''
          }`}
        >
          {dbCars.map((c) => {
            const count = c.availableCount !== undefined ? c.availableCount : (c.quantity ?? 1);
            const isAvail = c.isAvailable !== false && count > 0;
            return (
              <option
                key={c.id}
                value={c.id}
                disabled={!isAvail}
                className={
                  isAvail
                    ? 'text-slate-900 bg-white font-semibold py-1'
                    : 'text-slate-400 bg-slate-50 opacity-50 italic line-through py-1'
                }
              >
                {isAvail
                  ? `🟢 ${c.name} — ${count} Available • ${c.priceDisplay || `₹${c.pricePerDay}`}/day`
                  : `🔴 ${c.name} — Not Available (0 left) • ${c.priceDisplay || `₹${c.pricePerDay}`}/day`}
              </option>
            );
          })}
        </select>
      )}

      {activeTab === 'car-with-driver' && (
        <select
          value={withDriverId}
          onChange={(e) => setWithDriverId(e.target.value)}
          className={`w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0 ${
            isSelectedUnavailable ? 'text-rose-600 opacity-60' : ''
          }`}
        >
          {dbCars.map((c) => {
            const count = c.availableCount !== undefined ? c.availableCount : (c.quantity ?? 1);
            const isAvail = c.isAvailable !== false && count > 0;
            return (
              <option
                key={c.id}
                value={c.id}
                disabled={!isAvail}
                className={
                  isAvail
                    ? 'text-slate-900 bg-white font-semibold py-1'
                    : 'text-slate-400 bg-slate-50 opacity-50 italic line-through py-1'
                }
              >
                {isAvail
                  ? `🟢 ${c.name} — ${count} Available • ${c.priceDisplay}/day with Driver`
                  : `🔴 ${c.name} — Not Available (0 left) • ${c.priceDisplay}/day with Driver`}
              </option>
            );
          })}
        </select>
      )}

      {activeTab === 'driver-only' && (
        <select
          value="provided-by-company"
          disabled
          className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-default truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0"
        >
          <option value="provided-by-company" className="text-slate-900 bg-white font-semibold">
            🟢 Verified Commercial Driver (₹{driverDailyRate}/day) • Available
          </option>
        </select>
      )}

      {activeTab === 'self-drive-bike' && (
        <select
          value={selectedBikeId}
          onChange={(e) => setSelectedBikeId(e.target.value)}
          className={`w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0 ${
            isSelectedUnavailable ? 'text-rose-600 opacity-60' : ''
          }`}
        >
          {dbBikes.map((b) => {
            const count = b.availableCount !== undefined ? b.availableCount : (b.quantity ?? 1);
            const isAvail = b.isAvailable !== false && count > 0;
            return (
              <option
                key={b.id || b.name}
                value={b.id || b.name}
                disabled={!isAvail}
                className={
                  isAvail
                    ? 'text-slate-900 bg-white font-semibold py-1'
                    : 'text-slate-400 bg-slate-50 opacity-50 italic line-through py-1'
                }
              >
                {isAvail
                  ? `🟢 ${b.name} — ${count} Available • ${b.priceDisplay || `₹${b.pricePerDay}`}/day`
                  : `🔴 ${b.name} — Not Available (0 left) • ${b.priceDisplay || `₹${b.pricePerDay}`}/day`}
              </option>
            );
          })}
        </select>
      )}

      {activeTab === 'tour-packages' && (
        <select
          value={selectedTourId}
          onChange={(e) => setSelectedTourId(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0"
        >
          {dbTours.map((t) => (
            <option key={t.id} value={t.id} className="text-slate-900 bg-white font-semibold py-1">
              🟢 {t.name} ({t.startingPrice}) • {t.duration}
            </option>
          ))}
        </select>
      )}

      {/* Dynamic availability notice + Live Cloudinary Vehicle Thumbnail */}
      {selectedCarObj && (
        <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-200/60 mt-1">
          <div className="min-w-0 flex-1">
            {isSelectedUnavailable ? (
              <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0 text-rose-600" />
                <span className="truncate">Not available right now (0 in stock).</span>
              </div>
            ) : (
              <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{selectedCarObj.availableCount || 1} available • {selectedCarObj.seats || '5 Seats'}</span>
              </div>
            )}
          </div>

          {selectedCarObj.image && (
            <div className="w-12 h-8 rounded bg-white border border-slate-200/90 p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
              <img
                src={selectedCarObj.image}
                alt={selectedCarObj.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

