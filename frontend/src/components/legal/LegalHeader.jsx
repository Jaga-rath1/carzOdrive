import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  FileCheck,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Container } from '../common/Container';

export const LegalHeader = ({ activeTab, onSelectTab }) => {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/30 border-b border-slate-100 overflow-hidden">
      {/* Soft Colorful Ambient Glow Orbs */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      <Container className="max-w-4xl mx-auto text-center relative z-10 px-4">
        {/* Centered Category Pill Badge with Gradient Accents */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/90 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-cyan-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>LEGAL & COMPLIANCE</span>
        </div>

        {/* Centered Main Title with Vibrant Gradient Accent */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          {activeTab === 'terms' ? (
            <>
              Terms &{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Conditions
              </span>
            </>
          ) : activeTab === 'deletion' ? (
            <>
              Account & Data{' '}
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                Deletion
              </span>
            </>
          ) : (
            <>
              Privacy{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Policy
              </span>
            </>
          )}
        </h1>

        {/* Centered Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4">
          {activeTab === 'terms'
            ? 'Official vehicle rental agreement, driving eligibility, fair tariffs, commercial insurance, and user conduct guidelines for CARZODRIVE self-drive and mobility services in India.'
            : activeTab === 'deletion'
            ? 'How CARZODRIVE processes account deletion and personal data erasure requests in compliance with Google Play Store Developer Guidelines and the Digital Personal Data Protection Act, 2023 (DPDP Act).'
            : 'How CARZODRIVE safeguards your personal data, identity documentation, and reservation details in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable Indian transport laws.'}
        </p>

        {/* Centered Dates Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-600 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Effective Date: Nov 01, 2026
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            Last Updated: Nov 06, 2026
          </span>
        </div>

        {/* Centered Tab Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link
            to="/privacy-policy"
            onClick={() => onSelectTab('privacy', 'introduction')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-102 ring-2 ring-blue-400/40'
                : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'privacy' ? 'text-white' : 'text-blue-600'}`} />
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="/terms-and-conditions"
            onClick={() => onSelectTab('terms', 'terms-introduction')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs ${
              activeTab === 'terms'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 scale-102 ring-2 ring-blue-400/40'
                : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'terms' ? 'text-white' : 'text-blue-600'}`} />
            <span>Terms & Conditions</span>
          </Link>

          <Link
            to="/account-deletion"
            onClick={() => onSelectTab('deletion', 'online-deletion-form')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs ${
              activeTab === 'deletion'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 scale-102 ring-2 ring-red-400/40'
                : 'bg-white text-slate-700 hover:text-red-600 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === 'deletion' ? 'text-white' : 'text-red-500'}`} />
            <span>Account Deletion</span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors ${
                activeTab === 'deletion'
                  ? 'bg-white/20 text-white'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200'
              }`}
            >
              GOOGLE PLAY & DPDP
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
};
