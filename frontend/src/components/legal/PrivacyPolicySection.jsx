import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  CheckCircle2,
  EyeOff,
  Lock,
  Database,
  KeyRound,
  ArrowRight,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

const NOT_COLLECTED_ITEMS = [
  {
    title: 'No Payment Card Data',
    desc: 'We never store credit/debit card numbers, CVVs, or Net Banking PINs on our servers.',
  },
  {
    title: 'No In-Cabin Recording',
    desc: 'Vehicles are not equipped with interior microphones or cabin voice recording equipment.',
  },
  {
    title: 'No Biometric Records',
    desc: 'We do not capture or store fingerprints, facial geometry, or iris scans.',
  },
  {
    title: 'No Social Chat or Call Audio',
    desc: 'CARZODRIVE is purely a mobility platform with zero social networking or live chat rooms.',
  },
];

const PROCESSING_PURPOSES = [
  'Verifying driving eligibility and insurance compliance prior to vehicle handover.',
  'Processing booking confirmations, generating digital GST Tax Invoices (SAC Code 996411), and issuing booking vouchers.',
  'Delivering vehicles to designated pickup hubs or customer doorsteps.',
  'Providing 24/7 emergency concierge, roadside assistance, and mechanical breakdown support.',
  'Processing security deposit refunds within 24 hours of vehicle return.',
  'Disbursing earnings to vehicle hosts and driver partner commissions.',
  'Sending essential transaction updates, booking reminders, and receipts via WhatsApp, SMS, or Email.',
  'Complying with statutory reporting requirements under transport and tax regulations.',
];

const DPDP_RIGHTS = [
  {
    title: 'Right to Access',
    desc: 'You may request a summary of the personal data we hold about you and the processing activities undertaken.',
  },
  {
    title: 'Right to Correction & Rectification',
    desc: 'You may update inaccurate or obsolete personal details through your profile or by contacting our concierge.',
  },
  {
    title: 'Right to Erasure / Account Deletion',
    desc: 'You have the right to request the deletion of your account and erasure of non-statutory personal data.',
  },
  {
    title: 'Right to Nominate',
    desc: 'You may nominate an individual to exercise your rights in the event of death or incapacity.',
  },
  {
    title: 'Right of Grievance Redressal',
    desc: 'You have the right to register a formal grievance with our dedicated Grievance Officer.',
  },
];

