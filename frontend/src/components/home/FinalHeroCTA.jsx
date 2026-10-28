import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { Container } from '../common/Container';

export const FinalHeroCTA = ({ onOpenQuickBook }) => {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[#1e40af] via-[#2563eb] to-[#1d4ed8] text-white overflow-hidden border-t border-white/20">
      {/* Cinematic Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Pulsing deep blue ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-cyan-300/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[340px] bg-white/20 rounded-full blur-[140px]" />

        {/* Ambient Glowing Road Speedline Curves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          fill="none"
        >
          <path
            d="M-100 500 C 400 550, 700 200, 1540 100"
            stroke="url(#cta-speed-grad)"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
          <path
            d="M-100 580 C 450 620, 800 240, 1540 150"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <defs>
            <linearGradient id="cta-speed-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Cyber grid floor */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,transparent,black)] opacity-60" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>START YOUR NEXT EXPEDITION</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white"
          >
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
              Move?
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 font-normal max-w-xl mx-auto leading-relaxed"
          >
            Your next journey starts with the right ride.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              onClick={onOpenQuickBook}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_30px_rgba(37,99,235,0.5)] hover:shadow-[0_6px_35px_rgba(37,99,235,0.7)] border border-blue-400/30 transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <span>Book Your Ride</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <Link
              to="/tours-packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-blue-400/40 transition-all duration-200 active:scale-95"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Explore Packages</span>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
