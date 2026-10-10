import React from 'react';
import { CheckCircle2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export const VehicleDetailFeatures = ({ vehicle }) => {
  const isBike = vehicle.vehicleType === 'bike';

  const defaultFeatures = isBike
    ? [
        'ISI certified safety helmets included for rider & pillion',
        'Weatherproof 360-degree rotating mobile mount for GPS navigation',
        'Tubeless puncture-resistant road-trip tyres',
        'Electric push-button silent start & LED lighting',
        'Luggage bungees provided on request for backpacks',
      ]
    : [
        'Premium high-fidelity audio system with Bluetooth & wireless connectivity',
        'Active air purification module with ambient mood lighting',
        'Reverse parking assist with guide-lines camera',
        'Pre-activated interstate national FASTag pass',
        'Full executive interior leather comfort package',
      ];

  const featuresList = vehicle.features || defaultFeatures;
  const inclusionsList = vehicle.inclusions || [
    'Comprehensive zero-deductible insurance protection',
    'Doorstep terminal, airport, or hotel delivery',
    '24/7 dedicated CARZODRIVE roadside breakdown assistance',
    'Multi-point sanitized cabin before each departure',
  ];
  const rulesList = vehicle.rules || [
    'Valid government-issued driving license required',
    'Original Aadhaar card or Passport verified upon handover',
    'Security deposit fully refunded within 4 hours of return',
  ];

  return (
    <div className="space-y-8">
      {/* Features Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-950">Features & Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuresList.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-semibold">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inclusions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-black text-slate-950">Included with Every Rental</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inclusionsList.map((inc, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-800 font-semibold">{inc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rental Requirements & Policies */}
      <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <h4 className="text-sm font-black text-slate-950">Rental Requirements & Terms</h4>
        </div>
        <ul className="space-y-2">
          {rulesList.map((rule, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
