import React from 'react';
import { DollarSign, ShieldCheck, Award } from 'lucide-react';
import { Container } from '../common/Container';

export const DriverRegStats = () => {
  return (
    <section className="relative -mt-10 sm:-mt-14 z-20 mb-16">
      <Container>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">₹35,000 - ₹65,000</div>
              <div className="text-xs font-bold text-slate-500">Average Monthly Earning + Tips</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">₹10 Lakh Cover</div>
              <div className="text-xs font-bold text-slate-500">Accidental & Health Insurance</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">VIP Protocol Cert</div>
              <div className="text-xs font-bold text-slate-500">Defensive & Hospitality Training</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
