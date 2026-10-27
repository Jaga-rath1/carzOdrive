import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Clock, ArrowRight, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';
import { packagesAPI } from '../../services/api';

export const ToursPreviewSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    packagesAPI
      .getAll()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const mapped = res.data.slice(0, 3).map((p) => ({
            id: p.slug || p._id || p.id,
            rawId: p._id,
            title: p.name,
            duration: `${p.duration?.days || 2} Days / ${p.duration?.nights || 1} Nights`,
            startingPrice: `₹${(p.pricing?.adultPrice || 5499).toLocaleString('en-IN')}`,
            description: p.description || 'Experience Odisha with a dedicated driver, luxury accommodation, and private sightseeing.',
            image:
              (p.images && p.images[0]) ||
              'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop',
            location: p.destination || 'Odisha Heritage & Coast',
            badge: p.category || 'Curated Expedition',
          }));
          setTours(mapped);
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

  if (!loading && tours.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50/80 border-y border-slate-200/80 relative overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>CURATED ROAD TRIPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Travel Beyond the Destination
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl">
              Handcrafted all-inclusive travel itineraries pairing benchmark vehicles with five-star stays and private local experiences directly from our database.
            </p>
          </div>

          <Link
            to="/tours-packages"
            className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 group shrink-0"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading tour packages from database...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <p className="text-slate-600 font-bold text-sm">No tour packages available at this moment.</p>
          </div>
        ) : (
          /* Premium Package Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour, index) => {
              const detailUrl = `/tour/${tour.id}`;

              return (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)] hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Large Image Header */}
                  <Link to={detailUrl} className="relative h-60 w-full overflow-hidden bg-slate-900 block">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white">
                        {tour.badge}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{tour.duration}</span>
                    </div>

                    {/* Starting Price */}
                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-300 block leading-tight">Starting From</span>
                      <span className="text-xl font-black text-white drop-shadow-md">
                        {tour.startingPrice}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{tour.location}</span>
                      </div>
                      <Link to={detailUrl}>
                        <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                          {tour.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                        {tour.description}
                      </p>
                    </div>

                    {/* View Details + WhatsApp Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={detailUrl}
                        className="flex-1 py-3 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md flex items-center justify-center gap-2 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      <WhatsAppButton
                        message={getTourWhatsAppMessage(tour)}
                        variant="icon-only"
                        size="md"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Link
            to="/tours-packages"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-blue-600 hover:text-blue-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 shadow-md transition-all active:scale-95"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>View All Packages</span>
          </Link>
        </div>
      </Container>
    </section>
  );
};
