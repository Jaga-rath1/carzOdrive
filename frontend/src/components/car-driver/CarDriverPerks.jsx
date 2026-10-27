import React from 'react';
import { ShieldCheck, Award, Clock, Headphones } from 'lucide-react';
import { Container } from '../common/Container';

export const CarDriverPerks = () => {
  const perks = [
    {
      title: 'Background-Verified Drivers',
      desc: '100% police & identity vetted drivers with minimum 8+ years commercial VIP driving experience.',
      icon: ShieldCheck,
    },
    {
      title: 'VIP Hospitality Trained',
      desc: 'Courteous uniformed drivers trained in executive discretion, route optimization, and luggage care.',
      icon: Award,
    },
    {
      title: 'Punctuality Guaranteed',
      desc: 'Your vehicle arrives 15 minutes before scheduled pickup time with live GPS tracking on your phone.',
      icon: Clock,
    },
    {
      title: '24/7 Dedicated Concierge',
      desc: 'Immediate trip assistance, flight delay monitoring, and customized road itinerary support.',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-12 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-blue-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-950">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
