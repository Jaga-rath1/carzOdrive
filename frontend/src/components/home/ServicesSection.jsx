import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bike, Car, Shield, UserCheck, Compass, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

export const SERVICES_DATA = [
  {
    id: 'bike-rental',
    title: 'Bike Rental',
    description: 'Explore the city on your own terms with premium bikes.',
    ctaText: 'Explore Bikes',
    link: '/bike-rental',
    icon: Bike,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    tag: 'Helmets Included',
  },
  {
    id: 'car-self-ride',
    title: 'Car Self Ride',
    description: 'Premium cars for complete freedom.',
    ctaText: 'Explore Cars',
    link: '/car-self-ride',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    tag: 'Keyless Access',
  },
  {
    id: 'car-with-driver',
    title: 'Car With Driver',
    description: 'Sit back and enjoy the journey.',
    ctaText: 'Book With Driver',
    link: '/car-with-driver',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop',
    tag: 'Executive Chauffeur',
  },
  {
    id: 'driver-only',
    title: 'Driver Only',
    description: 'Professional drivers when you need them.',
    ctaText: 'Find a Driver',
    link: '/driver-only',
    icon: UserCheck,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
    tag: 'Verified & Background-Checked',
  },
  {
    id: 'tours-packages',
    title: 'Tours & Packages',
    description: 'Curated experiences for unforgettable journeys.',
    ctaText: 'Explore Packages',
    link: '/tours-packages',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    tag: 'All-Inclusive Road Trips',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="relative py-20 sm:py-28 bg-slate-50/80 border-y border-slate-200/80 overflow-hidden">
      {/* Background subtle light ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Container>
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase shadow-2xs">
            <span>CARZODRIVE MOBILITY ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Choose Your Way to Move
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            Flexible mobility options designed around your journey.
          </p>
        </div>

        {/* 5 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)] hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Top Image Visual */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Tag Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-blue-300">
                      {service.tag}
                    </span>
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute -bottom-4 right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 pt-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Action */}
                  <Link
                    to={service.link}
                    className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-black text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
