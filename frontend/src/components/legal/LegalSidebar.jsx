import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ChevronRight,
  HelpCircle,
  Phone,
  Trash2,
} from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

export const LegalMobileQuickNav = ({ items, activeSection, onSelectSection }) => {
  return (
    <div className="lg:hidden sticky top-[95px] sm:top-[105px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2 px-4 overflow-x-auto scrollbar-none shadow-xs">
      <div className="flex items-center gap-2 w-max text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Jump To:</span>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`px-3 py-1.5 rounded-full shrink-0 font-semibold transition-all ${
              activeSection === item.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export const LegalDesktopSidebar = ({ items, activeSection, onSelectSection }) => {
  return (
    <aside className="hidden lg:block lg:col-span-4 sticky top-36 space-y-5">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>TABLE OF CONTENTS</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {items.length} Sections
          </span>
        </div>

        <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1 text-xs scrollbar-thin">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/30 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <span className="truncate">{item.title}</span>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                  activeSection === item.id ? 'text-blue-600 translate-x-0.5' : 'text-slate-400 group-hover:text-blue-600'
                }`}
              />
            </button>
          ))}
        </nav>
      </div>

      {/* Colorful Help & Deletion Box */}
      <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-cyan-50/60 rounded-3xl border border-blue-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Need Immediate Help?</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Have questions about rental rules, security deposit refunds, or trip insurance? Our 24/7 concierge is standing by.
        </p>
        <div className="pt-1 flex flex-col gap-2">
          <a
            href={CONTACT_CONFIG.phoneTel}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Concierge: {CONTACT_CONFIG.phoneDisplay}</span>
          </a>
          <Link
            to="/account-deletion"
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 font-bold text-xs transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Request Account Deletion</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
