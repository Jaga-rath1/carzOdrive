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
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-15');
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
    <div className="w-full bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-[0_4px_15px_rgba(37,99,235,0.35)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {/* Location Field */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {activeTab === 'tour-package' ? 'Tour Starting Point' : 'Pick-up Location'}
            </span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            {BHUBANESWAR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Pick-up Date & Time */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Pick-up Date
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            />
            <span className="text-slate-400 text-xs">at</span>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Drop-off Date & Time */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Return Date
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            />
            <span className="text-slate-400 text-xs">at</span>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Search CTA Button */}
        <div className="flex items-center">
          <button
            type="submit"
            className="w-full h-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6)] border border-blue-400/30 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
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
