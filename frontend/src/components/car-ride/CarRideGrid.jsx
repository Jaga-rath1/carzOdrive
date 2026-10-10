import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Fuel, Gauge, SlidersHorizontal } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';
import { VEHICLES } from '../../data/vehicles';

export const CAR_LISTING = VEHICLES.map((v) => ({
  id: v.id,
  name: v.name,
  category:
    v.category === 'suv'
      ? 'SUV'
      : v.category === 'sedan'
      ? 'Sedan'
      : v.category === 'luxury'
      ? 'Luxury'
      : 'Hatchback',
  seats: v.specs?.seats || 5,
  fuel: v.specs?.fuelType || 'Petrol',
  transmission: v.specs?.transmission || 'Manual / AMT',
  pricePerDay: v.pricePerDay,
  priceDisplay: v.priceDisplay,
  popularity: v.isAvailable ? 100 : 70,
  isLuxury: v.category === 'luxury',
  image: v.image,
  badge: v.badge || (v.isAvailable ? 'Available Now' : v.type),
  isAvailable: v.isAvailable,
  availableCount: v.availableCount ?? (v.isAvailable ? 1 : 0),
  availabilityStatus: v.availabilityStatus || (v.isAvailable ? 'Available' : 'Currently Not Available'),
  color: v.color || v.specs?.color || 'Standard',
  year: v.year,
}));

export const CarRideGrid = ({ onOpenQuickBook, onOpenSpecs }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Available Now', 'Hatchback', 'SUV', 'Sedan', 'Luxury'];

  const filteredAndSortedCars = useMemo(() => {
    let result = [...CAR_LISTING];
    if (activeCategory === 'Available Now') {
      result = result.filter((c) => c.isAvailable);
    } else if (activeCategory !== 'All') {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else {
      // Prioritize active available cars first, then popularity
      result.sort((a, b) => {
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return b.popularity - a.popularity;
      });
    }
    return result;
  }, [activeCategory, sortBy]);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.35)]'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat === 'Available Now' ? '🟢 Available Now' : cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl focus:outline-none border border-slate-200 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedCars.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white border shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden ${
                  vehicle.isAvailable
                    ? 'border-slate-200/90 hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Clean Badge on Image */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white shadow-sm">
                      {vehicle.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-xl font-black text-white drop-shadow-md">
                      {vehicle.priceDisplay}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 ml-1">
                      / day
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {vehicle.category} • {vehicle.year}
                      </span>
                      {vehicle.color && (
                        <span className="text-[10px] font-semibold text-slate-500">
                          {vehicle.color}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-950 mt-1 group-hover:text-blue-600 transition-colors">
                      {vehicle.name}
                    </h3>
                  </div>

                  {/* Specs Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-600 text-[11px] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{vehicle.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{vehicle.transmission}</span>
                    </div>
                  </div>

                  {/* Action Buttons: View Details + WhatsApp + Book Now (Faded if not available) */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="flex-1 py-3 px-2 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all cursor-pointer text-center bg-slate-50 hover:bg-white"
                    >
                      View Details
                    </Link>

                    <WhatsAppButton
                      message={getVehicleWhatsAppMessage(vehicle)}
                      variant="icon-only"
                      size="md"
                    />

                    {vehicle.isAvailable ? (
                      <button
                        type="button"
                        onClick={() => onOpenQuickBook?.({ vehicle, type: 'car' })}
                        className="flex-1 py-3 px-2 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer text-center"
                      >
                        Book Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-3 px-2 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
                        title="Vehicle is currently not available for booking"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
