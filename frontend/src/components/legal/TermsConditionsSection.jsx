import React from 'react';
import {
  Scale,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Fuel,
  Gauge,
  Clock,
  AlertOctagon,
  Car,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Phone,
} from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

const PROHIBITED_ACTS = [
  {
    title: 'Intoxication & Driving Under the Influence',
    desc: 'Operating vehicle while under the influence of alcohol, drugs, prescription narcotics, or any psychoactive substance (Zero Tolerance under Section 185 of Motor Vehicles Act).',
  },
  {
    title: 'Sub-Leasing & Commercial Fare Carriage',
    desc: 'Using vehicle as an unauthorized commercial taxi, stage carriage, or re-renting to any third party who was not verified by CARZODRIVE.',
  },
  {
    title: 'Racing, Speed Testing & Stunts',
    desc: 'Participating in rallies, speed contests, drifting, track days, burnout stunts, or non-road endurance trials.',
  },
  {
    title: 'Transporting Prohibited or Hazardous Goods',
    desc: 'Carrying firearms, narcotics, contraband, smuggled goods, explosives, or highly flammable substances.',
  },
  {
    title: 'Overloading Beyond Permitted Seating Capacity',
    desc: 'Carrying passengers or luggage in excess of manufacturer certified capacity specified in the vehicle Registration Certificate (RC).',
  },
];

const CANCELLATION_SLABS = [
  {
    window: '> 48 hours before pickup',
    refund: '100% Refund (less payment gateway fee)',
    rowClass: 'hover:bg-emerald-50/40',
    refundClass: 'text-emerald-700',
  },
  {
    window: '24 to 48 hours before pickup',
    refund: '75% Refund',
    rowClass: 'hover:bg-blue-50/40',
    refundClass: 'text-blue-700',
  },
  {
    window: '12 to 24 hours before pickup',
    refund: '50% Refund',
    rowClass: 'hover:bg-amber-50/40',
    refundClass: 'text-amber-700',
  },
  {
    window: '< 12 hours before pickup or No-Show',
    refund: 'Non-refundable (Rescheduling allowed)',
    rowClass: 'hover:bg-rose-50/40',
    refundClass: 'text-rose-600',
  },
];

