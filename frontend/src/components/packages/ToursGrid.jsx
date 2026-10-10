import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  X,
  Calendar,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getTourWhatsAppMessage } from '../../utils/whatsapp';

export const ALL_TOUR_PACKAGES = [
  {
    id: 'tour-1',
    title: 'Bhubaneswar Heritage Escape',
    destination: 'Bhubaneswar & Dhauli Stupa',
    duration: '2 Days / 1 Night',
    startingPrice: '₹5,499',
    category: 'Weekend',
    image: 'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop',
    highlights: [
      '1,000-year-old Lingaraj temple & Mukteshwar architectural tour',
      'Khandagiri & Udayagiri ancient Jain rock-cut cave walk',
      'Authentic regional Odia thali lunch at heritage estate',
      'Dedicated AC executive vehicle & verified route driver',
    ],
    inclusions: ['Luxury AC Sedan', 'Driver Allowance & Fuel', 'Hotel Breakfast', 'Monument Entry Passes'],
    itinerary: [
      { day: 'Day 1', title: 'Ancient Temples & Cave Exploration', desc: 'Pickup from hotel/airport. Guided walkthrough of Lingaraj and rock-cut caves. Sunset at Dhauli Peace Pagoda.' },
      { day: 'Day 2', title: 'Artisan Villages & Heritage Farewell', desc: 'Morning visit to Pipili appliqué crafts village. Traditional lunch and evening return transfer.' },
    ],
  },
  {
    id: 'tour-2',
    title: 'Puri Beach & Sun Temple Circuit',
    destination: 'Puri, Marine Drive & Konark',
    duration: '3 Days / 2 Nights',
    startingPrice: '₹8,999',
    category: 'Couples',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    highlights: [
      'Scenic sunset cruise along the legendary Marine Drive Boulevard',
      'VIP morning darshan assistance at Jagannath Temple',
      'UNESCO Sun Temple Konark architectural marvel walk',
      'Golden Beach private cabana sunset session',
    ],
    inclusions: ['Executive SUV (Creta/Innova)', 'Sea-facing Resort Stay', 'All Tolls & Fuel', 'Daily Breakfast'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Seaside Relaxation', desc: 'Scenic highway cruise to Puri. Check-in to oceanfront resort. Evening stroll along Golden Beach.' },
      { day: 'Day 2', title: 'Marine Drive & Konark Sun Temple', desc: 'Sunrise coastal drive. Guided tour of the world-famous stone chariot temple. Seafood dinner by the beach.' },
      { day: 'Day 3', title: 'Temple Blessing & Scenic Return', desc: 'Morning temple visit followed by artisanal souvenir shopping and airport return.' },
    ],
  },
  {
    id: 'tour-3',
    title: 'Odisha Coastal & Chilika Lagoon Safari',
    destination: 'Chilika, Gopalpur & Mangalajodi',
    duration: '4 Days / 3 Nights',
    startingPrice: '₹14,499',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
    highlights: [
      'Private catamaran cruise to spot rare Irrawaddy dolphins',
      'Mangalajodi birdwatcher sanctuary wooden boat expedition',
      'Tranquil coastal resort stay in historic Gopalpur-on-Sea',
      'Fresh lakeside prawn & crab tasting sessions',
    ],
    inclusions: ['Full-size 7-Seater Fortuner/Innova', 'Private Boat Safaris', '3-Night 4-Star Resort', 'Full Fuel & Driver Allowance'],
    itinerary: [
      { day: 'Day 1', title: 'Drive to Asia’s Largest Brackish Lagoon', desc: 'Scenic southern cruise to Chilika. Boat ride to Kalijai Island temple.' },
      { day: 'Day 2', title: 'Dolphin Spotting & Sea Mouth Island', desc: 'Morning dolphin watch cruise. Picnic on virgin island sands. Evening transfer to Gopalpur.' },
      { day: 'Day 3', title: 'Old Lighthouse & Bay of Bengal Sunset', desc: 'Colonial port exploration, tranquil sand dunes, and beach bonfire.' },
      { day: 'Day 4', title: 'Birdwatcher Haven & Return Cruise', desc: 'Early morning migratory bird canoe safari before comfortable city return.' },
    ],
  },
  {
    id: 'tour-4',
    title: 'Western Hills & Waterfalls Adventure',
    destination: 'Simlipal & Barehipani Falls',
    duration: '3 Days / 2 Nights',
    startingPrice: '₹11,999',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    highlights: [
      'Deep 4x4 forest trail across Simlipal Tiger Reserve',
      'Trek to towering two-tiered Barehipani & Joranda waterfalls',
      'Eco-cottage glamping surrounded by sal forest canopy',
      'Stargazing and tribal bonfire night',
    ],
    inclusions: ['4x4 AWD Vehicle & Expert Guide', 'Forest Safari Permits', 'Eco-Resort Cottage', 'All Meals Included'],
    itinerary: [
      { day: 'Day 1', title: 'Ascent to the Wilderness', desc: 'Early morning mountain drive into Simlipal National Park. Forest briefing and check-in to eco-cabins.' },
      { day: 'Day 2', title: 'Giant Waterfalls & Safari Trails', desc: 'Full-day safari encountering wild elephants, spotted deer, and breathtaking waterfall gorges.' },
      { day: 'Day 3', title: 'Morning Bird Calls & Descent', desc: 'Canopy walk, botanical garden tour, and scenic return drive.' },
    ],
  },
  {
    id: 'tour-5',
    title: 'The Royal Sovereign VIP Road Expedition',
    destination: 'Dhenkanal Palace & Eco Retreat',
    duration: '2 Days / 1 Night',
    startingPrice: '₹16,999',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    highlights: [
      'Mercedes-Maybach or BMW 7 Series chauffeured convoy',
      'Exclusive royal palace royal suite accommodations',
      'Private sit-down royal dining with royal family history curator',
      'High-speed brass bell artisan craft village tour',
    ],
    inclusions: ['Top-Tier Mercedes/BMW Vehicle', 'Royal Heritage Suite', '5-Course Gourmet Meals', 'Chauffeur in Formal Livery'],
    itinerary: [
      { day: 'Day 1', title: 'Royal Welcome & Palace Stay', desc: 'Chauffeured arrival with welcome ceremony. Private tour of royal weapons and antique collections. Royal dinner.' },
      { day: 'Day 2', title: 'Artisan Heritage & Return Cruise', desc: 'Dokra metal craft village walkthrough. Champagne luncheon before sunset executive return.' },
    ],
  },
  {
    id: 'tour-6',
    title: 'Grand Coastal Friends Group Caravan',
    destination: 'Puri, Chilika & Konark',
    duration: '4 Days / 3 Nights',
    startingPrice: '₹22,999',
    category: 'Group',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
    highlights: [
      'Twin Toyota Fortuner caravan convoy for up to 12 guests',
      'Beach volleyball, jet-ski rentals, and seafood barbecue night',
      'Scenic drone videography & group memory album included',
      '24/7 dedicated support vehicle and guide',
    ],
    inclusions: ['Two 7-Seater Luxury SUVs', 'Beachfront Villa Booking', 'Watersports Passes', 'Drone Video Shoot'],
    itinerary: [
      { day: 'Day 1', title: 'Caravan Launch to Ocean Shores', desc: 'Convoy orientation, drive to private beach villa, sunset pool party.' },
      { day: 'Day 2', title: 'Marine Drive Rally & Watersports', desc: 'Group coastal drive, jet ski and banana boat rides, beach barbecue.' },
      { day: 'Day 3', title: 'Chilika Island Expedition', desc: 'Private catamaran charter, dolphin spotting, sunset island music.' },
      { day: 'Day 4', title: 'Temple Visit & Victory Return', desc: 'Morning Konark exploration and memorable group road trip back.' },
    ],
  },
];

