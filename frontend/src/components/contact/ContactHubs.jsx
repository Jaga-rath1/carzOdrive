import React from 'react';
import { Navigation, MapPin, ShieldCheck, Headphones } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

export const ContactHubs = () => {
  return (
    <div className="space-y-6">
      {/* Map Placeholder Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Flagship Mobility Hub
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            Live Dispatch
          </span>
        </div>

        {/* Map Visual Representation */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
            alt="CARZODRIVE Location Map"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Pulsing Pin Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500/40 rounded-full animate-ping absolute" />
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white relative z-10">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-slate-950/90 text-white text-[11px] font-black border border-white/20 backdrop-blur-md shadow-lg">
              CARZODRIVE Flagship Hub
            </div>
          </div>

          {/* Bottom Map Badge */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 text-slate-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-black">CarzoDrive, Kalinga Nagar, Bhubaneswar</div>

            </div>
            <a
              href="https://www.google.com/maps/@20.2605665,85.7603121,21z/data=!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>Directions</span>
              <Navigation className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              <strong>Central Address:</strong> Plot 142, CARZODRIVE Mobility Hub, Near Infocity Square, Patia, Bhubaneswar, Odisha 751024
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Doorstep vehicle deliveries available across <strong>Bhubaneswar, Cuttack & Puri</strong> within 45 minutes of booking confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Card */}
      <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-800 block">
            Active Trip Roadside Assistance
          </span>
          <a href={CONTACT_CONFIG.phoneTel} className="text-lg font-black text-slate-950 hover:text-blue-600 transition-colors font-mono">
            {CONTACT_CONFIG.phoneDisplay} (Ext 1)
          </a>
          <span className="text-[11px] text-slate-600 block">Immediate dispatch for towing, flat tires, or mechanical help.</span>
        </div>
      </div>
    </div>
  );
};
