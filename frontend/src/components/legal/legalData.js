/**
 * Legal & Compliance Navigation Data
 * Single source of truth for Table of Contents and ScrollSpy section IDs.
 */

export const PRIVACY_TOC = [
  { id: 'introduction', title: '1. Introduction & Overview', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'data-collected', title: '2. Information We Collect', color: 'text-indigo-600', badgeBg: 'bg-indigo-100 text-indigo-700' },
  { id: 'kyc-data', title: '3. Identity Verification & KYC', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'data-not-collected', title: '4. Information We Do NOT Collect', color: 'text-rose-600', badgeBg: 'bg-rose-100 text-rose-700' },
  { id: 'how-we-use', title: '5. Purpose of Data Processing', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'storage-security', title: '6. Storage & Security Practices', color: 'text-cyan-600', badgeBg: 'bg-cyan-100 text-cyan-700' },
  { id: 'sharing-disclosure', title: '7. Third-Party Sharing', color: 'text-violet-600', badgeBg: 'bg-violet-100 text-violet-700' },
  { id: 'retention', title: '8. Data Retention & Lifecycle', color: 'text-amber-600', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'user-rights', title: '9. Rights as a Data Principal', color: 'text-teal-600', badgeBg: 'bg-teal-100 text-teal-700' },
  { id: 'deletion-process', title: '10. Account & Data Deletion', color: 'text-red-600', badgeBg: 'bg-red-100 text-red-700' },
  { id: 'children', title: '11. Age Restrictions & Children', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'grievance', title: '12. Grievance Officer & Contact', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
];

export const TERMS_TOC = [
  { id: 'terms-introduction', title: '1. Preamble & Agreement', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'terms-eligibility', title: '2. Eligibility & Driving License', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'terms-booking-deposit', title: '3. Handover & Deposit Refund', color: 'text-amber-600', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'terms-tariffs-fuel', title: '4. Tariff, Fuel & Odometer', color: 'text-purple-600', badgeBg: 'bg-purple-100 text-purple-700' },
  { id: 'terms-permitted-use', title: '5. Strict Prohibitions', color: 'text-rose-600', badgeBg: 'bg-rose-100 text-rose-700' },
  { id: 'terms-speed-challans', title: '6. Speed Limits, FASTag & Fines', color: 'text-orange-600', badgeBg: 'bg-orange-100 text-orange-700' },
  { id: 'terms-insurance-damage', title: '7. Insurance & Damage Cap', color: 'text-teal-600', badgeBg: 'bg-teal-100 text-teal-700' },
  { id: 'terms-breakdown-rsa', title: '8. 24/7 Roadside Assistance', color: 'text-cyan-600', badgeBg: 'bg-cyan-100 text-cyan-700' },
  { id: 'terms-cancellation', title: '9. Cancellation & Refund Slabs', color: 'text-indigo-600', badgeBg: 'bg-indigo-100 text-indigo-700' },
  { id: 'terms-fleet-partner', title: '10. Fleet Host & Vendor Terms', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'terms-driver-partner', title: '11. Driver Code of Conduct', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'terms-app-license', title: '12. Google Play License & IP', color: 'text-purple-600', badgeBg: 'bg-purple-100 text-purple-700' },
  { id: 'terms-indemnity', title: '13. Indemnity & Liability Limit', color: 'text-slate-600', badgeBg: 'bg-slate-100 text-slate-700' },
  { id: 'terms-governing-law', title: '14. Governing Law & Arbitration', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'terms-support', title: '15. Concierge & Grievance Desk', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
];

export const DELETION_TOC = [
  { id: 'online-deletion-form', title: '1. Online Request Form', color: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'in-app-deletion-guide', title: '2. Mobile App Deletion Guide', color: 'text-indigo-600', badgeBg: 'bg-indigo-100 text-indigo-700' },
  { id: 'statutory-retention-notice', title: '3. Data Retention & Policy', color: 'text-amber-600', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'compliance-helpdesk', title: '4. Grievance & Concierge Desk', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' },
];

export const TOC_BY_TAB = {
  privacy: PRIVACY_TOC,
  terms: TERMS_TOC,
  deletion: DELETION_TOC,
};
