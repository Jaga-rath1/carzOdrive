import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_METRICS } from '../../data/testimonials';

export const HeroStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200/90">
      {TRUST_METRICS.map((metric, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="flex flex-col"
        >
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950">
            {metric.value}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
            {metric.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
