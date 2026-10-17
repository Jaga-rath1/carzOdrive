import React from 'react';

export const BikeGeneralTab = ({ formData, handleChange, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Bike Display Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Royal Enfield Classic 350 Reborn"
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
            placeholder="e.g. Royal Enfield, Honda, Yamaha"
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
            placeholder="e.g. Classic 350, Activa 6G"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">RC / Reg Number *</label>
          <input
            type="text"
            name="vehicleNumber"
            placeholder="OD-02-BZ-5678"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono uppercase text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Buying / Model Year</label>
          <select
            name="buyingYear"
            value={formData.buyingYear}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 outline-none"
          >
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Color</label>
          <input
            type="text"
            name="color"
            placeholder="e.g. Stealth Black, Chrome Red"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Two-Wheeler Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((p) => ({
                ...p,
                category: val,
                bikeType: val.toUpperCase(),
                transmission: val === 'scooter' ? 'Automatic (CVT)' : '5-Speed Manual',
              }));
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold outline-none uppercase"
          >
            <option value="cruiser">Cruiser </option>
            <option value="scooter">Scooter / Scooty</option>
            <option value="commuter">Commuter Bike</option>
            <option value="sports">Sports Bike</option>
            <option value="adventure">Adventure Tourer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Display Badge</label>
          <input
            type="text"
            name="badge"
            placeholder="e.g. Verified, Most Popular"
            value={formData.badge}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">City</label>
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
          placeholder="e.g. Iconic Royal Enfield 350cc thumper ready for Bhubaneswar city commutes and coastal highway tours"
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
          placeholder="e.g. Bhubaneswar Railway Station & Master Canteen Hub"
          value={formData.hubAddress}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
        />
      </div>
    </div>
  );
};
