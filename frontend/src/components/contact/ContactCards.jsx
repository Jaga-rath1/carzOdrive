import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '../common/Container';
import { CONTACT_CONFIG } from '../../config/contact';

export const ContactCards = () => {
  return (
    <section className="relative -mt-10 sm:-mt-14 z-20 mb-16">
      <Container>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {/* Phone */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">Phone</span>
              <a href={CONTACT_CONFIG.phoneTel} className="text-sm font-bold text-slate-950 hover:text-blue-600 transition-colors block truncate">
                {CONTACT_CONFIG.phoneDisplay}
              </a>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Toll-Free 24/7 Helpline</span>
            </div>
          </div>

          {/* Email */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">Email</span>
              <a href={CONTACT_CONFIG.emailMailto} className="text-sm font-bold text-slate-950 hover:text-blue-600 transition-colors block truncate">
                {CONTACT_CONFIG.email}
              </a>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Response under 15 mins</span>
            </div>
          </div>

          {/* Office */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">Office</span>
              <span className="text-sm font-bold text-slate-950 block truncate">
                CARZODRIVE Tower, Infocity
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Bhubaneswar, Odisha</span>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">Working Hours</span>
              <span className="text-sm font-bold text-slate-950 block">
                24/7 Operations
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Desk: 7:00 AM – 11:00 PM</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
