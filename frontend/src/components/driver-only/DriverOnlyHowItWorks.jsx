import React from 'react';
import { CalendarCheck, UserCheck, ShieldCheck, Banknote } from 'lucide-react';
import { Container } from '../common/Container';

export const DriverOnlyHowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: CalendarCheck,
      title: 'Schedule Your Duty',
      desc: 'Pick your duty shift—hourly city commute, airport pickup, outstation trip, or late night return.',
    },
    {
      step: '02',
      icon: UserCheck,
      title: 'Driver Reports to You',
      desc: 'A police-verified, uniform-clad professional driver arrives at your exact doorstep on time.',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: 'Relax in Your Own Car',
      desc: 'Work, sleep, or relax in the comfort of your personal car while our expert handles traffic & parking.',
    },
    {
      step: '04',
      icon: Banknote,
      title: 'Pay Upon Completion',
      desc: 'Zero advance deposits required. Settle the fixed driver allowance directly after duty completion.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            SIMPLE 4-STEP BOOKING
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            How Driver-Only Service Works
          </h2>
          <p className="text-sm text-slate-600">
            No rental car involved. You provide your personal car, we provide the verified professional driver.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-200 font-mono">
                  {s.step}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
