import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, MapPin, ArrowRight } from 'lucide-react';

export const DriverStepPersonal = ({ formData, onInputChange, onNext }) => {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
          STEP 01 OF 04
        </span>
        <h2 className="text-2xl font-black text-slate-950 mt-1">
          Personal Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please enter your legal name and contact details as they appear on your government IDs.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Full Legal Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="e.g. Rajesh Kumar Sharma"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="rajesh.driver@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Date of Birth *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => onInputChange('dob', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Must be at least 23 years old</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Operational City *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={formData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
                <option value="Cuttack">Cuttack, Odisha</option>
                <option value="Puri">Puri, Odisha</option>
                <option value="Rourkela">Rourkela, Odisha</option>
                <option value="Kolkata">Kolkata, West Bengal</option>
                <option value="Bengaluru">Bengaluru, Karnataka</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Driving Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
