import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const RentBikeCalculator = () => {
  const [dailyPrice, setDailyPrice] = useState(850);
  const [daysPerMonth, setDaysPerMonth] = useState(18);
  const hostRevenueShare = 0.8; // 80% to host
  const estimatedMonthlyEarnings = Math.round(dailyPrice * daysPerMonth * hostRevenueShare);

  return (
    <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl space-y-6">
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
          HOST EARNINGS CALCULATOR
        </span>
        <h3 className="text-2xl sm:text-3xl font-black">
          Calculate Your Earnings
        </h3>
        <p className="text-xs text-slate-400">
          Estimate how much your scooter or motorcycle can earn per month.
        </p>
      </div>

      {/* Slider 1: Daily Rental Price */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-300">Daily Rental Price</span>
          <span className="text-blue-400 font-mono text-base">₹{dailyPrice} / day</span>
        </div>
        <input
          type="range"
          min="400"
          max="3500"
          step="50"
          value={dailyPrice}
          onChange={(e) => setDailyPrice(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>₹400 (Scooter)</span>
          <span>₹1,200 (Cruiser)</span>
          <span>₹3,500+ (Superbike)</span>
        </div>
      </div>

      {/* Slider 2: Rental Days per month */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-300">Expected Rental Days</span>
          <span className="text-blue-400 font-mono text-base">{daysPerMonth} Days / Mo</span>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={daysPerMonth}
          onChange={(e) => setDaysPerMonth(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>5 Days (Part-time)</span>
          <span>18 Days (Recommended)</span>
          <span>30 Days (Full-time)</span>
        </div>
      </div>

      {/* Monthly Earnings Highlight Box */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 text-center">
        <span className="text-xs uppercase font-bold text-slate-400">
          Estimated Monthly Payout
        </span>
        <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 font-mono">
          ₹{estimatedMonthlyEarnings.toLocaleString()}
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold block">
          ✓ 80% Net Host Share (20% covers platform & concierge insurance)
        </span>
      </div>

      {/* Perks Pill */}
      <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-300 font-medium">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Free doorstep GPS installation</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Guaranteed weekly bank payouts</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Zero-cost maintenance discount vouchers</span>
        </div>
      </div>
    </div>
  );
};
