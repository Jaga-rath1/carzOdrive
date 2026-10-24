import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { authAPI, clearAuthSession } from '../../services/api';
import { DrivoraLogo } from '../../components/navbar/DrivoraLogo';
import heroBgImage from '../../assets/carzodrive-hero-bg.jpg';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call backend admin-login endpoint
      const res = await authAPI.adminLogin({
        email: email.trim(),
        password,
      });

      const role = res?.data?.user?.role || '';
      const ADMIN_ROLES = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'STAFF_ADMIN', 'ADMIN', 'FLEET_MANAGER'];
      if (!ADMIN_ROLES.includes(role)) {
        clearAuthSession();
        throw new Error('Access Denied: This login portal is strictly reserved for CARZODRIVE Administrators. Regular customer accounts cannot log in here.');
      }

      // Smooth redirection to Admin Dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      clearAuthSession();
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-950 text-white overflow-x-hidden pt-6 pb-10 px-4">
      {/* Background with Ambient Cyber Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-slate-950/90" />
        <img
          src={heroBgImage}
          alt="Admin Background"
          className="w-full h-full object-cover object-center filter brightness-[0.2] contrast-[1.3] blur-[3px]"
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Staff & Admin Gateway</span>
        </div>
      </div>

      {/* Main Admin Card */}
      <div className="relative z-10 my-auto py-8 w-full max-w-md mx-auto">
        <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-blue-500/30 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your administrator credentials to manage fleet, bookings, and operations.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}


          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@carzodrive.com"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-[0_4px_25px_rgba(37,99,235,0.4)] border border-blue-400/40 cursor-pointer flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Customer Login */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span>Looking for Customer Login? Go to Customer Portal (/login) →</span>
            </Link>
          </div>
        </div>
      </div>



      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-500">
        CARZODRIVE Executive Administrative Interface • Odisha, India
      </div>
    </div>
  );
};
