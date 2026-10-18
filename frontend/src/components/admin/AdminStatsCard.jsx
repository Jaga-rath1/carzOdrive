import React from 'react';
import { motion } from 'framer-motion';

export const AdminStatsCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md p-5 overflow-hidden transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-zinc-500 font-medium">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-zinc-100 text-black border border-zinc-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-black font-black bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
            {trend.value}
          </span>
          <span className="text-zinc-500 font-medium">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};
