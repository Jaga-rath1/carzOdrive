import React from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw } from 'lucide-react';

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  onForgotPassword,
}) => {
  return (
    <>
      {/* Email Address */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Email Address</span>
        </label>
        <div className="relative">
          <input
            type="email"
            required
            autoComplete="email"
            autoFocus={!email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Password</span>
          </label>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              if (typeof document !== 'undefined' && document.activeElement) {
                document.activeElement.blur();
              }
              onForgotPassword();
            }}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            autoFocus={Boolean(email)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your account password"
            className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 transition-all shadow-[0_6px_22px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] border border-blue-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait active:scale-95"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Authenticating Account...</span>
          </>
        ) : (
          <>
            <span>Sign In to CARZODRIVE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </>
  );
};
