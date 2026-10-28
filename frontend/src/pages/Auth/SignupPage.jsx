import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';

export const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-50 text-slate-900 overflow-x-hidden pt-6 pb-10 px-4">
      {/* Background with Ambient Sky Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-sky-100/50 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 20%, rgba(2, 132, 199, 0.8) 1.5px, transparent 1.5px), linear-gradient(to right, rgba(2, 132, 199, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          }}
        />
      </div>

      {/* Top Navigation Bar: Sign In & Home */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Sign In</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 transition-all shadow-xs"
          >
            <span>Home</span>
          </Link>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Fleet Membership</span>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 my-auto py-8">
        <AuthCard
          initialMode="signup"
          onSuccess={(data) => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('carzodrive-auth-change', { detail: { user: data?.user || data } }));
            }
            const returnTo = location.state?.from || location.state?.returnTo;
            setTimeout(() => navigate(returnTo || '/'), 800);
          }}
        />
      </div>

      {/* Footer Trust Guarantees */}
      <div className="relative z-10 max-w-md mx-auto text-center space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>Zero Spam Privacy</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>₹0 Security Deposit Option</span>
          </span>
        </div>
        <p className="text-slate-400">
          © {new Date().getFullYear()} CARZODRIVE Odisha Mobility. All rights reserved.
        </p>
      </div>
    </div>
  );
};
