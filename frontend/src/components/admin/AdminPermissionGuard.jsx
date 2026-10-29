import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { getCurrentUser } from '../../services/api';

const ROLE_PERMISSIONS_MAP = {
  SUPER_ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_staff',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
    'manage_settings',
  ],
  ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_staff',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
    'manage_settings',
  ],
  OPERATIONS_ADMIN: [
    'manage_cars',
    'manage_bikes',
    'manage_drivers',
    'manage_packages',
    'manage_bookings',
    'manage_rates',
    'view_analytics',
    'manage_vendors',
    'approve_vendor_fleet',
  ],
  FINANCE_ADMIN: [
    'manage_bookings',
    'manage_rates',
    'view_analytics',
  ],
  SUPPORT_ADMIN: [
    'manage_bookings',
    'manage_drivers',
  ],
  STAFF_ADMIN: [],
};

const PERMISSION_LABELS = {
  manage_cars: 'Cars Fleet Management',
  manage_bikes: 'Bikes & Scooty Fleet Management',
  manage_drivers: 'Driver & Pilot Verification',
  manage_packages: 'Odisha Tours & Travel Packages',
  manage_bookings: 'Bookings & Financial Dispatches',
  manage_staff: 'Staff & Role-Based Access Control (RBAC)',
  manage_rates: 'Pricing, Rates & Promotional Discounts',
  view_analytics: 'Financial Analytics & Performance Reports',
  manage_vendors: 'Host & Vendor Fleet Approvals',
  approve_vendor_fleet: 'Vendor Fleet Audit & Approval',
  manage_settings: 'Platform Global Settings',
};

export const AdminPermissionGuard = ({ requiredPermission, allowedRoles = [], children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  const userRole = (currentUser?.role || '').toUpperCase();
  const isAdmin = userRole.includes('ADMIN') || userRole === 'SUPER_ADMIN';

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // Super Admin has master access to all operations
  if (userRole === 'SUPER_ADMIN') {
    return children;
  }

  // Check role match
  if (allowedRoles.length > 0 && allowedRoles.some((r) => r.toUpperCase() === userRole)) {
    return children;
  }

  // Check permission match
  if (requiredPermission) {
    const roleDefaultPerms = ROLE_PERMISSIONS_MAP[userRole] || [];
    const explicitPerms = Array.isArray(currentUser.permissions) ? currentUser.permissions : [];
    const allPerms = Array.from(new Set([...roleDefaultPerms, ...explicitPerms]));

    if (allPerms.includes(requiredPermission)) {
      return children;
    }
  } else {
    return children;
  }

  // If unauthorized for this specific section, show high-end RBAC alert
  const neededLabel = PERMISSION_LABELS[requiredPermission] || requiredPermission || 'Administrative';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-[0_20px_50px_rgba(225,29,72,0.08)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
          Access Restricted • RBAC Guard
        </span>

        <h2 className="text-xl font-black text-slate-900 mb-2">Permission Required</h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Your administrative account (<span className="font-semibold text-slate-900">{userRole}</span>) does not have the{' '}
          <strong className="text-rose-600">"{neededLabel}"</strong> privilege assigned to view or manage this section.
        </p>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 mb-6 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Need access? Request permission from your Super Administrator.</span>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
