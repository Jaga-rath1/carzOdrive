import React from 'react';

export const BikeFeaturesTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Included Riding Gear (Comma-separated)</label>
        <input
          type="text"
          name="gearIncluded"
          value={formData.gearIncluded}
          onChange={handleChange}
          placeholder="e.g. 2x Free ISI Helmets, Emergency Tool Kit, Rain Cover"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Key Bike Features (Comma-separated)</label>
        <textarea
          rows={2}
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="e.g. Dual-Channel ABS, Mobile Phone Holder & USB Charger, Tubeless Tires, Electric Start"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Included In Price (Comma-separated)</label>
        <textarea
          rows={2}
          name="inclusions"
          value={formData.inclusions}
          onChange={handleChange}
          placeholder="e.g. Zero-Dep Comprehensive Insurance Included, 24x7 Roadside Assistance across Odisha, Full Tank Option"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Rules & Rental Conditions (Comma-separated)</label>
        <textarea
          rows={2}
          name="rules"
          value={formData.rules}
          onChange={handleChange}
          placeholder="e.g. Valid Two-Wheeler Driving License Required, Helmets Mandatory for Rider & Pillion, Speed Limit 80 km/h"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>
    </div>
  );
};
