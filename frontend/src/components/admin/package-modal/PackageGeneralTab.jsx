import React from 'react';
import { Compass, MapPin, Calendar, Users, Car, Sparkles, Navigation } from 'lucide-react';

export const ODISHA_THEMES = [
  'Spiritual & Temples',
  'Coastal & Beaches',
  'Wildlife & Nature',
  'Heritage & Culture',
  'Eco & Hill Stations',
  'Adventure',
  'Weekend Getaways',
];

export const PackageGeneralTab = ({ formData, handleChange, setFormData }) => {
  const handleDurationDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 1;
    const nights = days > 1 ? days - 1 : 0;
    setFormData((prev) => ({
      ...prev,
      durationDays: days,
      durationNights: nights,
      duration: `${days} Days / ${nights} Nights`,
    }));
  };

  const handleDurationNightsChange = (e) => {
    const nights = parseInt(e.target.value, 10) || 0;
    setFormData((prev) => ({
      ...prev,
      durationNights: nights,
      duration: `${prev.durationDays || 2} Days / ${nights} Nights`,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Title & Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Tour Package Title *</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Golden Triangle: Puri, Konark & Bhubaneswar"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Destination / Circuit *</span>
          </label>
          <input
            type="text"
            name="destination"
            placeholder="e.g. Puri - Konark - Chilika - Bhubaneswar"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Odisha Theme & Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Odisha Tourism Theme *</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              handleChange(e);
              setFormData((prev) => ({ ...prev, odishaTheme: e.target.value }));
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
          >
            {ODISHA_THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Highlight Badge</label>
          <input
            type="text"
            name="badge"
            placeholder="e.g. Bestseller / Odisha Special"
            value={formData.badge}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-blue-600" />
            <span>Featured Vehicle with Driver</span>
          </label>
          <input
            type="text"
            name="featuredVehicle"
            placeholder="e.g. Toyota Innova Crysta / Luxury SUV"
            value={formData.featuredVehicle}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Duration & Group Limits */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Duration Days</span>
          </label>
          <input
            type="number"
            min="1"
            max="30"
            name="durationDays"
            value={formData.durationDays}
            onChange={handleDurationDaysChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Duration Nights</label>
          <input
            type="number"
            min="0"
            max="30"
            name="durationNights"
            value={formData.durationNights}
            onChange={handleDurationNightsChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Min Pax</span>
          </label>
          <input
            type="number"
            min="1"
            name="minPax"
            value={formData.minPax}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5">Max Pax</label>
          <input
            type="number"
            min="1"
            name="maxPax"
            value={formData.maxPax}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Pickup & Drop Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pickup Hub / Point</span>
          </label>
          <input
            type="text"
            name="pickupLocation"
            placeholder="e.g. Bhubaneswar Biju Patnaik Airport / Railway Station"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-rose-500" />
            <span>Drop-off Hub / Point</span>
          </label>
          <input
            type="text"
            name="dropLocation"
            placeholder="e.g. Bhubaneswar Hub / Airport"
            value={formData.dropLocation}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Marketing Tagline</label>
        <input
          type="text"
          name="tagline"
          placeholder="e.g. Experience ancient Kalinga temples, golden coastlines and royal Odia hospitality"
          value={formData.tagline}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-none"
        />
      </div>
    </div>
  );
};
