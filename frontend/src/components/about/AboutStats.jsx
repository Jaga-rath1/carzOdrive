import React from 'react';
import { Users, Car, Award, Compass } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutStats = () => {
  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Users },
    { value: '500+', label: 'Vehicles', icon: Car },
    { value: '100+', label: 'Professional Drivers', icon: Award },
    { value: '25+', label: 'Travel Experiences', icon: Compass },
  ];

  return (
    <section className="relative -mt-10 sm:-mt-14 z-20 mb-20">
      <Container>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 sm:p-4 space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-500">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
