import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

const IN_APP_STEPS = [
  {
    step: 1,
    title: 'Launch App & Navigate to Profile:',
    body: (
      <>
        Open the CarzoDrive mobile application and tap the <strong>Profile</strong> tab in the bottom navigation bar.
      </>
    ),
    cardClass: 'bg-gradient-to-r from-blue-50/60 to-indigo-50/30 border-blue-200/80',
    badgeClass: 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20',
  },
  {
    step: 2,
    title: 'Open Personal Information:',
    body: (
      <>
        Tap on <strong>Personal Information</strong> to view your registered profile credentials.
      </>
    ),
    cardClass: 'bg-gradient-to-r from-indigo-50/60 to-purple-50/30 border-indigo-200/80',
    badgeClass: 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-500/20',
  },
  {
    step: 3,
    title: 'Select Account Deletion / Support:',
    body: (
      <>
        Scroll down and select <strong>Request Account Deletion</strong> or contact the Concierge Desk.
      </>
    ),
    cardClass: 'bg-gradient-to-r from-purple-50/60 to-pink-50/30 border-purple-200/80',
    badgeClass: 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-purple-500/20',
  },
  {
    step: 4,
    title: 'Confirm Deletion Request:',
    body: 'Confirm your request. You will receive an OTP or confirmation email to verify ownership.',
    cardClass: 'bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border-emerald-200/80',
    badgeClass: 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-500/20',
  },
];

export const AccountDeletionSection = () => {
  const [deletionForm, setDeletionForm] = useState({
    email: '',
    phone: '',
    reason: 'No longer using the service',
    notes: '',
    confirmed: false,
  });
  const [deletionSubmitted, setDeletionSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const buildDeletionWhatsAppMessage = (ticket) => {
    let msg = `Hello CARZODRIVE Compliance Desk,\n\n*OFFICIAL ACCOUNT DELETION REQUEST (Google Play & DPDP)*\n\n`;
    msg += `🆔 *Reference Ticket:* ${ticket}\n`;
    msg += `📧 *Registered Email:* ${deletionForm.email.trim()}\n`;
    msg += `📱 *Registered Mobile:* ${deletionForm.phone.trim()}\n`;
    msg += `📋 *Reason for Deletion:* ${deletionForm.reason}\n`;
    if (deletionForm.notes && deletionForm.notes.trim()) {
      msg += `📝 *Additional Notes:* ${deletionForm.notes.trim()}\n`;
    }
    msg += `\nPlease verify my ownership and process permanent deletion of my account and associated data in compliance with the DPDP Act, 2023.`;
    return msg;
  };

  const handleDeletionSubmit = (e) => {
    e.preventDefault();
    if (!deletionForm.email || !deletionForm.phone) return;
    const randomTicket = 'DEL-' + Math.floor(100000 + Math.random() * 900000);
    const waMessage = buildDeletionWhatsAppMessage(randomTicket);
    const url = buildWhatsAppUrl(waMessage);
    setTicketId(randomTicket);
    setWhatsappUrl(url);
    setDeletionSubmitted(true);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const resetDeletionForm = () => {
    setDeletionForm({
      email: '',
      phone: '',
      reason: 'No longer using the service',
      notes: '',
      confirmed: false,
    });
    setWhatsappUrl('');
    setDeletionSubmitted(false);
  };

  return (
    <>
      {/* Card 1: Online Request Form */}
      <section
        id="online-deletion-form"
        className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(37,99,235,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-blue-600" />
          Online Request Form
        </span>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full inline-block shrink-0"></span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Submit Deletion Request
          </h2>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Fill in your registered credentials. Our compliance desk will verify the request and dispatch an authentication confirmation.
        </p>

        {!deletionSubmitted ? (
          <form onSubmit={handleDeletionSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                value={deletionForm.email}
                onChange={(e) => setDeletionForm({ ...deletionForm, email: e.target.value })}
                placeholder="e.g. yourname@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                Registered Mobile Phone Number *
              </label>
              <input
                type="tel"
                required
                value={deletionForm.phone}
                onChange={(e) => setDeletionForm({ ...deletionForm, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                Reason for Deletion
              </label>
              <select
                value={deletionForm.reason}
                onChange={(e) => setDeletionForm({ ...deletionForm, reason: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs transition-colors"
              >
                <option value="No longer using the service">No longer using the service</option>
                <option value="Privacy or data security concerns">Privacy or data security concerns</option>
                <option value="Temporary break / seasonal travel">Temporary break / seasonal travel</option>
                <option value="Created a duplicate account">Created a duplicate account</option>
                <option value="Switching to another platform">Switching to another platform</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                Additional Notes (Optional)
              </label>
              <textarea
                rows="3"
                value={deletionForm.notes}
                onChange={(e) => setDeletionForm({ ...deletionForm, notes: e.target.value })}
                placeholder="Any specific instructions or booking reference..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs resize-none transition-colors"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit Official Deletion Request</span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Redirects securely to Official CARZODRIVE WhatsApp Compliance Desk with your details pre-filled.
              </p>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Deletion Request Redirected to WhatsApp ({ticketId})
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your deletion details for <strong className="text-slate-900">{deletionForm.email}</strong> have been prepared and WhatsApp is opening directly. Please send the pre-filled message to our Compliance Desk to verify ownership and complete data erasure within 30 days.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue in WhatsApp</span>
                </a>
              )}
              <button
                onClick={resetDeletionForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Card 2: How to Request Deletion Inside the Mobile App */}
      <section
        id="in-app-deletion-guide"
        className="bg-white rounded-3xl border border-indigo-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(99,102,241,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Smartphone className="w-3 h-3 text-indigo-600" />
          Android & iOS Mobile Application
        </span>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full inline-block shrink-0"></span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How to Request Deletion Inside the Mobile App
          </h2>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Follow these step-by-step instructions if you have the Android app installed:
        </p>

        <div className="space-y-4">
          {IN_APP_STEPS.map(({ step, title, body, cardClass, badgeClass }) => (
            <div key={step} className={`p-5 rounded-2xl border flex items-start gap-4 ${cardClass}`}>
              <div className={`w-9 h-9 rounded-2xl text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md ${badgeClass}`}>
                {step}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
