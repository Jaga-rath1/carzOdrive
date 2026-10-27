import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Container } from '../common/Container';
import { packagesAPI } from '../../services/api';
import { TourPackageCard } from './TourPackageCard';
import { TourQuickModal } from './TourQuickModal';

export const ToursGrid = ({ onOpenQuickBook }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeModalTour, setActiveModalTour] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    packagesAPI
      .getAll()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const mapped = res.data.map((p) => {
            const days = p.duration?.days || 2;
            const nights = p.duration?.nights || (days > 1 ? days - 1 : 0);
            const durationStr = typeof p.duration === 'object'
              ? `${days} Days / ${nights} Nights`
              : (p.duration || '2 Days / 1 Night');

            const adultPrice = p.pricing?.adultPrice || p.priceNumeric || 4999;

            return {
              id: p.slug || p._id || p.id,
              rawId: p._id,
              packageId: p._id,
              slug: p.slug,
              title: p.name || p.title,
              name: p.name || p.title,
              destination: p.destination,
              duration: durationStr,
              startingPrice: `₹${adultPrice.toLocaleString('en-IN')}`,
              priceNumeric: adultPrice,
              category: p.odishaTheme || p.category || 'Spiritual & Temples',
              odishaTheme: p.odishaTheme || p.category || 'Spiritual & Temples',
              badge: p.badge || 'Odisha Special',
              featuredVehicle: p.featuredVehicle || 'Toyota Innova Crysta / Luxury SUV',
              image:
                (p.images && p.images[0]) ||
                p.image ||
                'https://images.unsplash.com/photo-1596405835955-4532a4e21245?q=80&w=1200&auto=format&fit=crop',
              highlights: p.highlights?.length
                ? p.highlights
                : ['Dedicated AC Executive Vehicle', 'Driver in Formal Livery', 'Monument Entry Passes Included'],
              inclusions: p.inclusions?.length
                ? p.inclusions
                : ['Luxury AC Vehicle', 'Driver Allowance & Fuel', 'Hotel Accommodation & Breakfast'],
              itinerary: p.itinerary?.length ? p.itinerary : [],
              rawPackage: p,
            };
          });
          setTourPackages(mapped);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load tour packages from DB:', err);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filters = [
    'All',
    'Spiritual & Temples',
    'Coastal & Beaches',
    'Wildlife & Nature',
    'Heritage & Culture',
    'Eco & Hill Stations',
    'Adventure',
    'Weekend Getaways',
  ];

  const filteredPackages = useMemo(() => {
    if (activeFilter === 'All') return tourPackages;
    const filterLower = activeFilter.toLowerCase();
    return tourPackages.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      const theme = (p.odishaTheme || '').toLowerCase();
      return (
        cat === filterLower ||
        theme === filterLower ||
        cat.includes(filterLower) ||
        theme.includes(filterLower)
      );
    });
  }, [activeFilter, tourPackages]);

  return (
    <>
      {/* FILTER BAR */}
      <section className="py-8 bg-slate-50 border-b border-slate-200/80">
        <Container>
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.35)]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* PACKAGE LISTING GRID */}
      <section className="py-16 sm:py-24">
        <Container>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-slate-500">Loading tour packages from database...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8">
              <p className="text-slate-600 font-bold text-sm">No tour packages found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPackages.map((tour) => (
                  <TourPackageCard
                    key={tour.id}
                    tour={tour}
                    onOpenQuickBook={onOpenQuickBook}
                    onQuickLook={(t) => setActiveModalTour(t)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </Container>
      </section>

      {/* COMPONENT-BASED TOUR QUICK LOOK MODAL */}
      <TourQuickModal
        tour={activeModalTour}
        isOpen={Boolean(activeModalTour)}
        onClose={() => setActiveModalTour(null)}
        onOpenQuickBook={onOpenQuickBook}
      />
    </>
  );
};
