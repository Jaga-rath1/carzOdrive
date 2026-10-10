import React from 'react';
import { Plane, Navigation, Building2, Compass, PartyPopper, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

export const SERVICE_TYPES = [
  {
    id: 'airport-transfer',
    title: 'Airport Transfer',
    desc: 'Timely terminal drop-off & flight pickup with luggage assistance.',
    rate: 'From ₹499',
    icon: Plane,
  },
  {
    id: 'city-travel',
    title: 'City Travel',
    desc: 'Daily city commutes, shopping runs, and inter-city multi-stop errands.',
    rate: 'From ₹799 / 4 hrs',
    icon: Navigation,
  },
  {
    id: 'corporate-travel',
    title: 'Corporate Travel',
    desc: 'Polished protocol-trained chauffeurs for executive summits and VIP delegations.',
    rate: 'From ₹1,299 / day',
    icon: Building2,
  },
  {
    id: 'outstation',
    title: 'Outstation Travel',
    desc: 'Long-distance highway experts experienced in mountain & night driving.',
    rate: 'From ₹1,499 / day',
    icon: Compass,
  },
  {
    id: 'event-driver',
    title: 'Event Driver',
    desc: 'Weddings, VIP galas, late-night party returns, and luxury event escort.',
    rate: 'From ₹899 / shift',
    icon: PartyPopper,
  },
];

export const DriverOnlyServices = ({ selectedService, onSelectService }) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Chauffeur Service Categories
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Select a tailored driving service according to your trip needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SERVICE_TYPES.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={`p-6 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-[0_8px_30px_rgba(37,99,235,0.18)] ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/90 hover:border-blue-400 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-950">{service.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-600">
                  <span>{service.rate}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
