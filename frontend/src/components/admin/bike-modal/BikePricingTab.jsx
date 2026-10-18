import React from 'react';

export const BikePricingTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Daily Rate (₹) *</label>
          <input
            type="number"
            name="pricePerDay"
            placeholder="e.g. 799"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-bold text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Hourly Rate (₹)</label>
          <input
            type="number"
            name="pricePerHour"
            placeholder="e.g. 80"
            value={formData.pricePerHour}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Security Deposit (₹)</label>
          <input
            type="number"
            name="depositNumeric"
            placeholder="e.g. 1500"
            value={formData.depositNumeric}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Extra Km Rate (₹/km)</label>
          <input
            type="number"
            name="extraKmCharge"
            placeholder="e.g. 4"
            value={formData.extraKmCharge}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-zinc-900 mb-1">Fleet Available Units</label>
            <p className="text-[11px] text-zinc-500 mb-2">Number of bikes in inventory</p>
          </div>
          <input
            type="number"
            min="0"
            name="availableCount"
            value={formData.availableCount}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-900 outline-none focus:border-black"
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <label htmlFor="bikeIsAvailable" className="text-xs font-bold text-zinc-900 block cursor-pointer">
              Live for Bookings
            </label>
            <p className="text-[11px] text-zinc-500">Show as Available in catalog</p>
          </div>
          <input
            type="checkbox"
            id="bikeIsAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="w-5 h-5 rounded text-black accent-black cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <label htmlFor="bikeIsFeatured" className="text-xs font-bold text-zinc-900 block cursor-pointer">
              Featured Two-Wheeler
            </label>
            <p className="text-[11px] text-zinc-500">Show highlighted badge</p>
          </div>
          <input
            type="checkbox"
            id="bikeIsFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-5 h-5 rounded text-black accent-black cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
