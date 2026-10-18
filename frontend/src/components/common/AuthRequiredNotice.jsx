import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AuthRequiredNotice = ({
  title = 'Login Required to Submit',
  message = 'You must be signed in with your CARZODRIVE account before submitting this form. Your submission will be safely linked to your profile.',
  className = '',
  returnTo,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const location = useLocation();
  const targetReturnTo = returnTo || location.pathname;

  if (isAuthenticated) return null;

  return (
    <div
      className={`p-4 rounded-2xl bg-amber-50/95 border border-amber-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
            <span>{title}</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300">
              Required
            </span>
          </h5>
          <p className="text-[11px] text-amber-900/80 mt-0.5 leading-relaxed">
            {message}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-amber-950 font-semibold flex-wrap">
            <span>Have an account?</span>
            <Link
              to="/login"
              state={{ returnTo: targetReturnTo }}
              className="text-blue-700 hover:text-blue-900 underline font-extrabold inline-flex items-center gap-0.5"
            >
              <span>Click to Login</span>
              <ArrowRight className="w-3 h-3 inline" />
            </Link>
            <span>•</span>
            <Link
              to="/signup"
              state={{ returnTo: targetReturnTo }}
              className="text-blue-700 hover:text-blue-900 underline font-extrabold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/login"
          state={{ returnTo: targetReturnTo }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95 text-center"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Login / Sign Up</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 font-bold text-xs shadow-sm transition-all flex items-center justify-center cursor-pointer active:scale-95"
          title="Open Login Popup Modal"
        >
          Popup
        </button>
      </div>
    </div>
  );
};
