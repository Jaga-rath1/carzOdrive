import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { packagesAPI } from '../../services/api';
import { AddPackageModal } from '../../components/admin/AddPackageModal';
import { PackageViewModal } from '../../components/admin/package-modal/PackageViewModal';
import { AdminPackageCard } from '../../components/admin/packages/AdminPackageCard';
import { AdminPackageFilterBar } from '../../components/admin/packages/AdminPackageFilterBar';

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await packagesAPI.getAll();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.packages || []);
      setPackages(list);
    } catch (err) {
      console.warn('Packages fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsAddModalOpen(true);
  };

  const handleOpenView = (pkg) => {
    setViewingPackage(pkg);
  };

  const handleDelete = async (pkgId, pkgName) => {
    if (!window.confirm(`Are you sure you want to remove the tour package "${pkgName}"?`)) return;

    try {
      await packagesAPI.delete(pkgId);
      setPackages((prev) => prev.filter((p) => p._id !== pkgId));
      setAlertMessage({ type: 'success', text: `"${pkgName}" deleted successfully from database.` });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to delete package.' });
    }
  };

  const filteredPackages = packages.filter((p) => {
    const q = searchTerm.toLowerCase();
    const titleMatch = (p.name || p.title || '').toLowerCase().includes(q);
    const destMatch = (p.destination || '').toLowerCase().includes(q);
    const themeMatch = (p.odishaTheme || p.category || '').toLowerCase().includes(q);
    const vehicleMatch = (p.featuredVehicle || '').toLowerCase().includes(q);

    const matchesSearch = titleMatch || destMatch || themeMatch || vehicleMatch;

    const matchesTheme =
      themeFilter === 'ALL' ||
      (p.odishaTheme || p.category || '').toLowerCase() === themeFilter.toLowerCase();

    return matchesSearch && matchesTheme;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
              Tours & Travel Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Odisha Tourism Themes
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {packages.length} active curated tour packages with day-wise itineraries (Live from Database)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-sm border border-black cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Odisha Tour Package</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alertMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all shadow-sm ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {alertMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Modular Search & Theme Filter Bar */}
      <AdminPackageFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        themeFilter={themeFilter}
        setThemeFilter={setThemeFilter}
      />

      {/* Tour Packages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => (
          <AdminPackageCard
            key={pkg._id || pkg.id}
            pkg={pkg}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && !isLoading && (
        <div className="py-16 text-center text-xs text-zinc-400 bg-zinc-50/60 rounded-3xl border border-dashed border-zinc-200 space-y-3">
          <Compass className="w-10 h-10 text-zinc-300 mx-auto" />
          <p className="font-bold text-zinc-600 text-sm">No Odisha tour packages found.</p>
          <p className="max-w-md mx-auto text-zinc-400">
            {searchTerm
              ? `No packages matching "${searchTerm}". Try resetting search or theme filter.`
              : 'No packages in database. Click "Add Odisha Tour Package" above to create a new tour.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Tour Package</span>
          </button>
        </div>
      )}

      {/* Add / Edit Package Modal */}
      <AddPackageModal
        isOpen={isAddModalOpen}
        packageToEdit={editingPackage}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPackage(null);
        }}
        onPackageSaved={(savedPkg) => {
          if (editingPackage) {
            setPackages((prev) =>
              prev.map((p) => (p._id === savedPkg._id ? { ...p, ...savedPkg } : p))
            );
            setAlertMessage({
              type: 'success',
              text: `"${savedPkg.name || savedPkg.title}" updated successfully in database!`,
            });
          } else {
            setPackages((prev) => [savedPkg, ...prev]);
            setAlertMessage({
              type: 'success',
              text: `"${savedPkg.name || savedPkg.title}" published to database!`,
            });
          }
          setTimeout(() => setAlertMessage(null), 3000);
        }}
      />

      {/* View Package Modal */}
      <PackageViewModal
        isOpen={Boolean(viewingPackage)}
        pkg={viewingPackage}
        onClose={() => setViewingPackage(null)}
        onEdit={(pkg) => {
          setViewingPackage(null);
          handleOpenEdit(pkg);
        }}
      />
    </div>
  );
};
