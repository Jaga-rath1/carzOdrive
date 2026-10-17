import React, { useState } from 'react';
import { Sparkles, Plus, X, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

const COMMON_HIGHLIGHTS = [
  'Zero-Stress Doorstep Pickup & Drop across Bhubaneswar & Odisha',
  'Exclusive Chauffeur-Driven AC Executive Vehicle throughout the tour',
  'Priority Darshan assistance at Shree Jagannath Temple, Puri',
  'Guided exploration of 13th Century Konark Sun Temple Architecture',
  'Private Motorboat Safari at Chilika Lake with Irrawaddy Dolphin Spotting',
  'Authentic Odia Temple Mahaprasad & Coastal Seafood Culinary Stops',
  'Artisan Village Visit to Raghurajpur (Pattachitra Heritage Village)',
  'Complimentary 24x7 On-Call Concierge & verified local route support',
];

export const PackageHighlightsTab = ({ formData, handleChange, setFormData }) => {
  const [customHighlight, setCustomHighlight] = useState('');

  const toggleHighlight = (item) => {
    setFormData((prev) => {
      const exists = (prev.highlights || []).includes(item);
      return {
        ...prev,
        highlights: exists
          ? prev.highlights.filter((h) => h !== item)
          : [...(prev.highlights || []), item],
      };
    });
  };

  const addCustomHighlight = () => {
    if (!customHighlight.trim()) return;
    const item = customHighlight.trim();
    if (!(formData.highlights || []).includes(item)) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), item],
      }));
    }
    setCustomHighlight('');
  };

  const removeHighlight = (item) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((h) => h !== item),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Detailed Tour Description */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Full Tour Narrative & Overview</span>
        </label>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide an enticing and comprehensive description of the journey, ancient heritage, temple traditions, coastal landscapes, and chauffeur hospitality..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:bg-white focus:border-blue-600 resize-none"
        />
      </div>

      {/* Package Highlights */}
      <div className="space-y-3 pt-2 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Key Experience Highlights ({(formData.highlights || []).length} Selected)</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-medium">Click to toggle common highlights</span>
        </div>

        {/* Preset Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_HIGHLIGHTS.map((item) => {
            const isSelected = (formData.highlights || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleHighlight(item)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-500' : 'text-zinc-400'}`} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Highlight Adder */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom highlight (e.g. Sunset bonfire & eco-tent camping at Deomali)"
            value={customHighlight}
            onChange={(e) => setCustomHighlight(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomHighlight();
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none"
          />
          <button
            type="button"
            onClick={addCustomHighlight}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Active Highlights */}
        {(formData.highlights || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-amber-50/40 border border-amber-200/60">
            {(formData.highlights || []).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs text-amber-950 font-medium shadow-xs"
              >
                <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(item)}
                  className="text-amber-600 hover:text-rose-600 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tour Guidelines */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
        <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Odisha Tourism Traveler Assurance</span>
        </span>
        <p className="text-[11px] text-zinc-600 leading-relaxed">
          All packages are conducted in sanitized, commercial vehicles with verified Odia-speaking chauffeurs. Temple guidelines (modest attire, non-leather items in Puri Srimandir) are assisted by your assigned route manager.
        </p>
      </div>
    </div>
  );
};
