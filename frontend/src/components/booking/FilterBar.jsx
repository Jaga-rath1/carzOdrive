import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const FilterBar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxPrice = 1500,
  itemTypeLabel = 'Vehicles'
}) => {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-card space-y-4">
      {/* Top Row: Search and Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${itemTypeLabel.toLowerCase()} by make, model, or features...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Price Slider & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Price Range Slider */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            <span className="text-xs text-slate-600 whitespace-nowrap font-medium">
              Max: <strong className="text-blue-600 font-bold">{formatCurrency(priceRange)}</strong>/day
            </span>
            <input
              type="range"
              min="150"
              max={maxPrice}
              step="50"
              value={priceRange}
              onChange={(e) => onPriceRangeChange(Number(e.target.value))}
              className="w-24 sm:w-28 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-slate-100">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
