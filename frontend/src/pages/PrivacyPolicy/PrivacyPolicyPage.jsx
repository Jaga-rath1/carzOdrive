import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Trash2,
  Lock,
  EyeOff,
  Scale,
  Clock,
  Building,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  FileCheck,
  ArrowRight,
  Database,
  KeyRound,
  Send,
  X
} from 'lucide-react';
import { Container } from '../../components/common/Container';

export const PrivacyPolicyPage = ({ initialTab = 'privacy' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSection, setActiveSection] = useState('introduction');
  const [deletionModalOpen, setDeletionModalOpen] = useState(false);
  const [deletionForm, setDeletionForm] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    confirmed: false,
  });
  const [deletionSubmitted, setDeletionSubmitted] = useState(false);

  // Sync tab if route changes (e.g. /terms-and-conditions or /account-deletion)
  useEffect(() => {
    if (location.pathname.includes('terms')) {
      setActiveTab('terms');
    } else if (location.pathname.includes('account-deletion')) {
      setActiveTab('deletion');
    } else {
      setActiveTab('privacy');
    }
  }, [location.pathname]);

  // Smooth scroll handler for anchor links
  const scrollToAnchor = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -110; // offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scrollspy to update active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'introduction',
        'data-collected',
        'kyc-data',
        'data-not-collected',
        'how-we-use',
        'storage-security',
        'sharing-disclosure',
        'retention',
        'user-rights',
        'deletion-process',
        'children',
        'grievance',
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDeletionSubmit = (e) => {
    e.preventDefault();
    if (!deletionForm.email || !deletionForm.phone || !deletionForm.confirmed) return;
    setDeletionSubmitted(true);
  };

  const resetDeletionForm = () => {
    setDeletionForm({ name: '', email: '', phone: '', reason: '', confirmed: false });
    setDeletionSubmitted(false);
    setDeletionModalOpen(false);
  };

  const tableOfContents = [
    { id: 'introduction', title: '1. Introduction & Overview' },
    { id: 'data-collected', title: '2. Information We Collect' },
    { id: 'kyc-data', title: '3. Identity Verification & Motor Vehicle KYC' },
    { id: 'data-not-collected', title: '4. Information We Do NOT Collect' },
    { id: 'how-we-use', title: '5. Purpose of Data Processing' },
    { id: 'storage-security', title: '6. Storage, Encryption & Security Practices' },
    { id: 'sharing-disclosure', title: '7. Third-Party Sharing & Statutory Disclosures' },
    { id: 'retention', title: '8. Data Retention & Lifecycle Policy' },
    { id: 'user-rights', title: '9. Your Rights as a Data Principal (DPDP Act, 2023)' },
    { id: 'deletion-process', title: '10. Account & Data Deletion' },
    { id: 'children', title: "11. Age Restrictions & Children's Privacy" },
    { id: 'grievance', title: '12. Grievance Officer & Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. HERO & TOP METADATA HEADER (White Luxury Aesthetic) */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[380px] h-[280px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

        <Container className="relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Legal & Compliance</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-bold">
              {activeTab === 'terms' ? 'Terms & Conditions' : activeTab === 'deletion' ? 'Account Deletion' : 'Privacy Policy'}
            </span>
          </nav>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              LEGAL & COMPLIANCE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              DPDP ACT, 2023 COMPLIANT
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-medium shadow-sm">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Effective: Nov 01, 2026 • Last Updated: Nov 06, 2026
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Privacy Policy
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-3xl mt-4 leading-relaxed font-normal">
            How CARZODRIVE safeguards your personal data, identity documentation, and reservation details in accordance with the <strong className="text-slate-900 font-semibold">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and applicable Indian transport laws.
          </p>

          {/* Quick Tab Selector Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mt-8 pt-6 border-t border-slate-200">
            <Link
              to="/privacy-policy"
              onClick={() => setActiveTab('privacy')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-600'
                  : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'privacy' ? 'text-white' : 'text-blue-600'}`} />
              <span>Privacy Policy</span>
            </Link>

            <Link
              to="/terms-and-conditions"
              onClick={() => setActiveTab('terms')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'terms'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-600'
                  : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'terms' ? 'text-white' : 'text-blue-600'}`} />
              <span>Terms & Conditions</span>
            </Link>

            <Link
              to="/account-deletion"
              onClick={() => setActiveTab('deletion')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'deletion'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-600'
                  : 'bg-white text-slate-700 hover:text-red-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              <Trash2 className={`w-4 h-4 ${activeTab === 'deletion' ? 'text-white' : 'text-red-500'}`} />
              <span>Account Deletion (Google Play & DPDP)</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 2. BODY CONTENT SECTION (Side-by-side Table of Contents + Policy Details) */}
      <section className="py-12 sm:py-16 bg-white text-slate-900">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: Sticky Table of Contents & Quick Action Card */}
            <aside className="lg:col-span-4 sticky top-28 space-y-6">
              {/* Table of Contents Container */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Table of Contents
                  </span>
                </div>

                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 text-xs">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToAnchor(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        activeSection === item.id ? 'text-blue-600 translate-x-0.5' : 'text-slate-400 group-hover:text-blue-600'
                      }`} />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Data Assistance / Account Deletion Callout Card */}
              <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-white rounded-3xl border border-blue-200/80 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 text-blue-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Need Data Assistance?</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You can request a copy of your records or invoke account deletion at any time under DPDP Act rights.
                </p>
                <button
                  onClick={() => setDeletionModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-all shadow-sm group"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
                  <span>Request Account Deletion</span>
                </button>
              </div>

              {/* Official Grievance Quick Box */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Data Protection Officer
                </span>
                <p className="font-semibold text-slate-900">Nexnuv Private Limited</p>
                <a
                  href="mailto:carzodrive1@gmail.com"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>carzodrive1@gmail.com</span>
                </a>
              </div>
            </aside>

            {/* RIGHT COLUMN: Policy Content */}
            <main className="lg:col-span-8 space-y-8">
              {/* 1. Introduction & Overview */}
              <section id="introduction" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Corporate Scope</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">1. Introduction & Overview</h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    Welcome to <strong className="text-slate-900">CARZODRIVE</strong> (referred to herein as <strong className="text-slate-900">"CARZODRIVE", "we", "us", or "our"</strong>), operated by <strong className="text-slate-900">Nexnuv Private Limited</strong>. We provide vehicle rental and curated mobility solutions, including self-drive cars, self-drive superbikes, executive cars with chauffeur, on-demand driver-only services, and bespoke road trip packages across Odisha and India.
                  </p>
                  <p>
                    This Privacy Policy describes our practices concerning the collection, verification, use, storage, and disclosure of personal data when you use our website (<code className="text-blue-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs">carzodrive.com</code>), mobile applications, customer portal, and offline vehicle delivery hubs.
                  </p>
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4.5 text-xs text-slate-700">
                    <p className="font-bold text-slate-900 mb-1">⚖️ Statutory Publication Notice:</p>
                    This policy is published in accordance with the provisions of the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
                  </div>
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section id="data-collected" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Data Architecture</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">2. Information We Collect</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  To deliver reliable vehicle rental and transport services, we collect information you provide directly to us when registering, booking, or interacting with our concierge desk:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* A */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-2 hover:border-blue-200 transition-colors">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">A</span>
                      Customer Account & Contact Details
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Full name, registered email address, mobile phone number, residential address, city, and secure password hash when creating an account or reserving as a guest.
                    </p>
                  </div>

                  {/* B */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-2 hover:border-blue-200 transition-colors">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">B</span>
                      Booking & Itinerary Data
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Vehicle selection, rental dates and duration, pickup and drop-off hubs (e.g. SUM Hospital, Bhubaneswar Airport, DN Regalia, Cuttack, Puri), flight/train arrival details where applicable, special instructions, and odometer readings recorded at delivery and return.
                    </p>
                  </div>

                  {/* C */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-2 hover:border-blue-200 transition-colors">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">C</span>
                      Host / Fleet Partner Information
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Business name, PAN card number, GSTIN, Vehicle Registration Certificate (RC), commercial insurance policy copy, vehicle fitness certificate, and bank account / UPI ID details strictly required for disbursing fleet earnings.
                    </p>
                  </div>

                  {/* D */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-2 hover:border-blue-200 transition-colors">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">D</span>
                      Driver Partner Information
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Commercial driver's license number, commercial badge details, years of driving experience, police verification certificates, and contact credentials.
                    </p>
                  </div>

                  {/* E */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-2 md:col-span-2 hover:border-blue-200 transition-colors">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">E</span>
                      Technical, Device & Usage Data
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      IP address, device identifiers, operating system version, browser type, app version, language preference, crash logs, and session cookies for maintaining authentication.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Identity Verification & Motor Vehicle KYC */}
              <section id="kyc-data" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Statutory Mandate</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">3. Identity Verification & Motor Vehicle KYC</h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50/30 border border-emerald-200 rounded-2xl p-5 mb-5 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    Statutory Compliance under the Motor Vehicles Act, 1988
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Vehicle rental is a regulated commercial mobility service. In accordance with the <strong>Motor Vehicles Act, 1988</strong> and Central Motor Vehicles Rules, we are legally required to verify that any individual taking control of a self-drive motor vehicle holds a valid, active driving license.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <p className="font-bold text-slate-900">For all self-drive reservations, customers must provide:</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 pl-1">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">Valid Driving License (DL):</strong> DL number, expiry date, and a legible photo/PDF copy of the original physical smart card.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">Government Photo Identification:</strong> Aadhaar Card, Passport, or Voter ID to authenticate identity and residential address.
                      </div>
                    </li>
                  </ul>

                  <div className="mt-4 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950">
                    🔒 <strong className="text-blue-900">Access Restriction:</strong> All uploaded KYC documents are processed over encrypted channels and restricted to authorized CARZODRIVE operations managers. They are never published or made accessible to other users.
                  </div>
                </div>
              </section>

              {/* 4. Information We Do NOT Collect */}
              <section id="data-not-collected" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-black text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Strict Boundary</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">4. Information We Do NOT Collect</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  To provide transparency and protect your peace of mind, CARZODRIVE explicitly does <strong className="text-slate-900">NOT</strong> collect or store:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">No Payment Card Data</h4>
                      <p className="text-[11.5px] text-slate-600 mt-1">We never store credit/debit card numbers, CVVs, or Net Banking PINs on our servers.</p>
                    </div>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">No In-Cabin Recording</h4>
                      <p className="text-[11.5px] text-slate-600 mt-1">Vehicles are not equipped with interior microphones or cabin voice recording equipment.</p>
                    </div>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">No Biometric Records</h4>
                      <p className="text-[11.5px] text-slate-600 mt-1">We do not capture or store fingerprints, facial geometry, or iris scans.</p>
                    </div>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">No Social Chat or Call Audio</h4>
                      <p className="text-[11.5px] text-slate-600 mt-1">CARZODRIVE is purely a mobility platform with zero social networking or live chat rooms.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Purpose of Data Processing */}
              <section id="how-we-use" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    5
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Processing Rationale</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">5. Purpose of Data Processing</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  We process your personal data solely for specific, legitimate operational purposes:
                </p>

                <div className="space-y-2.5 text-xs text-slate-700">
                  {[
                    'Verifying driving eligibility and insurance compliance prior to vehicle handover.',
                    'Processing booking confirmations, generating digital GST Tax Invoices (SAC Code 996411), and issuing booking vouchers.',
                    'Delivering vehicles to designated pickup hubs or customer doorsteps.',
                    'Providing 24/7 emergency concierge, roadside assistance, and mechanical breakdown support.',
                    'Processing security deposit refunds within 24 hours of vehicle return.',
                    'Disbursing earnings to vehicle hosts and driver partner commissions.',
                    'Sending essential transaction updates, booking reminders, and receipts via WhatsApp, SMS, or Email.',
                    'Complying with statutory reporting requirements under transport and tax regulations.'
                  ].map((purpose, index) => (
                    <div key={index} className="flex items-start gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{purpose}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Storage, Encryption & Security Practices */}
              <section id="storage-security" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    6
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Data Fortification</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">6. Storage, Encryption & Security Practices</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  CARZODRIVE employs industry-standard technical and organizational security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-950">Data in Transit</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All network communications are encrypted using modern Transport Layer Security (<strong className="text-slate-900">TLS 1.2 / TLS 1.3</strong>) protocols.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                      <Database className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-950">Data at Rest</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Databases and media stores are encrypted at rest using <strong className="text-slate-900">AES-256</strong> standard encryption algorithms.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-950">Access Controls</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Strict <strong className="text-slate-900">Role-Based Access Control (RBAC)</strong> ensures only vetted operational managers can access KYC documentation.
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. Third-Party Sharing & Statutory Disclosures */}
              <section id="sharing-disclosure" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    7
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Zero Selling Policy</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">7. Third-Party Sharing & Statutory Disclosures</h2>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong className="text-slate-900">We do not sell, rent, or trade your personal information to third-party marketing companies.</strong> Data is shared only with verified service partners strictly necessary to provide the service:
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <strong className="text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Payment Aggregators (Cashfree Payments India / UPI)
                      </strong>
                      <p className="text-slate-600 pl-5">
                        To process advance payments, card transactions, and automated refund transfers in compliance with Reserve Bank of India (RBI) guidelines.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <strong className="text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Cloud Storage & Document Infrastructure
                      </strong>
                      <p className="text-slate-600 pl-5">
                        Encrypted media hosting (Cloudinary) for securely storing vehicle photos and KYC documents.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <strong className="text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Communication Infrastructure
                      </strong>
                      <p className="text-slate-600 pl-5">
                        WhatsApp Business API and transactional messaging providers to deliver booking vouchers and live trip updates.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-1">
                      <strong className="text-amber-900 flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-amber-700" />
                        Statutory & Law Enforcement Authorities
                      </strong>
                      <p className="text-amber-950/80 pl-5 leading-relaxed">
                        We may disclose information if required to do so by an official court order, police notice under Section 91 of the Code of Criminal Procedure, or transport department inquiry (e.g., investigating a hit-and-run, stolen vehicle, or severe traffic violation).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Data Retention & Lifecycle Policy */}
              <section id="retention" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    8
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Statutory Timelines</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">8. Data Retention & Lifecycle Policy</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or to comply with statutory legal requirements:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Account Lifecycle</span>
                    <h4 className="text-sm font-bold text-slate-950">Active Account Data</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Maintained for the duration of your active relationship with CARZODRIVE.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">7 to 8 Years</span>
                    <h4 className="text-sm font-bold text-slate-950">Tax Invoices & Financials</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Retained in compliance with the Goods and Services Tax (GST) Act, 2017 and Indian Income Tax regulations.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Minimum 3 Years</span>
                    <h4 className="text-sm font-bold text-slate-950">KYC & Trip Manifests</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Retained following trip completion to support insurance claims, vehicle damage audits, and road transport regulatory inquiries.
                    </p>
                  </div>
                </div>
              </section>

              {/* 9. Your Rights as a Data Principal (DPDP Act, 2023) */}
              <section id="user-rights" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    9
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Citizen Rights</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">9. Your Rights as a Data Principal (DPDP Act, 2023)</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Under the <strong className="text-slate-900">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, you possess clear rights regarding your personal information:
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'Right to Access', desc: 'You may request a summary of the personal data we hold about you and the processing activities undertaken.' },
                    { title: 'Right to Correction & Rectification', desc: 'You may update inaccurate or obsolete personal details through your profile or by contacting our concierge.' },
                    { title: 'Right to Erasure / Account Deletion', desc: 'You have the right to request the deletion of your account and erasure of non-statutory personal data.' },
                    { title: 'Right to Nominate', desc: 'You may nominate an individual to exercise your rights in the event of death or incapacity.' },
                    { title: 'Right of Grievance Redressal', desc: 'You have the right to register a formal grievance with our dedicated Grievance Officer.' },
                  ].map((right, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-950">{right.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 10. Account & Data Deletion */}
              <section id="deletion-process" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-black text-sm shrink-0">
                    10
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Google Play & DPDP Standard</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">10. Account & Data Deletion</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  You can easily request account deletion through either of the following sanctioned channels:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Channel A */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Channel A</span>
                      <h4 className="text-sm font-bold text-slate-950 mt-1">Web Deletion Request</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Visit our dedicated public Account Deletion Portal to submit a request with your registered email and mobile number.
                      </p>
                    </div>
                    <button
                      onClick={() => setDeletionModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <span>Open Deletion Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Channel B */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Channel B</span>
                      <h4 className="text-sm font-bold text-slate-950 mt-1">Direct Email Request</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Send an email from your registered address to <code className="text-blue-700 bg-white border border-slate-200 px-1 py-0.5 rounded text-[11px]">carzodrive1@gmail.com</code> with the subject line "Account Deletion Request".
                      </p>
                    </div>
                    <a
                      href="mailto:carzodrive1@gmail.com?subject=Account%20Deletion%20Request"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors border border-slate-300 shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Email Support Desk</span>
                    </a>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="text-slate-900 font-bold">⏱️ Processing Timeline & Verification:</p>
                  <p>Account deletion requests are acknowledged within <strong>48 hours</strong> and processed within <strong>30 days</strong> after verifying no active vehicle rentals or unsettled liabilities exist.</p>
                </div>
              </section>

              {/* 11. Age Restrictions & Children's Privacy */}
              <section id="children" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                    11
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Eligibility Policy</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">11. Age Restrictions & Children's Privacy</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Our services are strictly directed to individuals who are <strong className="text-slate-900">at least 18 years of age</strong> (and 21+ for certain performance/luxury self-drive categories) who legally possess an unexpired motor vehicle driving license. We do not knowingly solicit or collect personal data from minors under 18 years of age.
                </p>
              </section>

              {/* 12. Grievance Officer & Contact Information */}
              <section id="grievance" className="bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/40 rounded-3xl border border-blue-200/90 p-6 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                    12
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Redressal</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">12. Grievance Redressal Officer & Contact Info</h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  In accordance with the <strong className="text-slate-900">Information Technology Act, 2000</strong> and the <strong className="text-slate-900">DPDP Act, 2023</strong>, the details of the designated Grievance Officer for CARZODRIVE are provided below:
                </p>

                {/* Grievance Officer Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-sm">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Designated Authority</span>
                    <h3 className="text-lg font-black text-slate-950 mt-0.5">Grievance Redressal Officer</h3>
                    <p className="text-xs text-slate-500 font-medium">Compliance & Data Privacy Desk</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Entity:</span>
                      <p className="font-bold text-slate-900">Nexnuv Private Limited / CARZODRIVE Luxury Mobility</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Corporate Office Address:</span>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        Plot no -1774, Ananda Bana Main Road, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha, PIN - 751029
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Email:</span>
                      <a
                        href="mailto:carzodrive1@gmail.com"
                        className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span>carzodrive1@gmail.com</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Official Contact:</span>
                      <a
                        href="tel:+917377733391"
                        className="font-bold text-slate-950 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>+91 73777 33391</span>
                      </a>
                    </div>
                  </div>

                  {/* Resolution SLA Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Acknowledgment: Within 48 hours</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolution: Within 30 calendar days</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </Container>
      </section>

      {/* 3. INTERACTIVE ACCOUNT DELETION MODAL (Google Play & DPDP Statutory Flow) */}
      <AnimatePresence>
        {deletionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={resetDeletionForm}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!deletionSubmitted ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-600">DPDP Act & Google Play</span>
                      <h3 className="text-lg font-black text-slate-950">Request Account & Data Deletion</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    Submitting this form permanently initiates the erasure of your CARZODRIVE customer account, login credentials, and stored personal profile within 30 days, subject to settlement of active trips and statutory tax retention.
                  </p>

                  <form onSubmit={handleDeletionSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={deletionForm.name}
                        onChange={(e) => setDeletionForm({ ...deletionForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Registered Gmail / Email *</label>
                      <input
                        type="email"
                        required
                        value={deletionForm.email}
                        onChange={(e) => setDeletionForm({ ...deletionForm, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Registered Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={deletionForm.phone}
                        onChange={(e) => setDeletionForm({ ...deletionForm, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Reason for Deletion (Optional)</label>
                      <textarea
                        rows="2"
                        value={deletionForm.reason}
                        onChange={(e) => setDeletionForm({ ...deletionForm, reason: e.target.value })}
                        placeholder="Tell us how we can improve..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="confirmDeletion"
                        required
                        checked={deletionForm.confirmed}
                        onChange={(e) => setDeletionForm({ ...deletionForm, confirmed: e.target.checked })}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="confirmDeletion" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer select-none">
                        I confirm that I have no active or ongoing car/bike reservations with CARZODRIVE, and understand that account erasure is irreversible after completion.
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={resetDeletionForm}
                        className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-lg shadow-red-600/20"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">Deletion Request Logged</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you. We have recorded your account deletion request for <strong className="text-slate-900">{deletionForm.email}</strong>. Our data privacy compliance officer will review and confirm acknowledgment within 48 hours.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={resetDeletionForm}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
