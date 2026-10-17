import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, MessageCircle, Lock, ArrowRight } from 'lucide-react';
import { BHUBANESWAR_LOCATIONS } from '../../config/bookingConfig';
import { CONTACT_CONFIG } from '../../config/contact';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';

export const ContactForm = () => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '', // No default selected - user must pick
    location: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Auto-prefill authenticated user details
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!formData.service) {
      alert('Please select which service you want.');
      return;
    }
    const message = getWhatsAppInquiryMessage();
    const url = buildWhatsAppUrl(message);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getWhatsAppInquiryMessage = () => {
    let msg = `Hello CARZODRIVE! 👋\n\nI want to inquire about your services:\n`;
    msg += `• *Name:* ${formData.name}\n`;
    if (formData.service) msg += `• *Service Required:* ${formData.service}\n`;
    if (formData.location) msg += `• *Preferred Hub/Location:* ${formData.location}\n`;
    if (formData.email) msg += `• *Email:* ${formData.email}\n`;
    if (formData.phone) msg += `• *Phone:* ${formData.phone}\n`;
    if (formData.message) msg += `• *Message:* ${formData.message}\n`;
    return msg;
  };

  return (
    <div className="p-7 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
      <div className="mb-6">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
          DIRECT TRANSMISSION
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          Send Us a Message
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fill out the form below and an executive concierge officer will respond right away.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-950">Inquiry Prepared for WhatsApp!</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your inquiry for <strong className="text-blue-600 font-bold">"{formData.service}"</strong> has been prepared and WhatsApp is opening directly.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={buildWhatsAppUrl(getWhatsAppInquiryMessage())}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue in WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', service: '', location: '', message: '' });
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline py-2 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthRequiredNotice
            title="Login Required to Transmit Inquiry"
            message="Please log in or sign up before submitting your inquiry so our concierge team can verify and trace your request."
            className="mb-2"
          />

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="rahul@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Phone Number (WhatsApp Active) *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 1. SERVICE SELECTION DROPDOWN (NO DEFAULT PRE-SELECTED) */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Select Service Required (Which service do you want?) *
            </label>
            <select
              required
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="" disabled>-- Select Which Service You Want --</option>
              <option value="Self-Drive Car">🚗 Self-Drive Car (Drive Yourself)</option>
              <option value="Car with Driver (Chauffeur Service)">👔 Car with Driver (Executive Chauffeur)</option>
              <option value="Driver Only (Hire Driver for Your Car)">🧑‍✈️ Driver Only (Hire Driver for Your Own Car)</option>
              <option value="Self-Drive Bike (Bike & Scooter Rental)">🏍️ Self-Drive Bike (Bike & Scooter Rental)</option>
              <option value="Tour Packages (Odisha Sightseeing)">🌴 Tour Packages (Puri, Konark, Chilika)</option>
              <option value="Rent Your Car (Fleet Host Partnership)">🤝 Rent Your Car (Fleet Host Partnership)</option>
              <option value="Corporate / Long Term Account">🏢 Corporate / Long Term Account</option>
              <option value="General Inquiry / Other">💬 General Inquiry / Other</option>
            </select>
          </div>

          {/* 2. OPTIONAL BHUBANESWAR LOCATION */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Preferred Location / Hub (Optional)
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">-- Choose Bhubaneswar Location (Optional) --</option>
              {BHUBANESWAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Message / Trip Details *
            </label>
            <textarea
              rows="4"
              required
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share your travel dates, vehicle preference, specific pickup landmark or any question..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {!isAuthenticated ? (
            <div className="space-y-2">
              <Link
                to="/login"
                state={{ returnTo: '/contact' }}
                className="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] text-center"
              >
                <Lock className="w-4 h-4" />
                <span>Login to Transmit Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-slate-500">
                New user?{' '}
                <Link to="/signup" state={{ returnTo: '/contact' }} className="text-blue-600 hover:underline font-bold">
                  Sign Up here
                </Link>
                {' '}or{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-amber-700 hover:underline font-bold cursor-pointer"
                >
                  Quick Popup Login
                </button>
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/25 inline-flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Message via WhatsApp</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      )}
    </div>
  );
};
