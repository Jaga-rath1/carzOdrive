import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';

export const DriverStepDriving = ({
  formData,
  availableLanguages,
  onInputChange,
  onToggleLanguage,
  onBack,
  onNext,
}) => {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
          STEP 02 OF 04
        </span>
        <h2 className="text-2xl font-black text-slate-950 mt-1">
          Driving Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share your professional driving experience and vehicle proficiencies.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Driving Experience *
            </label>
            <select
              value={formData.drivingExperience}
              onChange={(e) => onInputChange('drivingExperience', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="3-5 Years">3 - 5 Years</option>
              <option value="5-8 Years">5 - 8 Years (Preferred)</option>
              <option value="8-12 Years">8 - 12 Years (Senior Driver)</option>
              <option value="12+ Years">12+ Years (Master Driver)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Driver License Number *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => onInputChange('licenseNumber', e.target.value)}
                placeholder="OD-02-20180012345"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              License Type *
            </label>
            <select
              value={formData.licenseType}
              onChange={(e) => onInputChange('licenseType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Commercial Transport (HMV / LMV)">Commercial Transport (HMV / LMV)</option>
              <option value="Light Motor Vehicle (LMV-TR)">Light Motor Vehicle (LMV-TR)</option>
              <option value="Heavy Passenger Vehicle (HPV)">Heavy Passenger Vehicle (HPV)</option>
              <option value="Private Non-Transport LMV (5+ Yrs)">Private Non-Transport LMV (5+ Yrs)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Vehicle Type Proficiency *
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => onInputChange('vehicleType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Executive Sedans & Luxury SUVs">Executive Sedans & Luxury SUVs</option>
              <option value="Premium Sedans (BMW / Mercedes / Audi)">Ultra-Luxury Sedans (Mercedes/BMW)</option>
              <option value="Full-Size SUVs (Fortuner / Defender)">Full-Size SUVs (Fortuner / Defender)</option>
              <option value="All Passenger Vehicles (Auto & Manual)">All Passenger Vehicles (Auto & Manual)</option>
            </select>
          </div>
        </div>

        {/* Languages Selection */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Languages Spoken * (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {availableLanguages.map((lang) => {
              const isSelected = formData.languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onToggleLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lang} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Documents</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
