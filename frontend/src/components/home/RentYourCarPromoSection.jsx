import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, DollarSign, Sparkles, KeyRound, Bike } from 'lucide-react';
import { Container } from '../common/Container';

export const RentYourCarPromoSection = () => {
  return (
    <section className="py-10 sm:py-14 bg-white relative">
      <Container>
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#020617] via-[#09153a] to-[#040c24] text-white p-6 sm:p-10 lg:p-12 border border-blue-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
          {/* Subtle Ambient Lighting Aura */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-black tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOST FLEET PARTNER</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Your Vehicle Can Earn <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
                  While You Sleep.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                List your car or bike with CARZODRIVE and turn your idle vehicle into recurring income. Enjoy comprehensive insurance coverage, verified renters, and guaranteed weekly/monthly payouts.
              </p>

              {/* Earnings Stat Pills */}
              <div className="flex flex-wrap items-center gap-4 py-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-slate-400 font-bold block">Avg Monthly Earning</span>
                  <span className="text-xl sm:text-2xl font-black text-white">₹35,000 - ₹75,000</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-slate-400 font-bold block">Zero Damage Liability</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-400">100% Insured</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/rent-your-car"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.65)] border border-blue-400/30 transition-all duration-200 active:scale-95 group"
                >
                  <KeyRound className="w-4 h-4 text-blue-200" />
                  <span>Rent Your Car</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/rent-your-bike"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200 active:scale-95"
                >
                  <Bike className="w-4 h-4 text-blue-400" />
                  <span>Rent Your Bike</span>
                </Link>
              </div>

              {/* Secondary Text */}
              <div className="pt-2 text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-2">
                <span>Easy onboarding</span>
                <span className="text-blue-500">•</span>
                <span>Verified renters</span>
                <span className="text-blue-500">•</span>
                <span>Secure process</span>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"
                  alt="Luxury vehicle earning passive income"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Floating Earnings Pill Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/15 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Monthly Direct Deposit
                      </span>
                      <span className="text-sm font-black text-white">
                        ₹52,400 Transferred
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                    Active Host
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
