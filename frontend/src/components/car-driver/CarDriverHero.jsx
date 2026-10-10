import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Container } from '../common/Container';

export const CarDriverHero = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-blue-50/40 to-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXECUTIVE CHAUFFEUR SERVICE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-tight"
        >
          Sit Back. Relax.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
            Enjoy the Journey.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto mt-5 leading-relaxed"
        >
          Impeccably tailored luxury chauffeur transport for corporate executives, wedding arrivals, VIP delegations, and seamless airport transit.
        </motion.p>
      </Container>
    </section>
  );
};
