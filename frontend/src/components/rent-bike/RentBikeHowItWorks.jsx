import React from 'react';
import { Bike, FileCheck, Calendar, Wallet } from 'lucide-react';
import { Container } from '../common/Container';

export const RentBikeHowItWorks = () => {
  const howItWorks = [
    {
      step: '01',
      title: 'Register Your Bike',
      desc: 'Fill out your bike details, registration number, and upload clear front/side photos.',
      icon: Bike,
    },
    {
      step: '02',
      title: 'Bike Verification',
      desc: 'Our fleet team conducts a quick 20-minute inspection and installs a secure GPS tracker.',
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'Set Availability',
      desc: 'Choose days your bike is available for rent. Keep it whenever you need it for personal rides.',
      icon: Calendar,
    },
    {
      step: '04',
      title: 'Start Earning',
      desc: 'Earn recurring income with guaranteed weekly bank transfers and complete zero-damage insurance.',
      icon: Wallet,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            How Bike Hosting Works
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Start monetizing your idle two-wheeler in 4 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
