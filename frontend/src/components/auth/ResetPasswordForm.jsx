import React from 'react';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, RefreshCw, ExternalLink, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

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
  // Password Strength Calculation
  const strength = React.useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    }
  }, [password]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="space-y-4">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between py-1 px-3 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-[11px] font-bold">
        <span className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Step 2 of 2 • Set New Password</span>
        </span>
        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white px-2 py-0.5 rounded-md border border-blue-200 text-blue-700 shadow-xs">
          Final Step
        </span>
      </div>

      {/* Security Dispatch Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-xs text-blue-950 space-y-2 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-blue-900 truncate">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">OTP sent to: <strong className="text-slate-900">{email || 'your email'}</strong></span>
          </div>
          <a
            href="https://mail.google.com/mail/u/0/#search/CARZODRIVE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-blue-700 hover:text-white bg-white hover:bg-blue-600 px-2.5 py-1 rounded-lg border border-blue-300 flex items-center gap-1 transition-all shrink-0 shadow-2xs cursor-pointer"
            title="Open Gmail search for CARZODRIVE"
          >
            <span>Open Gmail</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
          Check your <strong className="text-slate-800">Primary Inbox</strong> or <strong className="text-amber-800">Spam / Junk folder</strong> for the 6-digit code.
        </p>
      </div>

      {/* Account Email (Editable if needed) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="reset-email" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Account Email or Mobile</span>
          </label>
        </div>
        <input
          id="reset-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium shadow-xs"
        />
      </div>

      {/* 6-Digit Verification OTP */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="reset-token-otp" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>6-Digit Verification Code (OTP)</span>
          </label>
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resendTimer > 0 || resendLoading}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {resendLoading
              ? 'Dispatching...'
              : resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : 'Resend Code'}
          </button>
        </div>

        <div className="relative">
          <input
            id="reset-token-otp"
            name="verification_code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="• • • • • •"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border-2 border-blue-400/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 rounded-xl px-4 py-3 text-lg sm:text-xl font-mono font-black tracking-[0.35em] text-center text-blue-700 placeholder-slate-300 transition-all focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>New Password</span>
          </label>
          {strength.label && (
            <span className={`text-[11px] font-bold ${strength.text}`}>
              {strength.label}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            id="new-password"
            name="new_password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters with letters & numbers"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Meter */}
        {password && (
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    strength.score >= step ? strength.color : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500 flex items-center justify-between">
              <span>Must be at least 8 characters with uppercase and number.</span>
            </p>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="confirm-new-password" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Confirm New Password</span>
          </label>
          {passwordsMatch && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Passwords Match</span>
            </span>
          )}
        </div>
        <input
          id="confirm-new-password"
          name="confirm_new_password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
          className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium shadow-xs"
        />
      </div>

      {/* Submit Reset Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 transition-all shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_32px_rgba(37,99,235,0.5)] border border-blue-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait active:scale-98"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Updating Your Password...</span>
          </>
        ) : (
          <>
            <span>Update Password & Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Back to Login */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Return to Sign In</span>
        </button>
      </div>
    </div>
  );
};
