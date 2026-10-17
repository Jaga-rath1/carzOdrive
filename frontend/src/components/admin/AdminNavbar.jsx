import React from 'react';
import { Menu, ShieldCheck, Sparkles, User, Bell } from 'lucide-react';
import { getCurrentUser } from '../../services/api';

export const AdminNavbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const currentUser = getCurrentUser() || { name: 'Super Admin', email: 'admin@carzodrive.com', role: 'SUPER_ADMIN' };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-zinc-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 text-zinc-700 hover:text-black rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 lg:hidden cursor-pointer transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Operations Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-black text-zinc-950 leading-tight">
              {currentUser?.name || 'CarzoDrive Lead'}
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Fleet Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