export const PrivacyPolicySection = () => {
  return (
    <>
      {/* 1. Introduction & Overview */}
      <section id="introduction" className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            1
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Corporate Scope</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1. Introduction & Overview</h2>
          </div>
        </div>

        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            Welcome to <strong className="text-slate-900 font-bold">CARZODRIVE</strong> (referred to herein as <strong className="text-slate-900 font-bold">"CARZODRIVE", "we", "us", or "our"</strong>), operated by <strong className="text-slate-900 font-bold">Nexnuv Private Limited</strong>. We provide vehicle rental and curated mobility solutions, including self-drive cars, self-drive superbikes, executive cars with chauffeur, on-demand driver-only services, and bespoke road trip packages across Odisha and India.
          </p>
          <p>
            This Privacy Policy describes our practices concerning the collection, verification, use, storage, and disclosure of personal data when you use our website (<code className="text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-xs font-semibold">carzodrive.com</code>), mobile applications, customer portal, and offline vehicle delivery hubs.
          </p>
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-4.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 mb-1">⚖️ Statutory Publication Notice:</p>
            This policy is published in accordance with the provisions of the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
          </div>
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section id="data-collected" className="bg-white rounded-3xl border border-indigo-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-indigo-500/20">
            2
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Data Architecture</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">2. Information We Collect</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          To deliver reliable vehicle rental and transport services, we collect information you provide directly to us when registering, booking, or interacting with our concierge desk:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 rounded-2xl border border-blue-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[11px] flex items-center justify-center font-bold text-blue-700">A</span>
              Customer Account & Contact Details
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full name, registered email address, mobile phone number, residential address, city, and secure password hash when creating an account or reserving as a guest.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/30 rounded-2xl border border-indigo-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-[11px] flex items-center justify-center font-bold text-indigo-700">B</span>
              Booking & Itinerary Data
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vehicle selection, rental dates and duration, pickup and drop-off hubs (e.g. SUM Hospital, Bhubaneswar Airport, DN Regalia, Cuttack, Puri), flight/train arrival details where applicable, special instructions, and odometer readings recorded at delivery and return.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50/60 to-pink-50/30 rounded-2xl border border-purple-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[11px] flex items-center justify-center font-bold text-purple-700">C</span>
              Host / Fleet Partner Information
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Business name, PAN card number, GSTIN, Vehicle Registration Certificate (RC), commercial insurance policy copy, vehicle fitness certificate, and bank account / UPI ID details strictly required for disbursing fleet earnings.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 rounded-2xl border border-emerald-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-[11px] flex items-center justify-center font-bold text-emerald-700">D</span>
              Driver Partner Information
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commercial driver's license number, commercial badge details, years of driving experience, police verification certificates, and contact credentials.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50/60 to-blue-50/30 rounded-2xl border border-cyan-200/80 p-5 space-y-2 md:col-span-2">
            <h3 className="text-sm font-bold text-cyan-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-100 text-[11px] flex items-center justify-center font-bold text-cyan-700">E</span>
              Technical, Device & Usage Data
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              IP address, device identifiers, operating system version, browser type, app version, language preference, crash logs, and session cookies for maintaining authentication.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Identity Verification & Motor Vehicle KYC */}
      <section id="kyc-data" className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-emerald-500/20">
            3
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Statutory Mandate</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">3. Identity Verification & Motor Vehicle KYC</h2>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200 rounded-2xl p-5 mb-5 space-y-2">
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
      <section id="data-not-collected" className="bg-white rounded-3xl border border-rose-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-rose-500/20">
            4
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Strict Privacy Boundaries</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">4. Information We Do NOT Collect</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          To provide transparency and protect your peace of mind, CARZODRIVE explicitly does <strong className="text-slate-900">NOT</strong> collect or store:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NOT_COLLECTED_ITEMS.map((item, idx) => (
            <div key={idx} className="p-4.5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-red-50/30 border border-rose-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11.5px] text-slate-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Purpose of Data Processing */}
      <section id="how-we-use" className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            5
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Processing Rationale</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">5. Purpose of Data Processing</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          We process your personal data solely for specific, legitimate operational purposes:
        </p>

        <div className="space-y-2.5 text-xs text-slate-700">
          {PROCESSING_PURPOSES.map((purpose, index) => (
            <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 p-3.5 rounded-2xl border border-blue-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{purpose}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Storage, Encryption & Security Practices */}
      <section id="storage-security" className="bg-white rounded-3xl border border-cyan-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-cyan-500/20">
            6
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">Data Fortification</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">6. Storage, Encryption & Security Practices</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          CARZODRIVE employs industry-standard technical and organizational security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 p-5 rounded-2xl border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">Data in Transit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All network communications are encrypted using modern Transport Layer Security (<strong className="text-slate-900">TLS 1.2 / TLS 1.3</strong>) protocols.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50/60 to-blue-50/30 p-5 rounded-2xl border border-cyan-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">Data at Rest</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Databases and media stores are encrypted at rest using <strong className="text-slate-900">AES-256</strong> standard encryption algorithms.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
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
      <section id="sharing-disclosure" className="bg-white rounded-3xl border border-violet-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-violet-500/20">
            7
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">Zero Selling Policy</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">7. Third-Party Sharing & Statutory Disclosures</h2>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-900">We do not sell, rent, or trade your personal information to third-party marketing companies.</strong> Data is shared only with verified service partners strictly necessary to provide the service:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/30 rounded-2xl border border-blue-200 text-xs space-y-1">
              <strong className="text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Payment Aggregators (Cashfree Payments India / UPI)
              </strong>
              <p className="text-slate-600 pl-5">
                To process advance payments, card transactions, and automated refund transfers in compliance with Reserve Bank of India (RBI) guidelines.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-cyan-50/60 to-blue-50/30 rounded-2xl border border-cyan-200 text-xs space-y-1">
              <strong className="text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Cloud Storage & Document Infrastructure
              </strong>
              <p className="text-slate-600 pl-5">
                Encrypted media hosting (Cloudinary) for securely storing vehicle photos and KYC documents.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50/60 to-teal-50/30 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <strong className="text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Communication Infrastructure
              </strong>
              <p className="text-slate-600 pl-5">
                WhatsApp Business API and transactional messaging providers to deliver booking vouchers and live trip updates.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200 text-xs space-y-1 text-amber-950">
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
      <section id="retention" className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-amber-500/20">
            8
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Statutory Timelines</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">8. Data Retention & Lifecycle Policy</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or to comply with statutory legal requirements:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 p-5 rounded-2xl border border-blue-200 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Account Lifecycle</span>
            <h4 className="text-sm font-bold text-slate-950">Active Account Data</h4>
            <p className="text-slate-600 leading-relaxed">
              Maintained for the duration of your active relationship with CARZODRIVE.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/30 p-5 rounded-2xl border border-amber-200 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">7 to 8 Years</span>
            <h4 className="text-sm font-bold text-slate-950">Tax Invoices & Financials</h4>
            <p className="text-slate-600 leading-relaxed">
              Retained in compliance with the Goods and Services Tax (GST) Act, 2017 and Indian Income Tax regulations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 p-5 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Minimum 3 Years</span>
            <h4 className="text-sm font-bold text-slate-950">KYC & Trip Manifests</h4>
            <p className="text-slate-600 leading-relaxed">
              Retained following trip completion to support insurance claims, vehicle damage audits, and road transport regulatory inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Your Rights as a Data Principal (DPDP Act, 2023) */}
      <section id="user-rights" className="bg-white rounded-3xl border border-teal-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-teal-500/20">
            9
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Citizen Rights</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">9. Your Rights as a Data Principal (DPDP Act, 2023)</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Under the <strong className="text-slate-900">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, you possess clear rights regarding your personal information:
        </p>

        <div className="space-y-3">
          {DPDP_RIGHTS.map((right, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-r from-teal-50/50 to-emerald-50/30 rounded-2xl border border-teal-100 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
      <section id="deletion-process" className="bg-white rounded-3xl border border-red-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-red-500/20">
            10
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Google Play & DPDP Standard</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">10. Account & Data Deletion</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          You can easily request account deletion through either of the following sanctioned channels:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 p-5 rounded-2xl border border-blue-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Channel A</span>
              <h4 className="text-sm font-bold text-slate-950 mt-1">Web Deletion Request</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Visit our dedicated public Account Deletion Portal to submit a request with your registered email and mobile number.
              </p>
            </div>
            <Link
              to="/account-deletion"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <span>Open Deletion Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 p-5 rounded-2xl border border-emerald-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Channel B</span>
              <h4 className="text-sm font-bold text-slate-950 mt-1">Direct Email Request</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Send an email from your registered address to <code className="text-blue-700 bg-white border border-slate-200 px-1 py-0.5 rounded text-[11px]">{CONTACT_CONFIG.gmail}</code> with the subject line "Account Deletion Request".
              </p>
            </div>
            <a
              href={`${CONTACT_CONFIG.gmailMailto}?subject=Account%20Deletion%20Request`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors border border-slate-300 shadow-xs"
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
      <section id="children" className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            11
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Eligibility Policy</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">11. Age Restrictions & Children's Privacy</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          Our services are strictly directed to individuals who are <strong className="text-slate-900 font-bold">at least 18 years of age</strong> (and 21+ for certain performance/luxury self-drive categories) who legally possess an unexpired motor vehicle driving license. We do not knowingly solicit or collect personal data from minors under 18 years of age.
        </p>
      </section>

      {/* 12. Grievance Officer & Contact Information */}
      <section id="grievance" className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-cyan-50/60 rounded-3xl border border-blue-200 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            12
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Redressal</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">12. Grievance Redressal Officer & Contact Info</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          In accordance with the <strong className="text-slate-900">Information Technology Act, 2000</strong> and the <strong className="text-slate-900">DPDP Act, 2023</strong>, the details of the designated Grievance Officer for CARZODRIVE are provided below:
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
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
              <p className="font-medium text-slate-700 leading-relaxed">{CONTACT_CONFIG.officeLocation}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium block">Email:</span>
              <a
                href={CONTACT_CONFIG.gmailMailto}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{CONTACT_CONFIG.gmail}</span>
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium block">Official Contact:</span>
              <a
                href={CONTACT_CONFIG.phoneTel}
                className="font-bold text-slate-950 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{CONTACT_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>

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
    </>
  );
};
