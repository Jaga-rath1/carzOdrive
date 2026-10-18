import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RentCarSuccess = ({ formData, submittedItem, onReset }) => {
  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950">
          Car Listing Submitted for Review!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Thank you, <strong className="text-slate-900">{formData.ownerName}</strong>. Your listing request for{' '}
          <strong className="text-slate-900">{formData.vehicleBrand} {formData.vehicleModel}</strong> ({formData.vehicleNumber}) has been submitted.
        </p>
      </div>

      {submittedItem && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-sm mx-auto space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Submission ID:</span>
            <span className="font-mono font-bold text-blue-600">{submittedItem.id || submittedItem._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Target Daily Price:</span>
            <span className="font-bold text-slate-900">₹{formData.expectedDailyPrice}/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Hub Location:</span>
            <span className="font-bold text-slate-900">{formData.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Verification Status:</span>
            <span className="font-bold text-amber-600">Under Admin KYC Review</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm inline-flex items-center justify-center gap-1.5"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
        >
          List Another Vehicle
        </button>
      </div>
    </div>
  );
};
