import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-950 text-white overflow-x-hidden pt-6 pb-10 px-4">
      {/* Background with Ambient Cyber Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-slate-950" />
        <img
          src={heroBgImage}
          alt="Carzodrive Background"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.2] blur-[2px] select-none"
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-blue-600/12 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation Bar: Back to Login & Home */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 hover:text-cyan-200 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <span>Home</span>
          </Link>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Account Recovery Service</span>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 my-auto py-8">
        <AuthCard
          initialMode="forgot-password"
          onBackToLogin={() => navigate('/login')}
          onOtpSent={(sentEmail, receivedOtp) => {
            const query = new URLSearchParams({ email: sentEmail });
            if (receivedOtp) query.set('otp', receivedOtp);
            navigate(`/reset-password?${query.toString()}`, {
              state: { email: sentEmail, otpSent: true, devOtp: receivedOtp, token: receivedOtp },
            });
          }}
        />
      </div>

      {/* Footer Trust Guarantees */}
      <div className="relative z-10 max-w-md mx-auto text-center space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Encrypted Token Delivery</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>24/7 Carzodrive Concierge</span>
          </span>
        </div>
        <p className="text-slate-500">
          © {new Date().getFullYear()} CARZODRIVE Odisha Mobility. All rights reserved.
        </p>
      </div>
    </div>
  );
};
