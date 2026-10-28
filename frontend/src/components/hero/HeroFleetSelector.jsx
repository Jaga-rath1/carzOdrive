import React from 'react';
import { Car, AlertCircle } from 'lucide-react';
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
      ? dbBikes.find((b) => (b.id || b.name) === selectedBikeId)
      : null;

  const isSelectedUnavailable = selectedCarObj && selectedCarObj.isAvailable === false;

  return (
    <div
      className={`space-y-1 p-2 sm:p-2.5 rounded-xl transition-all border ${
        isSelectedUnavailable
          ? 'bg-rose-950/40 border-rose-500/80'
          : 'bg-white/12 hover:bg-white/18 focus-within:bg-white/25 border border-white/30 hover:border-cyan-300 focus-within:border-cyan-300 shadow-xs'
      }`}
    >
      <label className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-cyan-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5 truncate">
          {activeTab === 'self-drive-car' ? (
            <SelfDriveCarIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          ) : (
            <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
              ? 'text-rose-300 bg-rose-950 border-rose-700'
              : 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
          }`}
        >
          {isSelectedUnavailable ? '0 Available' : 'Live Fleet'}
        </span>
      </label>

      {activeTab === 'self-drive-car' && (
        <select
          value={selectedCarId}
          onChange={(e) => setSelectedCarId(e.target.value)}
          className={`w-full bg-slate-900 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer truncate py-0.5 ${
            isSelectedUnavailable ? 'text-rose-300 opacity-60' : 'text-white'
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
                    ? 'text-white bg-slate-900 font-semibold py-1'
                    : 'text-slate-500 bg-slate-950 opacity-40 italic line-through py-1'
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
          className={`w-full bg-slate-900 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer truncate py-0.5 ${
            isSelectedUnavailable ? 'text-rose-300 opacity-60' : 'text-white'
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
                    ? 'text-white bg-slate-900 font-semibold py-1'
                    : 'text-slate-500 bg-slate-950 opacity-40 italic line-through py-1'
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
          className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-default truncate py-0.5"
        >
          <option value="provided-by-company">
            🟢 Verified Commercial Driver (₹{driverDailyRate}/day) • Available
          </option>
        </select>
      )}

      {activeTab === 'self-drive-bike' && (
        <select
          value={selectedBikeId}
          onChange={(e) => setSelectedBikeId(e.target.value)}
          className={`w-full bg-slate-900 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer truncate py-0.5 ${
            isSelectedUnavailable ? 'text-rose-300 opacity-60' : 'text-white'
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
                    ? 'text-white bg-slate-900 font-semibold py-1'
                    : 'text-slate-500 bg-slate-950 opacity-40 italic line-through py-1'
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
          className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate py-0.5"
        >
          {dbTours.map((t) => (
            <option key={t.id} value={t.id} className="text-white bg-slate-900 font-semibold py-1">
              🟢 {t.name} ({t.startingPrice}) • {t.duration}
            </option>
          ))}
        </select>
      )}

      {/* Dynamic availability notice below selector */}
      {selectedCarObj && (
        <div className="pt-0.5">
          {isSelectedUnavailable ? (
            <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
              <span>Not available right now (0 in stock). Choose an available car.</span>
            </div>
          ) : (
            <div className="text-[10px] font-semibold text-emerald-400/90 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {selectedCarObj.availableCount || 1} available for instant pickup
              </span>
              {selectedCarObj.seats && (
                <span className="text-slate-400 text-[9.5px]">{selectedCarObj.seats}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

