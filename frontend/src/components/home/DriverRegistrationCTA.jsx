import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight, ShieldCheck, CheckCircle2, Award, Clock } from 'lucide-react';
import { Container } from '../common/Container';

export const DriverRegistrationCTA = () => {
  return (
    <section className="py-10 sm:py-14 bg-white relative">
      <Container>
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#1d4ed8] to-[#2563eb] text-white p-6 sm:p-10 lg:p-12 border border-white/30 shadow-[0_20px_50px_rgba(37,99,235,0.25)]">
          {/* Subtle Ambient Lighting Aura */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Visual of Professional Driver / Car */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-white/30 shadow-2xl bg-[#1e3a8a]">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop"
                  alt="Professional CARZODRIVE Driver with executive vehicle"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/30 to-transparent" />

                {/* Floating Driver Trust Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/35 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Verified Driver Network
                      </span>
                      <span className="text-sm font-black text-white">
                        ₹38,000+ Avg Earnings / Mo
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                    Hiring Now
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-black tracking-widest uppercase">
                <UserPlus className="w-3.5 h-3.5" />
                <span>DRIVER PARTNERSHIP</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Drive With CARZODRIVE
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Join our professional driver network and turn your driving skills into opportunity. Drive premium executive vehicles, serve corporate leaders and verified tourists, and enjoy punctual weekly payouts.
              </p>

              {/* Driver Benefits Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Guaranteed Weekly Bank Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Flexible Shifts (Full/Part Time)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Executive & Corporate VIP Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Comprehensive On-Duty Insurance</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  to="/driver-registration"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.65)] border border-blue-400/30 transition-all duration-200 active:scale-95 group"
                >
                  <UserPlus className="w-4 h-4 text-blue-200" />
                  <span>Register as a Driver</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
