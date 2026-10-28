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
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Email Address or Mobile</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Registered email or 10-digit mobile"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
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
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
        >
          ← Return to Sign In
        </button>
      </div>
    </>
  );
};
