import React from 'react';

export const VehicleGeneralTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Car Display Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Mahindra Thar 4x4 (Hard Top Turbo)"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black text-xs font-bold text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Brand / Make *</label>
          <input
            type="text"
            name="brand"
            placeholder="e.g. Mahindra, Maruti, Hyundai"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black text-xs font-bold text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Model Name</label>
          <input
            type="text"
            name="model"
            placeholder="e.g. Thar, Swift, Creta"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">RC / Reg Number *</label>
          <input
            type="text"
            name="vehicleNumber"
            placeholder="OD-02-AX-1234"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-xs font-mono uppercase text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Buying / Model Year</label>
          <select
            name="buyingYear"
            value={formData.buyingYear}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 outline-none focus:border-black"
          >
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Exterior Color</label>
          <input
            type="text"
            name="color"
            placeholder="e.g. Pearl White, Deep Black"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black uppercase font-bold"
          >
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="sedan">Sedan</option>
            <option value="muv">MUV / MPV</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Display Badge</label>
          <input
            type="text"
            name="badge"
            placeholder="e.g. Verified Fleet, Most Popular"
            value={formData.badge}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Hub City</label>
          <input
            type="text"
            name="locationCity"
            value={formData.locationCity}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Marketing Tagline</label>
        <input
          type="text"
          name="tagline"
          placeholder="e.g. Top-tier luxury 4x4 SUV for highway road trips, weddings & VIP transfers"
          value={formData.tagline}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Odisha Hub Address</label>
        <input
          type="text"
          name="hubAddress"
          placeholder="e.g. Bhubaneswar Airport & Master Canteen Station Hub"
          value={formData.hubAddress}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
        />
      </div>
    </div>
  );
};
