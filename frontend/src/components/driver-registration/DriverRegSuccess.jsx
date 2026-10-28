import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';

export const DriverRegSuccess = ({
  formData,
  submittedDriver,
  onReset,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
          Application Transmitted
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
          Welcome to the CARZODRIVE Driver Fleet
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-slate-900">{formData.name || 'Partner'}</strong>. Your application dossier has been submitted. Our Operations Team in {formData.city} will review your documents and reach out within 24–48 hours.
        </p>
      </div>

      {/* Application Summary Box */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-200/80">
          <span className="text-slate-500 font-semibold">Application Ref ID</span>
          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {submittedDriver?.id || submittedDriver?._id || 'CZ-DRV-PENDING'}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200/80">
          <span className="text-slate-500 font-semibold">Primary Contact</span>
          <span className="font-bold text-slate-900">{formData.phone || '+91 73777 33391'}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200/80">
          <span className="text-slate-500 font-semibold">City Hub</span>
          <span className="font-bold text-slate-900">{formData.city}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500 font-semibold">Verification Status</span>
          <span className="font-bold text-amber-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Under Document Review
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center justify-center gap-2"
        >
          <span>Return to Home</span>
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all cursor-pointer"
        >
          Submit Another Registration
        </button>
      </div>
    </motion.div>
  );
};
