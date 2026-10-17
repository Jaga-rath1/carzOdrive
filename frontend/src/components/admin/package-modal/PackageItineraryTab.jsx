import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export const PackageItineraryTab = ({ formData, setFormData }) => {
  const [newActivityInputs, setNewActivityInputs] = useState({});

  const itinerary = formData.itinerary || [];

  const handleDayChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: `Day ${nextDayNum}`,
          title: `Day ${nextDayNum}`,
          description: '',
          activities: [],
        },
      ],
    }));
  };

  const handleRemoveDay = (index) => {
    setFormData((prev) => {
      const updated = prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, day: `Day ${idx + 1}` }));
      return { ...prev, itinerary: updated };
    });
  };

  const handleAddActivity = (dayIndex) => {
    const actText = (newActivityInputs[dayIndex] || '').trim();
    if (!actText) return;

    setFormData((prev) => {
      const updated = [...prev.itinerary];
      const currentActs = updated[dayIndex]?.activities || [];
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities: [...currentActs, actText],
      };
      return { ...prev, itinerary: updated };
    });

    setNewActivityInputs((prev) => ({ ...prev, [dayIndex]: '' }));
  };

  const handleRemoveActivity = (dayIndex, actIndex) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      const currentActs = updated[dayIndex]?.activities || [];
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities: currentActs.filter((_, i) => i !== actIndex),
      };
      return { ...prev, itinerary: updated };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Day-wise Tour Itinerary ({itinerary.length} Days Planned)</span>
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Outline the day-by-day sightseeing, routes, and activities planned for tourists.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddDay}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Day Plan</span>
        </button>
      </div>

      {itinerary.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 space-y-2">
          <Calendar className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-xs font-bold text-zinc-600">No itinerary steps added yet.</p>
          <p className="text-[11px] text-zinc-400">Click "Add Day Plan" above to create Day 1 of the tour.</p>
          <button
            type="button"
            onClick={handleAddDay}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day 1</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {itinerary.map((dayItem, dayIdx) => (
            <div
              key={dayIdx}
              className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3"
            >
              {/* Day Header Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shrink-0">
                    {dayItem.day || `Day ${dayIdx + 1}`}
                  </span>
                  <input
                    type="text"
                    value={dayItem.title || ''}
                    placeholder={`e.g. Day ${dayIdx + 1}: Bhubaneswar Temples & Puri Drive`}
                    onChange={(e) => handleDayChange(dayIdx, 'title', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 w-full sm:w-96 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveDay(dayIdx)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Day Narrative Description */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Narrative & Sightseeing Details:
                </label>
                <textarea
                  rows={2}
                  value={dayItem.description || dayItem.desc || ''}
                  onChange={(e) => {
                    handleDayChange(dayIdx, 'description', e.target.value);
                    handleDayChange(dayIdx, 'desc', e.target.value);
                  }}
                  placeholder="Describe the morning start, road routes, monument entry, meals, and overnight accommodation..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 outline-none focus:bg-white focus:border-blue-600 resize-none"
                />
              </div>

              {/* Day Key Activities */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Key Milestones & Activities for this day:
                </label>

                {/* Activity Chips */}
                {dayItem.activities && dayItem.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {dayItem.activities.map((act, actIdx) => (
                      <span
                        key={actIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-semibold"
                      >
                        <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>{act}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(dayIdx, actIdx)}
                          className="text-blue-500 hover:text-rose-600 cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Activity Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newActivityInputs[dayIdx] || ''}
                    placeholder="Add activity (e.g. Sunset Boat Cruise at Chilika Lagoon)"
                    onChange={(e) =>
                      setNewActivityInputs((prev) => ({ ...prev, [dayIdx]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddActivity(dayIdx);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddActivity(dayIdx)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
