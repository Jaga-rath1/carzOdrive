import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutTimeline = () => {
  const timeline = [
    {
      year: '2022',
      title: 'The Inception',
      desc: 'Founded with a small fleet of 15 premium vehicles to eliminate traditional rental paperwork and counter lines.',
    },
    {
      year: '2023',
      title: 'Chauffeur & Bike Expansion',
      desc: 'Introduced verified corporate drivers and high-performance superbikes with 100% digital keyless unlock.',
    },
    {
      year: '2024',
      title: 'Curated Road Expeditions',
      desc: 'Launched bespoke tour packages across iconic coastal routes and scenic heritage switchbacks.',
    },
    {
      year: '2025',
      title: 'Host Fleet Marketplace',
      desc: 'Enabled luxury car and bike owners to safely monetize idle vehicles with comprehensive insurance and verified drivers.',
    },
    {
      year: '2026',
      title: 'The New Standard of Mobility',
      desc: 'CARZODRIVE operates across premier hubs with over 500 vehicles and an uncompromising standard of service.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#030712] text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-black tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>THE CARZODRIVE TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Our Journey So Far
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            Milestones that shaped our commitment to world-class vehicle rental excellence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-blue-600/30">
          {timeline.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col sm:flex-row items-start ${
                idx % 2 === 0 ? 'sm:flex-row-reverse text-left sm:text-right' : 'text-left'
              }`}
            >
              {/* Year Marker Pin */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-4 border-slate-950 flex items-center justify-center text-[10px] font-black text-white shadow-lg z-20">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Content Box */}
              <div className="ml-12 sm:ml-0 sm:w-1/2 p-4 sm:px-8">
                <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg space-y-1">
                  <span className="text-xs font-black font-mono text-blue-400">{step.year}</span>
                  <h4 className="text-lg font-black text-white">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
