import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Sparkles, UserCheck, LogOut } from 'lucide-react';
import { AuthCard } from '../../components/auth/AuthCard';
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

      {/* Top Navigation Bar: Back to Home */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-300 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-300 hover:text-cyan-200 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 transition-all"
          >
            <span>Create Account</span>
          </Link>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Customer & Rider Portal</span>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 my-auto py-8">
        {currentUser ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center text-xl font-black text-white shadow-lg">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Already Signed In</p>
              <h2 className="text-lg font-black text-white mt-1">{currentUser.name || 'Valued User'}</h2>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {currentUser.role || 'CUSTOMER'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
              >
                Go to Homepage
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer"
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 py-1.5 px-3.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Are you a CARZODRIVE Administrator? Sign in here →</span>
          </Link>
        </div>
      </div>


      {/* Footer Trust Guarantees */}
      <div className="relative z-10 max-w-md mx-auto text-center space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>End-to-End Secure</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Instant Fleet Access</span>
          </span>
        </div>
        <p className="text-slate-500">
          © {new Date().getFullYear()} CARZODRIVE Odisha Mobility. All rights reserved.
        </p>
      </div>
    </div>
  );
};
