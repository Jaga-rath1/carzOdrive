import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Sparkles, Home } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { DrivoraLogo } from '../../components/navbar/DrivoraLogo';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-50 text-slate-900 overflow-x-hidden pt-5 pb-8 px-4 sm:px-6">
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

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full px-2 sm:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DrivoraLogo isLight={true} />
        </div>

        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Sign In</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xs:inline">Home</span>
          </Link>
        </nav>
      </header>

      {/* Centered Auth Card with Balanced Scale */}
      <main className="relative z-10 my-auto py-6 sm:py-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <AuthCard
            initialMode="forgot-password"
            onBackToLogin={() => navigate('/login')}
            onOtpSent={(sentEmail) => {
              const query = new URLSearchParams({ email: sentEmail });
              navigate(`/reset-password?${query.toString()}`, {
                state: { email: sentEmail, otpSent: true },
              });
            }}
            onResetSuccess={(savedEmail) => {
              navigate('/login', {
                replace: true,
                state: {
                  email: savedEmail,
                  resetSuccess: true,
                  message: 'Password reset successful! Please log in with your new password.',
                },
              });
            }}
          />
        </div>
      </main>

      {/* Footer Trust Guarantees */}
      <footer className="relative z-10 max-w-md mx-auto text-center space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Encrypted Token Delivery</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>24/7 CarzoDrive Support</span>
          </span>
        </div>
        <p className="text-slate-400">
          © {new Date().getFullYear()} CARZODRIVE Odisha Mobility. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
