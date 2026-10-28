import React from 'react';
import { ShieldCheck, Navigation, KeyRound, DollarSign } from 'lucide-react';
import { Container } from '../common/Container';

export const RentBikeBenefits = () => {
  const benefits = [
    {
      title: '100% Comprehensive Insurance',
      desc: 'Every ride is protected under our commercial policy covering third-party liability and vehicle damages.',
      icon: ShieldCheck,
    },
    {
      title: 'Real-Time GPS Security',
      desc: 'Complimentary high-precision GPS device with live geofencing and remote ignition-cut safety.',
      icon: Navigation,
    },
    {
      title: 'Strict Rider Screening',
      desc: 'Only background-verified riders with valid driving licenses and government IDs are permitted to book.',
      icon: KeyRound,
    },
    {
      title: 'Weekly Payouts',
      desc: 'Direct bank transfer every Monday for the previous week’s completed bookings with transparent reporting.',
      icon: DollarSign,
    },
  ];

  return (
    <section className="py-16 bg-slate-50/80 border-t border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Why Host Your Bike on CARZODRIVE
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            We provide end-to-end protection, verified riders, and zero-headache earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-blue-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-slate-950">{b.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
