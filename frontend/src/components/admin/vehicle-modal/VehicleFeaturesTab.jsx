import React from 'react';

export const VehicleFeaturesTab = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Key Vehicle Features (Comma-separated)</label>
        <textarea
          rows={3}
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="e.g. Wireless Apple CarPlay, 6 Airbags, Cruise Control, Reverse 360 Camera, Panoramic Sunroof"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Included with Booking (Comma-separated)</label>
        <textarea
          rows={3}
          name="inclusions"
          value={formData.inclusions}
          onChange={handleChange}
          placeholder="e.g. Zero-Dep Comprehensive Insurance Included, 24x7 Roadside Assistance in Odisha, Free Cancellation"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Rules & Rental Conditions (Comma-separated)</label>
        <textarea
          rows={3}
          name="rules"
          value={formData.rules}
          onChange={handleChange}
          placeholder="e.g. Original Driving License Required, Speed Limit 100 km/h, No Smoking inside vehicle"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black leading-relaxed"
        />
      </div>
    </div>
  );
};
