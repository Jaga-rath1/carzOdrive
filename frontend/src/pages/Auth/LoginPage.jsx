import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Sparkles, UserCheck, LogOut } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { DrivoraLogo } from '../../components/navbar/DrivoraLogo';
import { getCurrentUser, clearAuthSession } from '../../services/api';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';
  const resetSuccessMsg = location.state?.message || (location.state?.resetSuccess ? 'Password reset successful! Please log in with your new password.' : null);

  const [currentUser, setCurrentUser] = React.useState(() => {
    if (location.state?.resetSuccess) {
      clearAuthSession();
      return null;
    }
    return getCurrentUser();
  });

  React.useEffect(() => {
    if (location.state?.resetSuccess) {
      clearAuthSession();
      setCurrentUser(null);
    }
  }, [location.state?.resetSuccess]);

  React.useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('carzodrive-auth-change', handleAuthChange);
    return () => window.removeEventListener('carzodrive-auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

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

      {/* Top Navigation Bar: Brand Logo & Navigation */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DrivoraLogo isLight={true} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span className="hidden xs:inline">Back to</span> Home
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-xs"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 my-auto py-8">
        {currentUser ? (
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white/95 border border-slate-200/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-xl font-black text-white shadow-lg">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Already Signed In</p>
              <h2 className="text-xl font-black text-slate-900 mt-1">{currentUser.name || 'Valued User'}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {currentUser.role || 'CUSTOMER'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md cursor-pointer"
              >
                Go to Homepage
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <AuthCard
            key={`${prefilledEmail}-${resetSuccessMsg ? 'reset-success' : 'normal'}`}
            initialMode="login"
            initialEmail={prefilledEmail}
            initialStatusMessage={resetSuccessMsg ? { type: 'success', text: resetSuccessMsg } : null}
            onSuccess={(data) => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('carzodrive-auth-change', { detail: { user: data?.user || data } }));
              }
              const user = data?.user || data;
              const role = user?.role || '';
              const returnTo = location.state?.from || location.state?.returnTo;
              setTimeout(() => {
                if (returnTo) {
                  navigate(returnTo);
                } else if (role === 'VENDOR') {
                  navigate('/rent-your-car');
                } else {
                  navigate('/');
                }
              }, 400);
            }}
          />
        )}

        {/* Explicit Admin Gateway Switcher */}
        <div className="mt-4 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 py-1.5 px-3.5 rounded-full bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Are you a CARZODRIVE Administrator? Sign in here →</span>
          </Link>
        </div>
      </div>

      {/* Footer Trust Guarantees */}
      <div className="relative z-10 max-w-md mx-auto text-center space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>End-to-End Secure</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Instant Fleet Access</span>
          </span>
        </div>
        <p className="text-slate-400">
          © {new Date().getFullYear()} CARZODRIVE Odisha Mobility. All rights reserved.
        </p>
      </div>
    </div>
  );
};
