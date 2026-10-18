import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const DriverStepIndicator = ({ currentStep, isSubmitted, steps }) => {
  return (
    <div className="mb-10 sm:mb-12">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum || isSubmitted;

          return (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm transition-all duration-300 border ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : isActive
                    ? 'bg-slate-950 border-slate-950 text-white ring-4 ring-blue-100 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : step.number}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 truncate w-full ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Track Line */}
      <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${isSubmitted ? 100 : (currentStep / 4) * 100}%` }}
        />
      </div>
    </div>
  );
};
