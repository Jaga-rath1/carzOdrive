import React from 'react';

export const VehicleSpecsTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Seating Capacity</label>
          <select
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
          >
            <option value={4}>4 Seater</option>
            <option value={5}>5 Seater</option>
            <option value={7}>7 Seater</option>
            <option value={8}>8 Seater</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fuel Type</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
          >
            <option value="DIESEL">Diesel</option>
            <option value="PETROL">Petrol</option>
            <option value="CNG">CNG</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Transmission</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
          >
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
            <option value="AMT">AMT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Drivetrain</label>
          <input
            type="text"
            name="drivetrain"
            placeholder="4x4, FWD, AWD"
            value={formData.drivetrain}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Engine Displacement</label>
          <input
            type="text"
            name="engineCapacity"
            placeholder="e.g. 1997 cc, 1.5L Turbo"
            value={formData.engineCapacity}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Max Horsepower</label>
          <input
            type="text"
            name="power"
            placeholder="e.g. 150 HP"
            value={formData.power}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Fuel Economy</label>
          <input
            type="text"
            name="mileage"
            placeholder="e.g. 16.5 km/l"
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
            placeholder="e.g. 175 km/h"
            value={formData.topSpeed}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Boot Space / Luggage</label>
          <input
            type="text"
            name="bootSpace"
            placeholder="e.g. 380 Litres / 3 Large Bags"
            value={formData.bootSpace}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Airbags & Safety</label>
          <input
            type="text"
            name="airbags"
            placeholder="e.g. 6 Airbags (Dual Front + Side)"
            value={formData.airbags}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Ground Clearance</label>
          <input
            type="text"
            name="groundClearance"
            placeholder="e.g. 226 mm"
            value={formData.groundClearance}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
