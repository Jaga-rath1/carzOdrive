import React from 'react';

export const VehiclePricingTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Daily Rate (₹) *</label>
          <input
            type="number"
            name="pricePerDay"
            placeholder="e.g. 2999"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-sm font-bold text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Hourly Rate (₹)</label>
          <input
            type="number"
            name="pricePerHour"
            placeholder="e.g. 250"
            value={formData.pricePerHour}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-sm text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Security Deposit (₹)</label>
          <input
            type="number"
            name="depositNumeric"
            placeholder="e.g. 5000"
            value={formData.depositNumeric}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-sm text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Extra Km Rate (₹/km)</label>
          <input
            type="number"
            name="extraKmCharge"
            placeholder="e.g. 12"
            value={formData.extraKmCharge}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-sm text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-900">Fleet Quantity (Stock Units) *</label>
              {(Number(formData.quantity ?? formData.availableCount) === 0) && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Currently Unavailable
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 mb-2">
              Units in hub inventory (Setting 0 shows "Currently Unavailable" on client side)
            </p>
          </div>
          <input
            type="number"
            min="0"
            name="quantity"
            value={formData.quantity !== undefined ? formData.quantity : (formData.availableCount ?? 1)}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0);
              handleChange({ target: { name: 'quantity', value: val } });
              handleChange({ target: { name: 'availableCount', value: val } });
            }}
            className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-900 outline-none focus:border-black"
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <label htmlFor="isAvailable" className="text-xs font-bold text-zinc-900 block cursor-pointer">
              Live for Bookings
            </label>
            <p className="text-[11px] text-zinc-500">Show as Available in catalog</p>
          </div>
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="w-5 h-5 rounded text-black accent-black cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div>
            <label htmlFor="isFeatured" className="text-xs font-bold text-zinc-900 block cursor-pointer">
              Featured Vehicle
            </label>
            <p className="text-[11px] text-zinc-500">Highlight badge on home page</p>
          </div>
          <input
            type="checkbox"
            id="isFeatured"
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
