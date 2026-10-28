import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, KeyRound, ReceiptText, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';

export const WHY_CHOOSE_ITEMS = [
  {
    num: '01',
    title: 'Verified Vehicles',
    tagline: '150-Point Diagnostic Check',
    desc: 'Every car and superbike passes a meticulous 150-point mechanical inspection. Showroom detailed, sanitized, and delivered in pristine running condition.',
    icon: ShieldCheck,
  },
  {
    num: '02',
    title: 'Trusted Drivers',
    tagline: 'Background-Checked Drivers',
    desc: 'Government verified drivers trained in executive etiquette and defensive highway navigation with flawless zero-incident safety records.',
    icon: UserCheck,
  },
  {
    num: '03',
    title: 'Flexible Booking',
    tagline: 'Instant Keyless Mobility',
    desc: 'Keyless vehicle access on your phone, zero-security-deposit privileges, flexible hourly to monthly plans, and on-demand doorstep delivery.',
    icon: KeyRound,
  },
  {
    num: '04',
    title: 'Transparent Pricing',
    tagline: 'Zero Hidden Charges Ever',
    desc: 'Honest all-inclusive pricing with GST and comprehensive zero-dep insurance included upfront. Transparent fuel policy with instant security settlement.',
    icon: ReceiptText,
  },
];

export const WhyChooseSection = () => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] text-slate-900 relative overflow-hidden border-y border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[480px] h-[480px] bg-sky-100/50 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber ambient mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, rgba(2, 132, 199, 0.8) 1.5px, transparent 1.5px), linear-gradient(to right, rgba(2, 132, 199, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        }}
      />

      <Container className="relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>THE CARZODRIVE STANDARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 drop-shadow-xs">
            More Than Just a Rental
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            A concierge mobility standard engineered around safety, transparency, and effortless road freedom.
          </p>
        </div>

        {/* Visually Rich 4 Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-white hover:bg-white border border-slate-200/90 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.14)]"
              >
                {/* Large Background Typography Number */}
                <div className="absolute -top-4 -right-2 text-7xl sm:text-8xl font-black text-slate-100 group-hover:text-blue-50/80 transition-colors pointer-events-none select-none font-mono">
                  {item.num}
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Top Header: Number Pill & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-blue-700 font-mono px-3 py-1 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
                      {item.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle Bottom Glow Accent */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Guaranteed Standards</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
