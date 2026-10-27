import React, { useState } from 'react';
import { IndianRupee, Plus, X, CheckCircle2, ShieldAlert } from 'lucide-react';

const COMMON_INCLUSIONS = [
  'Dedicated AC Executive Vehicle for the entire tour',
  'Professional Driver in livery with verified route experience',
  'All Fuel, Toll Charges, Parking Fees & Inter-District State Permits',
  'Handpicked Deluxe Hotel Accommodation on Twin Sharing',
  'Complimentary Daily Morning Breakfast',
  'Priority Jagannath Temple & Konark Sun Temple Darshan Assistance',
  'Chilika Lake Private Motorboat Ride & Dolphin Spotting',
  'Bottled Mineral Water & First-Aid Kit Onboard',
];

const COMMON_EXCLUSIONS = [
  'Lunch & Dinner (Authentic Odia Thali recommendations provided)',
  'Airfare or Railway Tickets to/from Bhubaneswar',
  'Monument Photography & Videography / Drone Permission Passes',
  'Personal expenses (Laundry, Telephone, Tips & Gratuities)',
  'Any unforeseen expenses arising due to road blocks or natural delays',
];

export const PackagePricingTab = ({ formData, handleChange, setFormData }) => {
  const [customInclusion, setCustomInclusion] = useState('');
  const [customExclusion, setCustomExclusion] = useState('');

  const toggleInclusion = (item) => {
    setFormData((prev) => {
      const exists = prev.inclusions.includes(item);
      return {
        ...prev,
        inclusions: exists
          ? prev.inclusions.filter((i) => i !== item)
          : [...prev.inclusions, item],
      };
    });
  };

  const addCustomInclusion = () => {
    if (!customInclusion.trim()) return;
    if (!formData.inclusions.includes(customInclusion.trim())) {
      setFormData((prev) => ({
        ...prev,
        inclusions: [...prev.inclusions, customInclusion.trim()],
      }));
    }
    setCustomInclusion('');
  };

  const removeInclusion = (item) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((i) => i !== item),
    }));
  };

  const toggleExclusion = (item) => {
    setFormData((prev) => {
      const exists = prev.exclusions.includes(item);
      return {
        ...prev,
        exclusions: exists
          ? prev.exclusions.filter((i) => i !== item)
          : [...prev.exclusions, item],
      };
    });
  };

  const addCustomExclusion = () => {
    if (!customExclusion.trim()) return;
    if (!formData.exclusions.includes(customExclusion.trim())) {
      setFormData((prev) => ({
        ...prev,
        exclusions: [...prev.exclusions, customExclusion.trim()],
      }));
    }
    setCustomExclusion('');
  };

  const removeExclusion = (item) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((i) => i !== item),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Pricing Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
          <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
            <span>Adult Price (₹ per person) *</span>
          </label>
          <input
            type="number"
            name="adultPrice"
            placeholder="4999"
            value={formData.adultPrice}
            onChange={(e) => {
              handleChange(e);
              const val = Number(e.target.value);
              setFormData((prev) => ({
                ...prev,
                adultPrice: val,
                priceNumeric: val,
                startingPrice: `₹${val.toLocaleString('en-IN')}`,
                childPrice: prev.childPrice || Math.round(val * 0.5),
              }));
            }}
            required
            className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-sm font-black text-blue-950 outline-none"
          />
          <span className="text-[10px] text-blue-600 font-semibold block mt-1">
            Primary package starting price
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
          <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-zinc-500" />
            <span>Child Price (₹ 5-12 Years)</span>
          </label>
          <input
            type="number"
            name="childPrice"
            placeholder="2499"
            value={formData.childPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-300 text-sm font-black text-zinc-950 outline-none"
          />
          <span className="text-[10px] text-zinc-500 font-semibold block mt-1">
            Usually 50% of adult tariff
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Infant Price (₹ Below 5 Years)</span>
          </label>
          <input
            type="number"
            name="infantPrice"
            placeholder="0"
            value={formData.infantPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-sm font-black text-emerald-950 outline-none"
          />
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            Complimentary seat & stay
          </span>
        </div>
      </div>

      {/* Package Inclusions */}
      <div className="space-y-3 pt-2 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Package Inclusions ({formData.inclusions.length} Selected)</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-medium">Click to toggle quick presets</span>
        </div>

        {/* Preset Inclusions Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INCLUSIONS.map((item) => {
            const isSelected = formData.inclusions.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInclusion(item)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Inclusion Adder */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add specific custom inclusion (e.g. Traditional Odia Welcome Drink at Hub)"
            value={customInclusion}
            onChange={(e) => setCustomInclusion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomInclusion();
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
          <button
            type="button"
            onClick={addCustomInclusion}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Active Inclusions List */}
        {formData.inclusions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
            {formData.inclusions.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs text-emerald-950 font-medium shadow-xs"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeInclusion(item)}
                  className="text-emerald-600 hover:text-rose-600 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Package Exclusions */}
      <div className="space-y-3 pt-2 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Package Exclusions ({formData.exclusions.length} Selected)</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-medium">Click to toggle quick presets</span>
        </div>

        {/* Preset Exclusions Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_EXCLUSIONS.map((item) => {
            const isSelected = formData.exclusions.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleExclusion(item)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <X className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-600' : 'text-zinc-400'}`} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Exclusion Adder */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add specific exclusion (e.g. Personal water sports gear at Puri beach)"
            value={customExclusion}
            onChange={(e) => setCustomExclusion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomExclusion();
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
          <button
            type="button"
            onClick={addCustomExclusion}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Active Exclusions List */}
        {formData.exclusions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-rose-50/40 border border-rose-200/60">
            {formData.exclusions.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs text-rose-950 font-medium shadow-xs"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeExclusion(item)}
                  className="text-rose-600 hover:text-rose-900 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
