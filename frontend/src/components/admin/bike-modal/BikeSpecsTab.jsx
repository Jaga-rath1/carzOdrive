import React from 'react';

export const BikeSpecsTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Engine CC *</label>
          <input
            type="number"
            name="engineCC"
            placeholder="350"
            value={formData.engineCC}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Transmission</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none"
          >
            <option value="4-Speed Manual">4-Speed Manual</option>
            <option value="5-Speed Manual">5-Speed Manual</option>
            <option value="6-Speed Manual">6-Speed Manual</option>
            <option value="Automatic (CVT)">Automatic (CVT Scooty)</option>
            <option value="Electric Single Speed">Electric (No Clutch)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fuel Type</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none"
          >
            <option value="Petrol">Petrol</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Braking System</label>
          <input
            type="text"
            name="brakes"
            placeholder="Dual-Channel ABS"
            value={formData.brakes}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Max Horsepower</label>
          <input
            type="text"
            name="power"
            placeholder="e.g. 20.2 HP"
            value={formData.power}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Max Torque</label>
          <input
            type="text"
            name="torque"
            placeholder="e.g. 27 Nm"
            value={formData.torque}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fuel Mileage</label>
          <input
            type="text"
            name="mileage"
            placeholder="e.g. 38-42 km/l"
            value={formData.mileage}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Top Speed</label>
          <input
            type="text"
            name="topSpeed"
            placeholder="e.g. 120 km/h"
            value={formData.topSpeed}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Dry Kerb Weight</label>
        <input
          type="text"
          name="dryWeight"
          placeholder="e.g. 195 kg (Classic 350) or 106 kg (Activa)"
          value={formData.dryWeight}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
        />
      </div>
    </div>
  );
};