export const ToursGrid = ({ onOpenQuickBook }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeModalTour, setActiveModalTour] = useState(null);

  const filters = ['All', 'Weekend', 'Family', 'Adventure', 'Luxury', 'Couples', 'Group'];

  const filteredPackages = useMemo(() => {
    if (activeFilter === 'All') return ALL_TOUR_PACKAGES;
    return ALL_TOUR_PACKAGES.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

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
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${activeFilter === f
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((tour) => (
                <motion.div
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  {/* Large Image Header */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white">
                        {tour.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{tour.duration}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-300 block leading-tight">Starting From</span>
                      <span className="text-xl font-black text-white drop-shadow-md">
                        {tour.startingPrice}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{tour.destination}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h3>

                      {/* Highlights Bullet List */}
                      <ul className="space-y-1.5 pt-1">
                        {tour.highlights.slice(0, 3).map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* View Details / Package + WhatsApp CTA Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/tour/${tour.id}`}
                        className="flex-1 py-3 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      <WhatsAppButton
                        message={getTourWhatsAppMessage(tour)}
                        variant="icon-only"
                        size="md"
                      />

                      <button
                        type="button"
                        onClick={() => setActiveModalTour(tour)}
                        className="py-3 px-3 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all cursor-pointer bg-slate-50 hover:bg-white"
                        title="Quick Itinerary Modal"
                      >
                        Quick Look
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* PACKAGE DETAIL MODAL STRUCTURE */}
      <AnimatePresence>
        {activeModalTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalTour(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10 border border-slate-200 overflow-hidden text-slate-900"
            >
              {/* Header Image */}
              <div className="relative h-64 sm:h-72 w-full">
                <img
                  src={activeModalTour.image}
                  alt={activeModalTour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <button
                  type="button"
                  onClick={() => setActiveModalTour(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors border border-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                    {activeModalTour.duration} • {activeModalTour.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">{activeModalTour.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeModalTour.destination}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Price & Inclusions */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-blue-700 font-bold block uppercase tracking-wider">
                      All-Inclusive Package Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      {activeModalTour.startingPrice}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">per couple / vehicle</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <WhatsAppButton
                      message={getTourWhatsAppMessage(activeModalTour)}
                      label="Chat WhatsApp"
                      size="md"
                      variant="solid"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const t = activeModalTour;
                        setActiveModalTour(null);
                        onOpenQuickBook?.({
                          serviceType: 'tour-package',
                          name: t.title,
                          location: t.destination,
                        });
                      }}
                      className="py-3 px-5 rounded-xl font-black text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Reserve Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/tour/${activeModalTour.id}`}
                      className="py-3 px-4 rounded-xl font-bold text-xs text-blue-700 bg-blue-100/70 hover:bg-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Full Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Day by Day Itinerary */}
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Detailed Day-by-Day Itinerary</span>
                  </h4>
                  <div className="space-y-3">
                    {activeModalTour.itinerary.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-xs font-black font-mono text-blue-600 uppercase">
                          {step.day} • {step.title}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions List */}
                <div className="space-y-3">
                  <h4 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>What’s Included</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    {activeModalTour.inclusions.map((inc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
