import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Search,
  Filter,
  Sliders,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit3,
  Trash2,
  Crown,
  Car,
  Bike,
  UserCheck,
  Layers,
  BarChart3,
  Check,
  X
} from 'lucide-react';
import { adminsAPI, getCurrentUser } from '../../services/api';
import { AddAdminModal } from '../../components/admin/AddAdminModal';
import { EditAdminModal } from '../../components/admin/EditAdminModal';

const ROLE_INFO = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: Crown,
  },
  OPERATIONS_ADMIN: {
    label: 'Operations Manager',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: Car,
  },
  SUPPORT_ADMIN: {
    label: 'Support & Verification',
    color: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: UserCheck,
  },
  FINANCE_ADMIN: {
    label: 'Finance & Analytics',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: BarChart3,
  },
  STAFF_ADMIN: {
    label: 'Custom Staff',
    color: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    icon: Sliders,
  },
};

const PERMISSION_LABELS = {
  manage_cars: { label: 'Cars Fleet', icon: Car, bg: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  manage_bikes: { label: 'Bikes Fleet', icon: Bike, bg: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  manage_drivers: { label: 'Driver Approvals', icon: UserCheck, bg: 'bg-blue-50 text-blue-800 border-blue-200' },
  manage_bookings: { label: 'Bookings', icon: Calendar, bg: 'bg-purple-50 text-purple-800 border-purple-200' },
  manage_staff: { label: 'Staff & Access', icon: ShieldCheck, bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  manage_rates: { label: 'Pricing & Packages', icon: Layers, bg: 'bg-teal-50 text-teal-800 border-teal-200' },
  view_analytics: { label: 'Analytics Reports', icon: BarChart3, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

export const AdminUsersPage = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const currentUser = getCurrentUser();

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await adminsAPI.getAll();
      setAdmins(res?.data || []);
    } catch (err) {
      console.warn('Admin list notice:', err);
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Quick Status Toggle
  const handleToggleStatus = async (admin) => {
    const nextStatus = admin.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminsAPI.updateStatus(admin._id, nextStatus);
      setAdmins((prev) =>
        prev.map((a) => (a._id === admin._id ? { ...a, status: nextStatus } : a))
      );
      showFeedback('success', `Account status for "${admin.name}" changed to ${nextStatus}.`);
    } catch (err) {
      showFeedback('error', err?.message || 'Failed to update user status.');
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await adminsAPI.delete(deleteTarget._id);
      setAdmins((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      showFeedback('success', `Account for "${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      if (editAdmin?._id === deleteTarget._id) {
        setEditAdmin(null);
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Failed to remove user account.');
    }
  };

  // Metrics
  const totalCount = admins.length;
  const activeCount = admins.filter((a) => a.status === 'ACTIVE').length;
  const operationsCount = admins.filter(
    (a) => a.role === 'OPERATIONS_ADMIN' || a.permissions?.includes('manage_cars')
  ).length;
  const superCount = admins.filter((a) => a.role === 'SUPER_ADMIN').length;

  // Filtered
  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || a.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Staff & Access Control</h2>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200">
              RBAC v2.0
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Create new sub-admins and assign granular permissions specifying what modules each staff member can access
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchAdmins}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User / Admin</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Staff</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-zinc-950">{totalCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Platform portal members</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Active permission holders</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fleet & Ops Leads</span>
            <Car className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">{operationsCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Cars & bikes controllers</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Super Admins</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{superCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Unrestricted master accounts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:border-black outline-none transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-zinc-500 font-bold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>

          {['ALL', 'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'STAFF_ADMIN'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              {r === 'ALL'
                ? 'All Roles'
                : r === 'SUPER_ADMIN'
                ? 'Super'
                : r === 'OPERATIONS_ADMIN'
                ? 'Operations'
                : r === 'SUPPORT_ADMIN'
                ? 'Support'
                : 'Custom Staff'}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Cards / List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200">
            <div className="w-8 h-8 border-3 border-zinc-300 border-t-black rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-zinc-500">Loading platform administrators...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-zinc-900">No staff members found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchTerm || roleFilter !== 'ALL'
                ? 'Try adjusting your search criteria or role filters.'
                : 'Click "+ Add New User / Admin" to create your first sub-admin with custom access permissions.'}
            </p>
          </div>
        ) : (
          filteredAdmins.map((admin) => {
            const roleMeta = ROLE_INFO[admin.role] || ROLE_INFO.STAFF_ADMIN;
            const RoleIcon = roleMeta.icon;
            const isSuper = admin.role === 'SUPER_ADMIN';
            const isActive = admin.status === 'ACTIVE';

            return (
              <div
                key={admin._id}
                className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 hover:border-zinc-300 transition-all shadow-2xs space-y-4"
              >
                {/* Top Row: User details & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Initials */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        isSuper
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-zinc-900 text-white'
                      }`}
                    >
                      {admin.name ? admin.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-zinc-950">{admin.name}</h4>

                        {/* Role Badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleMeta.color}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{roleMeta.label}</span>
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{admin.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{admin.email}</span>
                        </span>
                        {admin.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{admin.phone}</span>
                          </span>
                        )}
                        {admin.createdAt && (
                          <span className="text-[11px] text-zinc-400 hidden sm:inline">
                            Joined {new Date(admin.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(admin)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        isActive
                          ? 'border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {isActive ? 'Suspend' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditAdmin(admin)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-black hover:text-white border border-zinc-200 transition-all cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Edit Access</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(admin)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      title="Remove Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Permissions Badges */}
                <div className="pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Granted Access Privileges:
                    </span>
                  </div>

                  {isSuper ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unrestricted Master Administrator (Full Access across all system modules)</span>
                    </div>
                  ) : !admin.permissions || admin.permissions.length === 0 ? (
                    <span className="text-xs text-zinc-400 italic">
                      No module access permissions granted yet. Click "Edit Access" to assign permissions.
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {admin.permissions.map((permKey) => {
                        const meta = PERMISSION_LABELS[permKey];
                        if (!meta) return null;
                        const Icon = meta.icon;
                        return (
                          <span
                            key={permKey}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${meta.bg}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{meta.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={(newAdmin) => {
          setAdmins((prev) => [newAdmin, ...prev]);
          showFeedback('success', `User "${newAdmin.name}" created with assigned permissions.`);
        }}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={Boolean(editAdmin)}
        admin={editAdmin}
        onClose={() => setEditAdmin(null)}
        onSuccess={(updatedAdmin) => {
          setAdmins((prev) =>
            prev.map((a) => (a._id === updatedAdmin._id ? updatedAdmin : a))
          );
          showFeedback('success', `Updated access permissions for "${updatedAdmin.name}".`);
        }}
        onDelete={(adminToDelete) => {
          setEditAdmin(null);
          setDeleteTarget(adminToDelete);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-zinc-950">Remove Admin Account?</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-zinc-900">{deleteTarget.name}</strong> ({deleteTarget.email})? They will immediately lose all access permissions to the CarzoDrive Admin Control Center.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
