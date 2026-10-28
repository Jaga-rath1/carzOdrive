import React from 'react';
import { Container } from '../common/Container';

export const BikeRideHowItWorks = () => {
  const howItWorks = [
    {
      step: '01',
      title: 'Choose Bike',
      desc: 'Browse our collection of scooters, cruisers, sports bikes, and superbikes.',
    },
    {
      step: '02',
      title: 'Submit Documents',
      desc: 'Upload a clear photo of your valid Driving License and Govt ID.',
    },
    {
      step: '03',
      title: 'Confirm Booking',
      desc: 'Pay a small advance online and lock in your vehicle instantly.',
    },
    {
      step: '04',
      title: 'Pick Up & Ride',
      desc: 'Collect with complimentary sanitized helmets and hit the road.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            How Self Ride Works
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            4 simple steps to unlock your two-wheeled adventure in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {howItWorks.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 relative overflow-hidden"
            >
              <span className="text-xs font-black font-mono text-blue-600 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
                {item.step}
              </span>
              <h4 className="text-lg font-black text-slate-950">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
