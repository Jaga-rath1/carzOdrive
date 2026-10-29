import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { DrivoraLogo } from '../navbar/DrivoraLogo';
import { authAPI, clearAuthSession } from '../../services/api';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export const AuthCard = ({
  initialMode = 'login',
  initialEmail = '',
  initialToken = '',
  initialStatusMessage = null,
  onSuccess,
  onResetSuccess,
  onClose,
  onOtpSent,
  onBackToLogin,
  onForgotPassword,
  isModal = false,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => (initialMode === 'forgot-password' ? '' : (initialEmail || '')));
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState(initialToken);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(() => initialStatusMessage || null);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'forgot-password' && initialEmail && !email) setEmail(initialEmail);
    if (initialToken) setResetToken(initialToken);
    if (initialStatusMessage && !statusMessage) setStatusMessage(initialStatusMessage);
  }, [initialEmail, initialToken, initialStatusMessage, mode]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const switchMode = (newMode) => {
    setStatusMessage(null);
    // Explicitly wipe passwords, OTP codes, and active focus to prevent browser autofill spillover
    setPassword('');
    setConfirmPassword('');
    setResetToken('');
    setShowPassword(false);
    if (newMode === 'forgot-password') {
      setEmail('');
    }
    if (typeof document !== 'undefined' && document.activeElement) {
      document.activeElement.blur();
    }
    setMode(newMode);
  };

  const handleBackToLogin = () => {
    switchMode('login');
    if (onBackToLogin) {
      onBackToLogin();
    } else if (!isModal && window.location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const handleForgotPasswordClick = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setResetToken('');
    if (onForgotPassword) {
      onForgotPassword();
    } else if (!isModal && window.location.pathname === '/login') {
      navigate('/forgot-password');
    } else {
      switchMode('forgot-password');
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendTimer > 0 || resendLoading) return;
    setResendLoading(true);
    setStatusMessage(null);
    try {
      await authAPI.forgotPassword(email);
      // Clean token state so user enters fresh OTP manually
      setResetToken('');
      setResendTimer(30);
      setStatusMessage({
        type: 'success',
        text: `A fresh 6-digit verification code has been dispatched to ${email}. Please check your inbox and spam folder.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to resend verification OTP. Please try again.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: '', color: '' };
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (mode === 'login') {
        const res = await authAPI.login({ email, password });
        setStatusMessage({
          type: 'success',
          text: `Welcome back, ${res.data?.user?.name || 'Valued Member'}! Synchronizing session...`,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('carzodrive-auth-change', { detail: { user: res.data?.user } }));
        }
        if (onSuccess) {
          onSuccess(res.data);
        } else {
          setTimeout(() => {
            if (isModal && onClose) {
              onClose();
            } else {
              navigate('/');
            }
          }, 600);
        }

      } else if (mode === 'signup') {
        if (!agreeTerms) {
          setStatusMessage({ type: 'error', text: 'You must agree to the Terms of Service to proceed.' });
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify.' });
          setIsLoading(false);
          return;
        }
        const res = await authAPI.register({ name, email, phone, password });
        setStatusMessage({
          type: 'success',
          text: `Account created successfully! Welcome, ${res.data?.user?.name || name}!`,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('carzodrive-auth-change', { detail: { user: res.data?.user } }));
        }
        if (onSuccess) {
          onSuccess(res.data);
        } else {
          setTimeout(() => {
            if (isModal && onClose) {
              onClose();
            } else {
              navigate('/');
            }
          }, 700);
        }

      } else if (mode === 'forgot-password') {
        const res = await authAPI.forgotPassword(email);
        const targetEmail = res?.data?.email || email;
        setEmail(targetEmail);
        // Wipe password and token states so NO autofill or old data carries over
        setResetToken('');
        setPassword('');
        setConfirmPassword('');

        setStatusMessage({
          type: 'success',
          text: `Security OTP dispatched to ${targetEmail}. Please check your inbox and spam folder.`,
        });

        if (onOtpSent) {
          onOtpSent(targetEmail);
        } else if (!isModal) {
          navigate(`/reset-password?email=${encodeURIComponent(targetEmail)}`, {
            state: { email: targetEmail, otpSent: true },
          });
        } else {
          setResendTimer(30);
          switchMode('reset-password');
        }

      } else if (mode === 'reset-password') {
        if (!email) {
          setStatusMessage({ type: 'error', text: 'Please enter your account email address.' });
          setIsLoading(false);
          return;
        }
        if (!resetToken || resetToken.length < 4) {
          setStatusMessage({ type: 'error', text: 'Please enter the 6-digit OTP verification code received on your email.' });
          setIsLoading(false);
          return;
        }
        if (!password || password.length < 8) {
          setStatusMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify.' });
          setIsLoading(false);
          return;
        }

        await authAPI.resetPassword({ token: resetToken, email, password });

        // Clean up sensitive reset inputs
        setPassword('');
        setConfirmPassword('');
        setResetToken('');

        setStatusMessage({
          type: 'success',
          text: 'Password reset successful! Redirecting to sign in...',
        });

        if (onResetSuccess) {
          onResetSuccess(email);
        }

        setTimeout(() => {
          if (isModal) {
            switchMode('login');
            setStatusMessage({
              type: 'success',
              text: 'Password reset successful! Please log in with your new password.',
            });
          } else {
            if (window.location.pathname === '/login') {
              switchMode('login');
              setStatusMessage({
                type: 'success',
                text: 'Password reset successful! Please log in with your new password.',
              });
            } else {
              navigate('/login', {
                replace: true,
                state: {
                  email,
                  resetSuccess: true,
                  message: 'Password reset successful! Please log in with your new password.',
                },
              });
            }
          }
        }, 700);
      }
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setStatusMessage({
          type: 'error',
          text: 'Backend server is not running on port 5000. Start backend with `npm run dev`.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Authentication failed. Please verify your credentials.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-white/95 backdrop-blur-3xl border border-slate-200/90 p-5 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.04)] text-slate-900 overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-[0_0_10px_rgba(37,99,235,0.4)]" />

      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-2 mb-5">
        <DrivoraLogo isLight={true} />
        <div className="pt-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-1"
            >
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot-password' && 'Forgot Password'}
                {mode === 'reset-password' && 'Set New Password'}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium max-w-xs mx-auto">
                {mode === 'login' && 'Sign in to access your bookings & exclusive fleet rates.'}
                {mode === 'signup' && 'Unlock instant self-drive bookings with zero security deposit.'}
                {mode === 'forgot-password' && 'Enter your registered details to receive a 6-digit recovery OTP.'}
                {mode === 'reset-password' && 'Enter the 6-digit verification code sent to your email.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs */}
      {(mode === 'login' || mode === 'signup') && (
        <div className="grid grid-cols-2 p-1 mb-5 rounded-xl bg-slate-100/90 border border-slate-200/80">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Feedback Alert */}
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Keyed Form per Mode: Prevents Chromium password manager cross-talk & autofill bugs */}
      <form
        key={mode}
        id={`auth-form-${mode}`}
        autoComplete="off"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {mode === 'login' && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            onForgotPassword={handleForgotPasswordClick}
          />
        )}

        {mode === 'signup' && (
          <SignupForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            passwordStrength={passwordStrength}
            isLoading={isLoading}
          />
        )}

        {mode === 'forgot-password' && (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
            onBackToLogin={handleBackToLogin}
          />
        )}

        {mode === 'reset-password' && (
          <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            resetToken={resetToken}
            setResetToken={setResetToken}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            resendTimer={resendTimer}
            resendLoading={resendLoading}
            onResendOtp={handleResendOtp}
            isLoading={isLoading}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </form>
    </div>
  );
};
