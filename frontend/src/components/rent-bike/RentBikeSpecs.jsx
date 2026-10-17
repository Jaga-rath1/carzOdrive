import React from 'react';

export const RentBikeSpecs = ({ formData, onInputChange }) => {
  return (
    <>
      {/* Bike Brand & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Bike Brand *
          </label>
          <select
            required
            name="bikeBrand"
            value={formData.bikeBrand}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">Select Brand</option>
            <option value="Royal Enfield">Royal Enfield</option>
            <option value="Honda">Honda</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Bajaj">Bajaj</option>
            <option value="TVS">TVS</option>
            <option value="Hero">Hero MotoCorp</option>
            <option value="KTM">KTM</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Jawa">Jawa / Yezdi</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Bike Model *
          </label>
          <input
            type="text"
            required
            name="bikeModel"
            value={formData.bikeModel}
            onChange={onInputChange}
            placeholder="e.g. Classic 350 / Activa 6G / R15"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Engine Capacity (CC) *
          </label>
          <input
            type="text"
            required
            name="engineCC"
            value={formData.engineCC}
            onChange={onInputChange}
            placeholder="e.g. 350 / 125 / 150"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Reg No, Bike Type, Year */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Registration Number *
          </label>
          <input
            type="text"
            required
            name="bikeNumber"
            value={formData.bikeNumber}
            onChange={onInputChange}
            placeholder="OD-02-AK-9876"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Category / Type *
          </label>
          <select
            name="bikeType"
            value={formData.bikeType}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="Scooter">Scooter / Automatic (Activa, Jupiter)</option>
            <option value="Commuter">Commuter Bike (Splendor, Shine, Pulsar)</option>
            <option value="Cruiser">Cruiser / Tourer (Classic 350, Hunter)</option>
            <option value="Sports">Sports / Naked (R15, Duke, MT-15)</option>
            <option value="Adventure">Adventure / Dual-Sport (Himalayan, Xpulse)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Mfg Year *
          </label>
          <select
            name="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </div>

      {/* City & Expected Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Hub City *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
            <option value="Cuttack">Cuttack, Odisha</option>
            <option value="Puri">Puri, Odisha</option>
            <option value="Rourkela">Rourkela, Odisha</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Expected Daily Rental Price (₹) *
          </label>
          <input
            type="number"
            name="expectedDailyPrice"
            value={formData.expectedDailyPrice}
            onChange={onInputChange}
            placeholder="850"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
    </>
  );
};
