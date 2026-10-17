import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  CalendarCheck
} from 'lucide-react';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { DrivoraLogo } from './DrivoraLogo';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { getAccessToken, getCurrentUser, clearAuthSession, authAPI } from '../../services/api';

export const Navbar = ({ onOpenQuickBook, onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Re-sync user state from storage
  const syncUserState = () => {
    setCurrentUser(getCurrentUser());
  };

  // Re-sync on route changes (e.g. returning from /login)
  useEffect(() => {
    syncUserState();
  }, [location.pathname]);

  // If token is present but user profile is missing or lacks name, auto-fetch from backend
  useEffect(() => {
    const token = getAccessToken();
    if (token && (!currentUser || !currentUser.name)) {
      authAPI.getMe()
        .then((res) => {
          if (res?.data) {
            setCurrentUser(res.data);
          }
        })
        .catch(() => {
          // Token invalid or network issue
        });
    }
  }, []);

  // Listen for login/logout changes dynamically via custom event, storage event & window focus
  useEffect(() => {
    window.addEventListener('carzodrive-auth-change', syncUserState);
    window.addEventListener('storage', syncUserState);
    window.addEventListener('focus', syncUserState);
    return () => {
      window.removeEventListener('carzodrive-auth-change', syncUserState);
      window.removeEventListener('storage', syncUserState);
      window.removeEventListener('focus', syncUserState);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleLoginClick = () => {
    if (onOpenAuth) {
      onOpenAuth('login');
    } else {
      navigate('/login');
    }
  };

  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    (currentUser?.email ? currentUser.email.split('@')[0] : '') ||
    'Customer';

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-2xl border-b border-blue-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2 sm:py-2.5'
            : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            {/* Logo: DRIVORA / CARZODRIVE */}
            <DrivoraLogo />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center">
              <NavLinks />
            </nav>

            {/* Right Action CTA: User Auth & Book a Ride (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              {currentUser ? (
                /* Logged-in User Account Badge + Quick Logout Button */
                <div className="flex items-center gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-400/40 hover:border-cyan-300 text-xs font-bold text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] select-none group"
                      title={displayName}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white uppercase shadow-md bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 ring-2 ring-cyan-400/40 shrink-0">
                        {userInitial}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider leading-none">
                          Welcome,
                        </span>
                        <span className="max-w-[150px] truncate text-white font-extrabold text-xs sm:text-[13px] leading-tight">
                          {displayName}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-cyan-300 transition-transform duration-200 shrink-0 ${
                          userDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User Info Header */}
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white uppercase shadow-md bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shrink-0">
                            {userInitial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-white truncate">
                              {displayName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {currentUser.email || currentUser.phone || ''}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {currentUser.role || 'CUSTOMER'}
                            </span>
                          </div>
                        </div>

                        {/* Customer / Rider Links */}
                        <div className="space-y-1 pt-1">
                          <Link
                            to="/my-bookings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <CalendarCheck className="w-4 h-4 text-cyan-400" />
                            <span>My Bookings</span>
                          </Link>

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-100 hover:bg-rose-500/15 transition-colors text-left cursor-pointer border-t border-white/10 mt-1"
                          >
                            <LogOut className="w-4 h-4 text-rose-400" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Immediate 1-Click Logout Button on Navbar */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-rose-100 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                /* Customer Login / Sign In Button */
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Login</span>
                </button>
              )}

              {/* Book a Ride CTA */}
              <button
                type="button"
                onClick={onOpenQuickBook}
                className="group relative inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.65)] border border-blue-400/30 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-200 transition-transform group-hover:rotate-12" />
                <span>Book a Ride</span>
              </button>
            </div>

            {/* Mobile / Tablet Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {!currentUser ? (
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="py-1 px-2.5 rounded-lg text-slate-200 hover:text-white bg-white/10 border border-white/15 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Login"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Login</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:bg-white/15 border border-cyan-400/40 text-xs font-bold text-white cursor-pointer shadow-xs active:scale-95"
                  title={displayName}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase shadow-xs bg-gradient-to-tr from-cyan-400 to-blue-600 shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-cyan-300 font-bold leading-none">Hi,</span>
                    <span className="text-[11px] font-black text-white max-w-[90px] truncate leading-tight">
                      {displayName.split(' ')[0]}
                    </span>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenQuickBook}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer border border-blue-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Book</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 rounded-lg text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenQuickBook={onOpenQuickBook}
        onOpenAuth={onOpenAuth}
      />
    </>
  );
};
