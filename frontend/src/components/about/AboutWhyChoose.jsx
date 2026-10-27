import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutWhyChoose = () => {
  const whyChooseUs = [
    {
      title: '150-Point Audit',
      desc: 'Every vehicle passes strict diagnostic checks, engine tuning, and sanitization before handoff.',
    },
    {
      title: 'Zero Hidden Charges',
      desc: 'Transparent pricing with comprehensive zero-dep insurance and honest fuel policies.',
    },
    {
      title: 'Concierge Support',
      desc: '24/7 roadside assistance, luxury doorstep handoff, and immediate replacement guarantees.',
    },
    {
      title: 'Verified Professionals',
      desc: 'Background-checked drivers trained in executive etiquette and defensive driving.',
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why CARZODRIVE
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            We stand apart through obsessive attention to vehicle quality and customer delight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition-all space-y-2"
            >
              <CheckCircle2 className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="text-base font-black text-slate-950">{item.title}</h4>
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
