import React from 'react';

export const RentBikeOwnerDetails = ({ formData, onInputChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            name="ownerName"
            value={formData.ownerName}
            onChange={onInputChange}
            placeholder="e.g. Priyabrata Jena"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="+91 98765 43210"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1">
          Email Address *
        </label>
        <input
          type="email"
          required
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="priyabrata@example.com"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>
    </>
  );
};
