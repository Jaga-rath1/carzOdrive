import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Bike,
  Shield,
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { getTodayDateString } from '../../utils/formatters';

export const HeroSearchWidget = ({
  onOpenQuickBook,
  activeTab: controlledTab,
  onTabChange
}) => {
  const navigate = useNavigate();
  const [internalTab, setInternalTab] = useState('self-drive');
  const activeTab = controlledTab || internalTab;

  const setActiveTab = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  const [location, setLocation] = useState('SUM Hospital');
  const [pickupDate, setPickupDate] = useState(() => getTodayDateString(1));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(() => getTodayDateString(3));
  const [returnTime, setReturnTime] = useState('18:00');

  const tabs = [
    { id: 'self-drive', label: 'Self Drive', icon: Car, route: '/car-self-ride' },
    { id: 'car-rental', label: 'Car Rental', icon: Car, route: '/car-with-driver' },
    { id: 'bike-rental', label: 'Bike Rental', icon: Bike, route: '/bike-rental' },
    { id: 'drive-rental', label: 'Driver Rental', icon: Shield, route: '/driver-only' },
    { id: 'tour-package', label: 'Tour Package', icon: UserCheck, route: '/tours-packages' },
  ];

  const effectiveLocation = location;

  const handleSearch = (e) => {
    e.preventDefault();
    const currentTab = tabs.find((t) => t.id === activeTab);
    if (onOpenQuickBook) {
      onOpenQuickBook({
        serviceType: activeTab === 'drive-rental' ? 'car-with-driver' : activeTab === 'bike-rental' ? 'self-drive-bike' : activeTab === 'tour-package' ? 'tour-packages' : 'self-drive-car',
        location: effectiveLocation,
        pickupLocation: effectiveLocation,
        pickupDate,
        returnDate,
      });
    } else if (currentTab) {
      navigate(currentTab.route);
    }
  };

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 pb-3 overflow-x-auto no-scrollbar border-b border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
        {/* Location Field */}
        <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
          <label className="text-[10.5px] font-black text-cyan-300 uppercase tracking-wider flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {activeTab === 'tour-package' ? 'Tour Starting Point' : 'Pick-up Location'}
            </span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
          >
            {BHUBANESWAR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Pick-up Date & Time */}
        <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
          <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Pick-up Date & Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              min={getTodayDateString(0)}
              value={pickupDate}
              onChange={(e) => {
                const val = e.target.value;
                const today = getTodayDateString(0);
                if (val && val < today) {
                  setPickupDate(today);
                  if (returnDate && returnDate < today) setReturnDate(today);
                } else {
                  setPickupDate(val);
                  if (returnDate && returnDate < val) setReturnDate(val);
                }
              }}
              className="bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer w-full [color-scheme:dark]"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer w-20 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Drop-off Date & Time */}
        <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-cyan-500/60 focus-within:border-cyan-400 transition-all">
          <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Return Date & Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              min={pickupDate || getTodayDateString(0)}
              value={returnDate}
              onChange={(e) => {
                const val = e.target.value;
                const minAllowed = pickupDate || getTodayDateString(0);
                if (val && val < minAllowed) {
                  setReturnDate(minAllowed);
                } else {
                  setReturnDate(val);
                }
              }}
              className="bg-slate-900 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer w-full [color-scheme:dark]"
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer w-20 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Search CTA Button */}
        <div className="flex items-center">
          <button
            type="submit"
            className="w-full h-full py-3 px-6 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] border border-cyan-400/40 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>
              {activeTab === 'tour-package'
                ? 'Search Tours'
                : activeTab === 'bike-rental'
                  ? 'Search Bikes'
                  : activeTab === 'drive-rental'
                    ? 'Find Driver'
                    : 'Search Cars'}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
