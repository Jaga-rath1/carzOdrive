import React from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export const SignupForm = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  agreeTerms,
  setAgreeTerms,
  passwordStrength,
  isLoading,
}) => {
  return (
    <>
      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full Name</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Mohanty"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Email Address</span>
        </label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mobile Phone</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-xs font-bold text-slate-400 select-none">
            +91
          </span>
          <input
            type="tel"
            required
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="98765 43210"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl pl-12 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Create Password</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
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

        {/* Dynamic Password Strength Meter */}
        {password && (
          <div className="pt-1 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Password Strength:</span>
              <span className="font-bold text-cyan-300">{passwordStrength.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-1 bg-slate-900 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full transition-all duration-300 ${
                    passwordStrength.score >= step
                      ? passwordStrength.color
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Confirm Password</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none"
        />
      </div>

      {/* Terms Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400/40"
          />
          <span className="text-[11px] text-slate-400 leading-snug">
            I agree to the{' '}
            <span className="text-cyan-400 hover:underline">Terms of Service</span>,{' '}
            <span className="text-cyan-400 hover:underline">Privacy Policy</span>, and damage liability terms.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !agreeTerms}
        className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Creating Your Account...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </>
  );
};
