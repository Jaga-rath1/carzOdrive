import React from 'react';
import { Mail, ArrowRight, RefreshCw, ShieldCheck, KeyRound, ArrowLeft, PhoneCall } from 'lucide-react';

export const ForgotPasswordForm = ({
  email,
  setEmail,
  isLoading,
  onBackToLogin,
}) => {
  return (
    <div className="space-y-4">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between py-1 px-3 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-[11px] font-bold">
        <span className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Step 1 of 2 • Identity Verification</span>
        </span>
        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-700 shadow-xs">
          Secure OTP
        </span>
      </div>

      {/* Email / Mobile Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="recovery-identifier"
          className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Registered Email or Mobile</span>
          </span>
          <span className="text-[11px] font-normal normal-case text-slate-500">
            10-digit mobile or email
          </span>
        </label>
        <div className="relative">
          <input
            id="recovery-identifier"
            name="recovery_identifier"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@example.com or 9876543210"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium shadow-xs"
          />
        </div>
        <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
          <span>We'll send a 6-digit one-time code to verify your identity.</span>
        </p>
      </div>

      {/* Security Protection Assurance Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/70 text-xs text-slate-700 space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Account Security Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
          Your active reservations, loyalty tier, and identity documents stay protected with 256-bit encryption during recovery.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 transition-all shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_32px_rgba(37,99,235,0.5)] border border-blue-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait active:scale-98"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sending Verification OTP...</span>
          </>
        ) : (
          <>
            <span>Send 6-Digit OTP Code</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Return & Support Links */}
      <div className="pt-2 space-y-2 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Remember your password? Sign In</span>
        </button>

        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <span>Need help? Contact</span>
          <a
            href="tel:+919876543210"
            className="text-slate-600 hover:text-blue-600 font-semibold underline underline-offset-2"
          >
            24/7 CarzoDrive Concierge
          </a>
        </div>
      </div>
    </div>
  );
};
