import React from 'react';
import { Search } from 'lucide-react';

export const ODISHA_THEME_FILTERS = [
  'ALL',
  'Spiritual & Temples',
  'Coastal & Beaches',
  'Wildlife & Nature',
  'Heritage & Culture',
  'Eco & Hill Stations',
  'Adventure',
  'Weekend Getaways',
];

export const AdminPackageFilterBar = ({
  searchTerm,
  setSearchTerm,
  themeFilter,
  setThemeFilter,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by tour title, destination circuit, theme, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-900 placeholder:text-zinc-400 shadow-xs outline-none focus:border-blue-600"
        />
      </div>

      {/* Odisha Theme Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {ODISHA_THEME_FILTERS.map((theme) => {
          const isActive = themeFilter === theme;
          return (
            <button
              key={theme}
              type="button"
              onClick={() => setThemeFilter(theme)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {theme}
            </button>
          );
        })}
      </div>
    </div>
  );
};
