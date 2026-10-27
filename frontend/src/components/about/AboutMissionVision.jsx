import React from 'react';
import { Target, Eye } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutMissionVision = () => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/80 border-y border-slate-200/80">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">Our Mission</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              To deliver uncompromising freedom and luxury on the road through verified vehicles, professional drivers, and transparent digital booking for every journey.
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shadow-md">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">Our Vision</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              To become India's benchmark premium mobility and curated travel platform, setting the gold standard in automotive safety, design, and personalized concierge travel.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
