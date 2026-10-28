import React from 'react';
import { KeyRound, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Container } from '../common/Container';

export const CarRidePerks = () => {
  const perks = [
    {
      title: 'Keyless Mobile Access',
      desc: 'Unlock your reserved car directly from your smartphone with no counter queues.',
      icon: KeyRound,
    },
    {
      title: 'Zero Deposit Options',
      desc: 'Transparent pricing with comprehensive zero-dep commercial damage insurance included.',
      icon: ShieldCheck,
    },
    {
      title: '45-Min Doorstep Delivery',
      desc: 'Pristine sanitized vehicles delivered directly to your airport terminal, hotel, or home.',
      icon: Clock,
    },
    {
      title: 'Unlimited KMs Available',
      desc: 'Freedom to explore scenic highways with flexible mileage packages and zero penalties.',
      icon: Zap,
    },
  ];

  return (
    <section className="py-12 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
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
