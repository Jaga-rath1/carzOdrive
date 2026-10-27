import React from 'react';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';

export const ResetPasswordForm = ({
  email,
  setEmail,
  resetToken,
  setResetToken,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  resendTimer,
  resendLoading,
  onResendOtp,
  isLoading,
  onBackToLogin,
}) => {
  return (
    <>
      {/* Security Dispatch Notice */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200/95 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 truncate">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Code dispatched to {email || 'your email'}</span>
          </div>
          <a
            href="https://mail.google.com/mail/u/0/#search/CARZODRIVE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 px-2.5 py-1 rounded-lg border border-cyan-400/30 flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            title="Open Gmail search for CARZODRIVE"
          >
            <span>Open Gmail</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[11px] text-slate-300 pl-5.5 leading-relaxed">
          Please check your <strong className="text-white">Primary Inbox</strong> or <strong className="text-amber-300">Spam / Junk folder</strong>.
        </p>
      </div>

      {/* Account Email */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Account Email</span>
          </label>
          {email && (
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-full">
              Code Sent
            </span>
          )}
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
        />
      </div>

      {/* 6-Digit Verification OTP */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>6-Digit Verification Code (OTP)</span>
          </label>
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resendTimer > 0 || resendLoading}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
          >
            {resendLoading
              ? 'Sending...'
              : resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : 'Resend Code'}
          </button>
        </div>

        {resetToken && resetToken.length === 6 && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 shadow-sm">
            <span className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verification OTP:</span>
              <strong className="font-mono text-sm tracking-widest text-emerald-200 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                {resetToken}
              </strong>
            </span>
            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-900/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Auto-Filled ✓
            </span>
          </div>
        )}

        <input
          type="text"
          required
          maxLength={6}
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter 6-digit OTP"
          className="w-full bg-slate-900 border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-mono font-bold tracking-widest text-center text-cyan-300 placeholder-slate-600 transition-all focus:outline-none"
        />
        <p className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
          <span>💡 If not in inbox, please check your <strong>Spam / Junk</strong> folder.</span>
        </p>
      </div>

      {/* New Password */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Password</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Confirm New Password</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
        />
      </div>

      {/* Submit Reset Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Resetting Your Password...</span>
          </>
        ) : (
          <>
            <span>Update Password & Sign In</span>
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
