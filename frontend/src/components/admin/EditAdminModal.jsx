import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShieldCheck,
  Shield,
  Key,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  AlertCircle,
  Car,
  Bike,
  UserCheck,
  Calendar,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { adminsAPI } from '../../services/api';

const DEFAULT_PERMISSIONS = [
  {
    id: 'manage_cars',
    name: 'Cars Fleet Management',
    description: 'Add new cars, update fleet specifications, manage pricing and availability',
    category: 'Fleet Operations',
    icon: Car,
  },
  {
    id: 'manage_bikes',
    name: 'Bikes Fleet Management',
    description: 'Add bikes/scooters, manage rental tariffs, and control inventory status',
    category: 'Fleet Operations',
    icon: Bike,
  },
  {
    id: 'manage_drivers',
    name: 'Driver Verification & Approvals',
    description: 'Review driver KYC, verify licenses, and approve or reject driver applicants',
    category: 'Driver Operations',
    icon: UserCheck,
  },
  {
    id: 'manage_bookings',
    name: 'Bookings & Reservations',
    description: 'Oversee vehicle reservations, update trip statuses, and manage bookings',
    category: 'Reservations',
    icon: Calendar,
  },
  {
    id: 'manage_staff',
    name: 'Staff & Access Control',
    description: 'Add team members, assign operational roles, and toggle module permissions',
    category: 'Administration',
    icon: ShieldCheck,
  },
  {
    id: 'manage_rates',
    name: 'Pricing & Tour Packages',
    description: 'Manage rental price cards, security deposits, and tour itineraries',
    category: 'Financial & Commercial',
    icon: Layers,
  },
  {
    id: 'view_analytics',
    name: 'Executive Analytics & Reports',
    description: 'Access fleet performance, revenue reports, driver payouts, and platform KPIs',
    category: 'Financial & Commercial',
    icon: BarChart3,
  },
];

const ROLE_OPTIONS = [
  {
    id: 'OPERATIONS_ADMIN',
    label: 'Operations Manager',
    desc: 'Oversees car/bike fleet inventory, driver onboarding, and trip dispatches',
    defaultPerms: ['manage_cars', 'manage_bikes', 'manage_drivers', 'manage_bookings'],
  },
  {
    id: 'SUPPORT_ADMIN',
    label: 'Support & Verification',
    desc: 'Focuses on driver KYC verification, support requests, and bookings',
    defaultPerms: ['manage_drivers', 'manage_bookings'],
  },
  {
    id: 'FINANCE_ADMIN',
    label: 'Finance & Analytics',
    desc: 'Monitors revenues, financial reports, rate structures, and settlements',
    defaultPerms: ['view_analytics', 'manage_rates', 'manage_bookings'],
  },
  {
    id: 'STAFF_ADMIN',
    label: 'Custom Staff / Sub-Admin',
    desc: 'Tailored staff account with specific granular permissions chosen below',
    defaultPerms: [],
  },
  {
    id: 'SUPER_ADMIN',
    label: 'Super Admin',
    desc: 'Master unrestricted access across all platform modules and security controls',
    defaultPerms: [
      'manage_cars',
      'manage_bikes',
      'manage_drivers',
      'manage_bookings',
      'manage_staff',
      'manage_rates',
      'view_analytics',
    ],
  },
];

export const EditAdminModal = ({ isOpen, onClose, admin, onSuccess, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STAFF_ADMIN',
    status: 'ACTIVE',
    password: '',
    permissions: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        role: admin.role || 'STAFF_ADMIN',
        status: admin.status || 'ACTIVE',
        password: '',
        permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
      });
      setError(null);
    }
  }, [admin]);

  const handleRoleChange = (newRole) => {
    const roleConfig = ROLE_OPTIONS.find((r) => r.id === newRole);
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      // If switching to Super Admin, auto-populate all
      permissions:
        newRole === 'SUPER_ADMIN'
          ? DEFAULT_PERMISSIONS.map((p) => p.id)
          : roleConfig && prev.permissions.length === 0
          ? [...roleConfig.defaultPerms]
          : prev.permissions,
    }));
  };

  const togglePermission = (permId) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: DEFAULT_PERMISSIONS.map((p) => p.id),
    }));
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin?._id) return;
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide the full name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions,
      };

      if (formData.password && formData.password.length >= 8) {
        payload.password = formData.password;
      }

      const res = await adminsAPI.update(admin._id, payload);
      if (onSuccess) {
        onSuccess(res?.data || res);
      }
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update admin permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !admin || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">
                Edit Access & Permissions
              </h2>
              <p className="text-xs text-zinc-500">
                Managing access privileges for <strong className="text-zinc-900">{admin.name}</strong> ({admin.email})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* User Details & Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900">
                Member Information & Status
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500">Account Status:</span>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`text-xs font-black px-3 py-1 rounded-full border outline-none cursor-pointer ${
                    formData.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <option value="ACTIVE">ACTIVE (Granted)</option>
                  <option value="SUSPENDED">SUSPENDED (Revoked)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Reset Password (Leave blank to keep existing)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    placeholder="Enter new password (min. 8 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Role Preset */}
          <div className="space-y-3">
            <span className="block text-xs font-black uppercase tracking-wider text-zinc-900 pb-1 border-b border-zinc-100">
              Assigned Role
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((r) => {
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{r.label}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {r.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900">
                Granted Capabilities ({formData.permissions.length}/{DEFAULT_PERMISSIONS.length})
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-zinc-600 hover:text-black underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-zinc-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-zinc-600 hover:text-black underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {DEFAULT_PERMISSIONS.map((perm) => {
                const isChecked = formData.permissions.includes(perm.id);
                const Icon = perm.icon;
                return (
                  <div
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`p-3 rounded-2xl border flex items-start gap-3 transition-all cursor-pointer ${
                      isChecked
                        ? 'border-zinc-900 bg-zinc-50/90 shadow-2xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 cursor-pointer accent-black"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isChecked ? 'text-black' : 'text-zinc-400'}`} />
                          <span className="text-xs font-black text-zinc-950">{perm.name}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                          {perm.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                        {perm.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(admin)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Account</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-black hover:bg-zinc-800 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Access Privileges</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
