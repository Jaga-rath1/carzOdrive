import React from 'react';
import { ShieldCheck, Award, Briefcase, Clock } from 'lucide-react';
import { CHAUFFEUR_PERKS } from '../../data/drivers';

const iconMap = {
  ShieldCheck,
  Award,
  Briefcase,
  Clock,
};

export const ChauffeurPerks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {CHAUFFEUR_PERKS.map((perk, idx) => {
        const Icon = iconMap[perk.icon] || ShieldCheck;
        return (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-blue-500/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-950 mb-2">
              {perk.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {perk.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