export const TermsConditionsSection = () => {
  return (
    <>
      {/* 1. Preamble & Agreement */}
      <section
        id="terms-introduction"
        className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(37,99,235,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            1
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Contractual Agreement</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1. Preamble & Agreement to Terms</h2>
          </div>
        </div>

        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            This User Agreement and Vehicle Rental Terms of Service (referred to as <strong className="text-slate-900 font-bold">"Terms"</strong>) constitute a legally binding electronic contract between you (<strong className="text-slate-900 font-semibold">"Customer", "Renter", "User", or "You"</strong>) and <strong className="text-slate-900 font-semibold">Nexnuv Private Limited</strong>, doing business as <strong className="text-slate-900 font-semibold">CARZODRIVE</strong> (<strong className="text-slate-900 font-semibold">"Company", "we", "us", or "our"</strong>).
          </p>
          <p>
            By installing our Google Play Android Application, browsing <code className="text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-xs font-semibold">carzodrive.com</code>, completing registration, reserving a vehicle, or taking physical delivery of any self-drive car or motorbike, you expressly acknowledge that you have read, understood, and agreed to be governed by these Terms.
          </p>
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-5 text-xs text-blue-950">
            <p className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Statutory Enforcement & E-Commerce Notice:</span>
            </p>
            These Terms are published in full compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, and the <strong>Motor Vehicles Act, 1988</strong> as amended. If you do not agree to these terms, you must not access our application or proceed with any vehicle handover.
          </div>
        </div>
      </section>

      {/* 2. User Eligibility & Driving License Requirements */}
      <section
        id="terms-eligibility"
        className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(16,185,129,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-emerald-500/20">
            2
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Renter Qualifications</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">2. User Eligibility & Driving License</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Vehicle custody is strictly conditioned upon verified legal eligibility under the <strong className="text-slate-900">Motor Vehicles Act, 1988</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 rounded-2xl border border-emerald-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Minimum Age Threshold
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The renter must be at least <strong className="text-slate-900 font-bold">18 years of age</strong> for commuter bikes and hatchback/sedan self-drive cars, and at least <strong className="text-slate-900 font-bold">21 years of age</strong> for premium SUVs, luxury sedans, and high-displacement superbikes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 rounded-2xl border border-blue-200/80 p-5 space-y-2">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Original Physical Driving License (DL)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              A valid, unexpired, smart-card Driving License issued by a recognized Indian RTO (or valid International Driving Permit for foreign nationals) for Light Motor Vehicles (LMV) or Motorcycle with Gear (MCWG).
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/30 rounded-2xl border border-purple-200/80 p-5 space-y-2 md:col-span-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Physical Verification at Vehicle Handover
            </h3>
            <p className="text-slate-600 leading-relaxed">
              At the time of delivery, the renter who made the booking must physically present their original Driving License and original Government Photo ID (Aadhaar/Passport). Handing over keys to unauthorized proxies is strictly illegal.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Booking, Handover & Security Deposit */}
      <section
        id="terms-booking-deposit"
        className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(245,158,11,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-amber-500/20">
            3
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Rental Process & Guarantee</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">3. Booking, Handover & Security Deposit</h2>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            A booking reservation is confirmed only upon successful processing of the advance rental fare through our integrated payment partner (Cashfree Payments India / UPI).
          </p>

          <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50/50 rounded-2xl border-2 border-amber-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <span>100% Security Deposit Refund Guarantee Within 24 Hours</span>
            </div>
            <p className="text-xs text-amber-950/90 leading-relaxed">
              A refundable security deposit (ranging from ₹1,000 to ₹5,000 depending on vehicle tier) is collected prior to key handover. Upon on-time return with verified odometer, fuel level, and joint inspection clearance, <strong className="text-amber-950 font-bold">100% of the deposit is refunded within 24 hours</strong> directly to your source bank account / UPI ID.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Joint Handover Checklist Inspection
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Prior to departing the delivery hub, both the CARZODRIVE fleet executive and the customer jointly sign off on digital inspection photos capturing odometer reading, fuel level, existing minor cosmetic marks, and tool kit availability.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Tariff, Fuel & Odometer Policy */}
      <section
        id="terms-tariffs-fuel"
        className="bg-white rounded-3xl border border-purple-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(168,85,247,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-purple-500/20">
            4
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Fair Billing Architecture</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">4. Tariff, Fuel & Odometer Policy</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-gradient-to-br from-purple-50/70 to-indigo-50/40 rounded-2xl border border-purple-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full inline-block">
              Fuel Rule
            </span>
            <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-purple-600" />
              Like-to-Like Basis
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Vehicles are delivered with a recorded fuel level. The vehicle must be returned with the same fuel level. Any fuel shortfall is deducted at actual prevailing petrol/diesel rates.
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 rounded-2xl border border-indigo-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full inline-block">
              Kilometre Allowance
            </span>
            <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-indigo-600" />
              Transparent Rates
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Depending on chosen plan (e.g. 150 km/day, 300 km/day, or Unlimited km). Extra kilometres beyond package allowance are billed at transparent per-km rates (₹6 to ₹14/km).
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-2xl border border-emerald-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block">
              Grace Period
            </span>
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              30-Min Drop-Off
            </h4>
            <p className="text-slate-600 leading-relaxed">
              A 30-minute grace period is provided for vehicle drop-off. Delays beyond 30 minutes without prior extension incur standard hourly extension fees.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Permitted Use & Strict Prohibitions */}
      <section
        id="terms-permitted-use"
        className="bg-white rounded-3xl border border-rose-200/90 p-6 sm:p-9 shadow-[0_4px_25px_rgba(244,63,94,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-rose-500/20">
            5
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Zero Tolerance Boundaries</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">5. Permitted Use & Strict Prohibitions</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Vehicles leased from CARZODRIVE may only be driven for lawful personal and tourism mobility. The following acts constitute an immediate, irrecoverable breach of contract resulting in immediate vehicle repossession, total forfeiture of security deposit, and reporting to police authorities:
        </p>

        <div className="space-y-3 text-xs">
          {PROHIBITED_ACTS.map((item, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-rose-50/70 to-red-50/40 rounded-2xl border border-rose-200/80 flex items-start gap-3.5">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-950">{item.title}</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Speed Limits, FASTag & E-Challans */}
      <section
        id="terms-speed-challans"
        className="bg-white rounded-3xl border border-orange-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(249,115,22,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-orange-500/20">
            6
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Road Safety & Fines</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">6. Speed Limits, FASTag & E-Challans</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 bg-gradient-to-r from-orange-50/60 to-amber-50/40 rounded-2xl border border-orange-200/80 space-y-1.5">
            <h4 className="text-sm font-bold text-orange-950 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-orange-600" />
              National & State Speed Governors:
            </h4>
            <p>
              In compliance with statutory road transport safety mandates, vehicles are fitted with electronic speed governors or GPS telemetry alerting when driving speeds exceed <strong>80 km/h</strong> on state highways or <strong>100 km/h</strong> on national expressways. Repeated overspeeding alerts incur statutory safety penalties.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/40 rounded-2xl border border-blue-200/80 space-y-1.5">
            <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              FASTag Electronic Toll Collections:
            </h4>
            <p>
              All CARZODRIVE four-wheelers are equipped with active FASTag stickers. Toll charges incurred during your trip duration are deducted from the security deposit or settled at vehicle check-in with transparent digital toll receipts.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-rose-50/60 to-red-50/40 rounded-2xl border border-rose-200/80 space-y-1.5 text-rose-950">
            <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Traffic Violations & Police E-Challans:
            </h4>
            <p>
              The Customer is 100% personally, financially, and legally responsible for any traffic e-challans, wrong-parking fines, red-light jumps, or helmet violations captured by traffic surveillance cameras during the active rental period.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Commercial Insurance & Damage Liability */}
      <section
        id="terms-insurance-damage"
        className="bg-white rounded-3xl border border-teal-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(20,184,166,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-teal-500/20">
            7
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Asset Protection</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">7. Commercial Insurance & Damage Liability</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p className="text-sm">
            All CARZODRIVE fleet vehicles hold valid, active comprehensive commercial motor insurance covering Third-Party Liability and Own-Damage (OD) as required by the Motor Vehicles Act.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Standard Maximum Liability Cap
              </h4>
              <p className="text-emerald-900 leading-relaxed">
                In the unfortunate event of an accidental collision occurring during permitted, lawful driving, the customer's maximum damage liability is capped at the pre-determined insurance deductible (typically up to the security deposit amount), provided an immediate FIR/police complaint is filed where necessary.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-rose-50 to-red-50/50 rounded-2xl border border-rose-200 space-y-2">
              <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Insurance Nullification Conditions
              </h4>
              <p className="text-rose-900 leading-relaxed">
                Insurance coverage is immediately rendered void if the vehicle was operated by an unauthorized driver, driven under alcohol/narcotics, driven on flooded or off-road terrains causing hydrostatic lock, or used in deliberate violation of law. In such cases, the customer is 100% liable for all repair expenses and vehicle downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 24/7 Roadside Assistance & Breakdown */}
      <section
        id="terms-breakdown-rsa"
        className="bg-white rounded-3xl border border-cyan-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(6,182,212,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-cyan-500/20">
            8
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">24/7 Roadside Assistance (RSA)</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">8. 24/7 Roadside Assistance & Breakdown</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p className="text-sm">
            CARZODRIVE provides 24/7 emergency roadside assistance across Bhubaneswar, Cuttack, Puri, and major national highways in Odisha.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200 space-y-1">
              <span className="font-bold text-cyan-950 block">Towing Support:</span>
              Dispatched in the event of unforeseen mechanical immobilisation.
            </div>
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-1">
              <span className="font-bold text-blue-950 block">Battery Jumpstart:</span>
              Immediate support for battery discharge or electrical issues.
            </div>
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-1">
              <span className="font-bold text-teal-950 block">Flat Tyre Assistance:</span>
              Help with stepney replacement or nearby puncture repair.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600">
            <p className="text-[11.5px]">
              *In the unlikely event of an internal mechanical failure not caused by driver fault, CARZODRIVE will dispatch an alternate vehicle or issue a pro-rata refund.
            </p>
            <a
              href={CONTACT_CONFIG.phoneTel}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Emergency Desk: {CONTACT_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Cancellation, Rescheduling & Refund */}
      <section
        id="terms-cancellation"
        className="bg-white rounded-3xl border border-indigo-200/80 p-6 sm:p-9 shadow-[0_4px_25px_rgba(99,102,241,0.04)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600" />

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-indigo-500/20">
            9
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Fair Cancellation Protocol</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">9. Cancellation, Rescheduling & Refund</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          We understand that travel schedules can change unexpectedly. Our cancellation policy is transparent and automated:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-slate-100 via-blue-50/40 to-indigo-50/40 text-slate-800 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Cancellation Window</th>
                <th className="p-3.5 border-b border-slate-200">Refund on Rental Fare</th>
                <th className="p-3.5 border-b border-slate-200">Security Deposit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {CANCELLATION_SLABS.map((slab, idx) => (
                <tr key={idx} className={`${slab.rowClass} transition-colors`}>
                  <td className="p-3.5 font-bold text-slate-900">{slab.window}</td>
                  <td className={`p-3.5 font-bold ${slab.refundClass}`}>{slab.refund}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">✓ 100% Refunded</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. Fleet Host & Vendor Partner Terms */}
      <section id="terms-fleet-partner" className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            10
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Partner Fleet</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">10. Fleet Host & Vendor Partner Terms</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          Vehicle owners hosting cars or bikes on CARZODRIVE through the "Rent Your Car / Rent Your Bike" portal must maintain up-to-date Vehicle Registration Certificates (RC), commercial fitness certificates, and valid commercial insurance policies. Fleet earnings are disbursed bi-weekly directly to registered bank accounts.
        </p>
      </section>

      {/* 11. Driver Partner Code of Conduct */}
      <section id="terms-driver-partner" className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-emerald-500/20">
            11
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Professional Chauffeurs</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">11. Driver Partner Code of Conduct</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          Commercial drivers registered on CARZODRIVE must maintain professional conduct, valid commercial passenger badges, unblemished police verification records, and zero tolerance for speeding, aggressive driving, or unprofessional interactions with passengers.
        </p>
      </section>

      {/* 12. Google Play App License & IP Rights */}
      <section id="terms-app-license" className="bg-white rounded-3xl border border-purple-200/80 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-purple-500/20">
            12
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Google Play Store Compliance</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">12. Google Play App License & IP Rights</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p className="text-sm">
            Subject to your adherence to these Terms, Nexnuv Private Limited grants you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the CARZODRIVE mobile application from the Google Play Store strictly for personal mobility booking purposes.
          </p>
          <p>
            All trademarks, app designs, UI layouts, vehicle descriptions, logos, software codes, and brand graphics are the exclusive intellectual property of Nexnuv Private Limited. Reverse engineering, decompiling, or scraping of the app or website is strictly prohibited under the Information Technology Act, 2000.
          </p>
        </div>
      </section>

      {/* 13. Indemnity & Limitation of Liability */}
      <section id="terms-indemnity" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
            13
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Legal Safeguards</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">13. Indemnity & Limitation of Liability</h2>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            The Customer agrees to indemnify, defend, and hold harmless Nexnuv Private Limited, its directors, officers, employees, and fleet partners from any third-party claims, liabilities, damages, losses, or legal costs arising out of: (a) unauthorized or negligent operation of the vehicle, (b) breach of Indian traffic or criminal laws, or (c) falsification of Driving License or identity documentation.
          </p>
          <p>
            To the maximum extent permissible by law, CARZODRIVE's aggregate liability under any contract, tort, or negligence claim shall strictly not exceed the total rental fee received by the Company for that specific reservation.
          </p>
        </div>
      </section>

      {/* 14. Governing Law & Arbitration */}
      <section id="terms-governing-law" className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-9 shadow-xs">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            14
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Exclusive Territorial Jurisdiction</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">14. Governing Law & Arbitration (Bhubaneswar)</h2>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            These Terms and all rental transactions are governed by, interpreted, and construed in accordance with the laws of the Republic of India.
          </p>
          <p>
            Any dispute, controversy, or claim arising out of or relating to this agreement shall be settled through binding arbitration conducted by a sole arbitrator mutually appointed in Bhubaneswar, Odisha, in accordance with the provisions of the <strong>Arbitration and Conciliation Act, 1996</strong>. The language of arbitration shall be English.
          </p>
          <p className="font-semibold text-slate-900">
            Subject to arbitration, the competent civil and criminal courts in Bhubaneswar, Odisha shall possess sole and exclusive territorial jurisdiction.
          </p>
        </div>
      </section>

      {/* 15. Grievance Officer & Concierge Support */}
      <section
        id="terms-support"
        className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-cyan-50/60 rounded-3xl border border-blue-200 p-6 sm:p-9 shadow-xs"
      >
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
            15
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Redressal</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">15. Grievance Officer & Concierge Support</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Designated Authority</span>
            <h3 className="text-base font-black text-slate-950">Grievance & Terms Redressal Officer</h3>
            <p className="text-xs text-slate-500 font-medium">Nexnuv Private Limited / CARZODRIVE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Head Office:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{CONTACT_CONFIG.officeLocation}</p>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Direct Grievance Email:</span>
              <a href={CONTACT_CONFIG.gmailMailto} className="font-bold text-blue-600 hover:text-blue-700 mt-0.5 inline-block">
                {CONTACT_CONFIG.gmail}
              </a>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">24/7 Helpline:</span>
              <a href={CONTACT_CONFIG.phoneTel} className="font-bold text-slate-900 hover:text-blue-600 mt-0.5 inline-block">
                {CONTACT_CONFIG.phoneDisplay}
              </a>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Resolution Timeframe:</span>
              <p className="font-semibold text-emerald-700 mt-0.5">Acknowledgment within 48h; Resolution in 30 days</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
