import React from 'react';
import { ShieldCheck, MapPin, Sparkles, Headphones } from 'lucide-react';
import { Container } from '../common/Container';

export const ToursExperience = () => {
  const perks = [
    {
      icon: ShieldCheck,
      title: 'Benchmark Fleet & Safety',
      desc: 'All road packages feature vehicles strictly under 2 years old with multi-point mechanical inspections.',
    },
    {
      icon: MapPin,
      title: 'Locally Curated Routes',
      desc: 'Tested off-beat spots, sunrise vista viewpoints, and premier authentic culinary rest stops.',
    },
    {
      icon: Sparkles,
      title: 'Zero Hidden Costs',
      desc: 'Fuel, highway toll passes, driver allowances, and entry permits are bundled upfront transparently.',
    },
    {
      icon: Headphones,
      title: '24/7 Trip Concierge',
      desc: 'Dedicated on-road coordinator on standby throughout your itinerary to assist with any dynamic route adjustments.',
    },
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/80">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <p.icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-slate-900">{p.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
