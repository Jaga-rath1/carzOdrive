import React from 'react';
import { Car, Bike, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { SelfDriveCarIcon } from './HeroServiceIcons';
import { useDiscount } from '../../hooks/useDiscount';

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
  const { calculateDiscount, isDiscountActive, badgeText } = useDiscount();
  const withDriverId = selectedWithDriverCarId || selectedChauffeurId;
  const setWithDriverId = setSelectedWithDriverCarId || setSelectedChauffeurId;

  // Determine selected object for current active tab
  const selectedCarObj =
    activeTab === 'self-drive-car'
      ? (dbCars.find((c) => c.id === selectedCarId) || dbCars[0])
      : activeTab === 'car-with-driver'
      ? (dbCars.find((c) => c.id === withDriverId) || dbCars[0])
      : activeTab === 'self-drive-bike'
      ? (dbBikes.find((b) => (b.id || b.name) === selectedBikeId) || dbBikes[0])
      : activeTab === 'tour-packages'
      ? (dbTours.find((t) => t.id === selectedTourId) || dbTours[0])
      : { name: 'Verified Driver', pricePerDay: driverDailyRate, isAvailable: true };

  const isSelectedUnavailable = selectedCarObj && selectedCarObj.isAvailable === false;

  // Selected item discount calculation for live pill showcase
  const selectedItemRate =
    activeTab === 'car-with-driver'
      ? (Number(selectedCarObj?.pricePerDay) || 1499) + Number(driverDailyRate || 799)
      : activeTab === 'driver-only'
      ? Number(driverDailyRate || 799)
      : activeTab === 'tour-packages'
      ? (Number(selectedCarObj?.priceNumeric) || Number(selectedCarObj?.pricePerDay) || 4999)
      : (Number(selectedCarObj?.pricePerDay) || Number(selectedCarObj?.priceNumeric) || 1499);

  const selectedDiscount = calculateDiscount(selectedItemRate, activeTab);

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
        <div className="flex items-center gap-1.5 shrink-0">
          {isDiscountActive && (
            <span className="text-[7.5px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
              <Tag className="w-2 h-2 text-emerald-600" />
              <span>{badgeText || 'Special Discount'}</span>
            </span>
          )}
          <span
            className={`text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${
              isSelectedUnavailable
                ? 'text-rose-700 bg-rose-50 border-rose-200'
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}
          >
            {isSelectedUnavailable ? '0 Available' : 'Live Fleet'}
          </span>
        </div>
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
            const baseRate = Number(c.pricePerDay) || Number(c.priceNumeric) || 1499;
            const disc = calculateDiscount(baseRate, 'self-drive-car');
            const priceText = disc.isDiscountActive && disc.discountAmount > 0
              ? `₹${disc.finalAmount.toLocaleString('en-IN')}/day (${disc.badgeText} • was ₹${baseRate.toLocaleString('en-IN')})`
              : `₹${baseRate.toLocaleString('en-IN')}/day`;
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
                  ? `🟢 ${c.name} — ${count} Available • ${priceText}`
                  : `🔴 ${c.name} — Not Available (0 left) • ${priceText}`}
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
            const baseCarRate = Number(c.pricePerDay) || Number(c.priceNumeric) || 1499;
            const totalWithDriver = baseCarRate + Number(driverDailyRate || 799);
            const disc = calculateDiscount(totalWithDriver, 'car-with-driver');
            const priceText = disc.isDiscountActive && disc.discountAmount > 0
              ? `₹${disc.finalAmount.toLocaleString('en-IN')}/day with Driver (${disc.badgeText} • was ₹${totalWithDriver.toLocaleString('en-IN')})`
              : `₹${totalWithDriver.toLocaleString('en-IN')}/day with Driver`;
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
                  ? `🟢 ${c.name} — ${count} Available • ${priceText}`
                  : `🔴 ${c.name} — Not Available (0 left) • ${priceText}`}
              </option>
            );
          })}
        </select>
      )}

      {activeTab === 'driver-only' && (() => {
        const baseRate = Number(driverDailyRate || 799);
        const disc = calculateDiscount(baseRate, 'driver-only');
        const driverPriceText = disc.isDiscountActive && disc.discountAmount > 0
          ? `₹${disc.finalAmount}/day (${disc.badgeText} • was ₹${baseRate})`
          : `₹${baseRate}/day`;
        return (
          <select
            value="provided-by-company"
            disabled
            className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-default truncate py-1 sm:py-0.5 min-h-[38px] sm:min-h-0"
          >
            <option value="provided-by-company" className="text-slate-900 bg-white font-semibold">
              🟢 Verified Commercial Driver ({driverPriceText}) • Available
            </option>
          </select>
        );
      })()}

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
            const baseBikeRate = Number(b.pricePerDay) || Number(b.priceNumeric) || 499;
            const disc = calculateDiscount(baseBikeRate, 'self-drive-bike');
            const priceText = disc.isDiscountActive && disc.discountAmount > 0
              ? `₹${disc.finalAmount.toLocaleString('en-IN')}/day (${disc.badgeText} • was ₹${baseBikeRate.toLocaleString('en-IN')})`
              : `₹${baseBikeRate.toLocaleString('en-IN')}/day`;
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
                  ? `🟢 ${b.name} — ${count} Available • ${priceText}`
                  : `🔴 ${b.name} — Not Available (0 left) • ${priceText}`}
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
          {dbTours.map((t) => {
            const baseTourRate = Number(t.priceNumeric) || Number(t.pricePerDay) || 4999;
            const disc = calculateDiscount(baseTourRate, 'tour-packages');
            const priceText = disc.isDiscountActive && disc.discountAmount > 0
              ? `₹${disc.finalAmount.toLocaleString('en-IN')} (${disc.badgeText} • was ₹${baseTourRate.toLocaleString('en-IN')})`
              : t.startingPrice || `₹${baseTourRate.toLocaleString('en-IN')}`;
            return (
              <option key={t.id} value={t.id} className="text-slate-900 bg-white font-semibold py-1">
                🟢 {t.name} ({priceText}) • {t.duration}
              </option>
            );
          })}
        </select>
      )}

      {/* Dynamic availability notice & Discount Highlight */}
      {selectedCarObj && (
        <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-200/60 mt-1 flex-wrap">
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

          {selectedDiscount?.isDiscountActive && selectedDiscount?.discountAmount > 0 && !isSelectedUnavailable && (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400 line-through decoration-rose-500 decoration-2 font-semibold">
                ₹{selectedDiscount.originalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-emerald-600 sm:text-sm font-black">
                ₹{selectedDiscount.finalAmount.toLocaleString('en-IN')}{activeTab === 'tour-packages' ? '' : '/day'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                {selectedDiscount.badgeText}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

