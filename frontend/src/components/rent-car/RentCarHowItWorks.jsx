import React from 'react';
import { Car, FileCheck, Calendar, Wallet } from 'lucide-react';
import { Container } from '../common/Container';

export const RentCarHowItWorks = () => {
  const howItWorks = [
    {
      step: '01',
      title: 'Register Your Vehicle',
      desc: 'Fill out basic car details, registration number, and upload clear exterior/interior photos.',
      icon: Car,
    },
    {
      step: '02',
      title: 'Vehicle Verification',
      desc: 'Our team conducts a quick 30-minute doorstep mechanical audit and installs our secure GPS device.',
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'Set Availability',
      desc: 'Choose the days you want your car to be rented. Keep it whenever you need personal use.',
      icon: Calendar,
    },
    {
      step: '04',
      title: 'Start Earning',
      desc: 'Earn recurring passive income with guaranteed weekly direct bank deposits and 100% insurance.',
      icon: Wallet,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            How Host Partnerships Work
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Start generating recurring revenue in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {howItWorks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-blue-600">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
