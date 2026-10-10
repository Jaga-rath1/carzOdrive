import React from 'react';
import { Container } from '../common/Container';

export const AboutStory = () => {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="md:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"
                alt="CARZODRIVE Fleet Craftsmanship"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-slate-950 text-white border border-white/10 shadow-xl hidden sm:block">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest block">Founded</span>
              <span className="text-xl font-black">2022</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase">
              <span>OUR STORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Born From a Passion for the Open Road
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              CARZODRIVE was founded with one clear observation: hiring a vehicle was burdened by outdated paperwork, untrustworthy vehicle conditions, and opaque pricing.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We set out to build a modern mobility ecosystem where booking a sports car, an all-terrain SUV, a superbike, or a private chauffeur is as effortless as pressing a button on your phone.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
