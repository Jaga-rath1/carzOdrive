import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBadge = ({
  icon: Icon,
  title,
  subtitle,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-card ${className}`}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          {title}
        </div>
        <div className="text-sm font-bold text-slate-950">
          {subtitle}
        </div>
      </div>
    </motion.div>
  );
};
