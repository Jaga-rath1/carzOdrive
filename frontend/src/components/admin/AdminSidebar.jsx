import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Bike,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  X,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Users,
  CalendarCheck,
  Compass,
  Percent
} from 'lucide-react';
import { DrivoraLogo } from '../navbar/DrivoraLogo';
import { clearAuthSession, getCurrentUser } from '../../services/api';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: LayoutDashboard,
    badge: null,
    permission: null,
  },
  {
    name: 'Bookings & Payments',
    to: '/admin/bookings',
    icon: CalendarCheck,
    badge: 'Live',
    permission: null,
  },
  {
    name: 'Discounts & Offers',
    to: '/admin/discounts',
    icon: Percent,
    badge: '5% Live',
    permission: null,
  },
  {
    name: 'Cars Fleet',
    to: '/admin/vehicles',
    icon: Car,
    badge: 'Fleet',
    permission: 'manage_cars',
  },
  {
    name: 'Bikes Fleet',
    to: '/admin/bikes',
    icon: Bike,
    badge: 'Fleet',
    permission: 'manage_bikes',
  },
  {
    name: 'Tours & Travel',
    to: '/admin/packages',
    icon: Compass,
    badge: 'Odisha',
    permission: 'manage_packages',
  },
  {
    name: 'Driver Verification',
    to: '/admin/drivers',
    icon: UserCheck,
    badge: 'Approvals',
    permission: 'manage_drivers',
  },
  {
    name: 'Rent Car & Bike Fleet',
    to: '/admin/vendor-fleet',
    icon: Users,
    badge: 'Submissions',
    permission: 'manage_cars',
  },
  {
    name: 'Staff & Access',
    to: '/admin/users',
    icon: ShieldCheck,
    badge: 'RBAC',
    permission: 'manage_staff',
  },
];

export const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isSuperAdmin = !currentUser || currentUser?.role === 'SUPER_ADMIN';
  const userPerms = currentUser?.permissions || [];

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    return userPerms.includes(item.permission);
  });

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0a1835] via-[#0f2349] to-[#071329] border-r border-blue-900/50 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Brand */}
        <div>
          <div className="p-5 border-b border-blue-900/50 flex items-center justify-between bg-[#061024]/40">
            <div className="flex flex-col">
              <DrivoraLogo theme="dark" />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-500/50" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 bg-blue-950/90 border border-blue-700/60 px-2 py-0.5 rounded-md shadow-xs">
                  Control Center
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-blue-300 hover:text-white rounded-lg bg-blue-950/80 border border-blue-800/80 lg:hidden cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-300/70">
              Management Portal
            </p>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 border border-blue-400/50'
                        : 'text-blue-100/80 hover:text-white hover:bg-blue-800/40 font-semibold border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-blue-500 text-white border-blue-300/40'
                              : 'bg-blue-950/80 text-blue-200 border-blue-800/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-blue-900/50 space-y-2 bg-[#060f22]/90">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-blue-200 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 transition-all"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Back to Client Site</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400/60" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
