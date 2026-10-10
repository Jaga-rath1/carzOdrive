import React from 'react';
import { Star, Check, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatRating } from '../../utils/formatters';

export const DriverCard = ({ driver, onHireDriver }) => {
  return (
    <Card variant="glass" className="group flex flex-col h-full bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Driver Header with Photo & Badge */}
      <div className="p-6 pb-4 flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
          <img
            src={driver.photo}
            alt={driver.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" title="Verified Available" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <Badge variant="blue" size="sm" dot>
              {driver.badge}
            </Badge>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{formatRating(driver.rating)}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-950 mt-1 group-hover:text-blue-600 transition-colors">
            {driver.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 font-medium">
            {driver.title}
          </p>
          <div className="text-[11px] text-blue-600 font-bold mt-1">
            {driver.experienceYears} Years Experience • {driver.tripsCount}+ VIP Trips
          </div>
        </div>
      </div>

      {/* Bio & Specialties */}
      <div className="px-6 py-2 flex-1 space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          "{driver.bio}"
        </p>

        {/* Languages */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Spoken Languages
          </div>
          <div className="flex flex-wrap gap-1.5">
            {driver.languages.map((lang, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications Highlight */}
        <div className="space-y-1 pt-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Key Certifications
          </div>
          <div className="space-y-1">
            {driver.certifications.slice(0, 2).map((cert, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Booking */}
      <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-950">
              {formatCurrency(driver.dailyRate)}
            </span>
            <span className="text-xs text-slate-500">/day</span>
          </div>
          <div className="text-[11px] text-slate-500">
            or {formatCurrency(driver.hourlyRate)}/hr
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => onHireDriver && onHireDriver(driver)}
        >
          Hire Chauffeur
        </Button>
      </div>
    </Card>
  );
};
