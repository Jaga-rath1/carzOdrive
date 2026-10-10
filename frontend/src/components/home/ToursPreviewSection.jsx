import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Clock, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const TOURS_PREVIEW_DATA = [
  {
    id: 'tour-1',
    title: 'Bhubaneswar Heritage Escape',
    duration: '2 Days / 1 Night',
    startingPrice: '₹5,499',
    description: 'Explore thousand-year-old stone temples, ancient rock-cut caves, and handcrafted artisan heritage in an executive luxury vehicle.',
    image: 'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop',
    location: 'Bhubaneswar & Dhauli',
    badge: 'Heritage Classic',
  },
  {
    id: 'tour-2',
    title: 'Puri Weekend Drive',
    duration: '3 Days / 2 Nights',
    startingPrice: '₹8,999',
    description: 'Cruise along the iconic Puri-Konark Marine Drive highway with golden beach vistas, luxury resort stays, and fresh seafood tasting.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    location: 'Puri & Konark Marine Drive',
    badge: 'Bestseller',
  },
  {
    id: 'tour-3',
    title: 'Odisha Coastal Road Trip',
    duration: '4 Days / 3 Nights',
    startingPrice: '₹14,499',
    description: 'The ultimate expedition across Chilika Lagoon, dolphin sanctuaries, secluded beaches, and coastal switchback roads.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
    location: 'Chilika, Gopalpur & Coastline',
    badge: 'Grand Expedition',
  },
];

export const ToursPreviewSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/80 border-y border-slate-200/80 relative overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>CURATED ROAD TRIPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Travel Beyond the Destination
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl">
              Handcrafted all-inclusive travel itineraries pairing benchmark vehicles with five-star stays and private local experiences.
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

        {/* 3 Premium Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOURS_PREVIEW_DATA.map((tour, index) => {
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
