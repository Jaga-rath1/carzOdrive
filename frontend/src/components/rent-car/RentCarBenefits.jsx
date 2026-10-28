import React from 'react';
import { ShieldCheck, Navigation, KeyRound, DollarSign } from 'lucide-react';
import { Container } from '../common/Container';

export const RentCarBenefits = () => {
  const benefits = [
    {
      title: '100% Comprehensive Insurance',
      desc: 'Zero-damage liability policy protecting your car with full commercial coverage on every trip.',
      icon: ShieldCheck,
    },
    {
      title: 'Real-Time GPS Security',
      desc: 'Complimentary high-precision GPS device with remote geofencing and 24/7 security monitoring.',
      icon: Navigation,
    },
    {
      title: 'Strict Renter Vetting',
      desc: 'Every renter undergoes Aadhaar, DL, and identity verification before booking confirmation.',
      icon: KeyRound,
    },
    {
      title: 'Guaranteed Weekly Payouts',
      desc: 'Transparent revenue dashboard with automatic direct bank deposits every Monday.',
      icon: DollarSign,
    },
  ];

  return (
    <section className="py-16 bg-slate-50/80 border-t border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Why Host With CARZODRIVE
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            We provide complete security, verified renters, and zero hassles for car owners.
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
