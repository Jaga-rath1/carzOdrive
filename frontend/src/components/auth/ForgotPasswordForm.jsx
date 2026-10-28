import React from 'react';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';

export const ForgotPasswordForm = ({
  email,
  setEmail,
  isLoading,
  onBackToLogin,
}) => {
  return (
    <>
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Email Address or Mobile</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Registered email or 10-digit mobile"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 transition-all shadow-[0_6px_22px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] border border-blue-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait active:scale-95"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Dispatching Security OTP...</span>
          </>
        ) : (
          <>
            <span>Send Reset OTP Code</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
        >
          ← Return to Sign In
        </button>
      </div>
    </>
  );
};
