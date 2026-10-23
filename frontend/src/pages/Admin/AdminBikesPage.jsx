import React, { useState, useEffect } from 'react';
import {
  Bike,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AddBikeModal } from '../../components/admin/AddBikeModal';
import { BikeViewModal } from '../../components/admin/bike-modal/BikeViewModal';
import { AdminBikeCard } from '../../components/admin/bikes/AdminBikeCard';
import { bikesAPI } from '../../services/api';

const BIKE_CATEGORIES = ['ALL', 'COMMUTER', 'SCOOTER', 'SPORTS', 'CRUISER'];

export const AdminBikesPage = () => {
  const [bikes, setBikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [viewingBike, setViewingBike] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchBikes = async () => {
    setIsLoading(true);
    try {
      const res = await bikesAPI.getAll();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.bikes || []);
      setBikes(list);
    } catch (err) {
      console.warn('Bikes fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleOpenAdd = () => {
    setEditingBike(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (bike) => {
    setEditingBike(bike);
    setIsAddModalOpen(true);
  };

  const handleOpenView = (bike) => {
    setViewingBike(bike);
  };

  const handleDelete = async (bikeId, bikeName) => {
    if (!window.confirm(`Are you sure you want to remove "${bikeName}" from the fleet?`)) return;

    try {
      await bikesAPI.delete(bikeId);
      setBikes((prev) => prev.filter((b) => b._id !== bikeId));
      setAlertMessage({ type: 'success', text: `"${bikeName}" removed from active fleet.` });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to delete bike.' });
    }
  };

  const filteredBikes = bikes.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.name?.toLowerCase().includes(q) ||
      b.brand?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q) ||
      b.registrationNumber?.toLowerCase().includes(q) ||
      b.rcNumber?.toLowerCase().includes(q) ||
      b.color?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'ALL' ||
      b.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Two-Wheeler Fleet Management</h2>
          <p className="text-xs text-zinc-500">
            Total {bikes.length} active bikes & scooties available in Odisha (Live from Database)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-sm border border-black cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Bike</span>
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

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bike model, brand, reg number, color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-900 placeholder:text-zinc-400 shadow-xs outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {BIKE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                categoryFilter === cat
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bikes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBikes.map((bike) => (
          <AdminBikeCard
            key={bike._id || bike.slug}
            bike={bike}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBikes.length === 0 && !isLoading && (
        <div className="py-16 text-center text-xs text-zinc-400">
          <Bike className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p>No bikes found matching "{searchTerm}".</p>
        </div>
      )}

      {/* Add / Edit Bike Modal */}
      <AddBikeModal
        isOpen={isAddModalOpen}
        bikeToEdit={editingBike}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBike(null);
        }}
        onBikeAdded={(savedBike) => {
          if (editingBike) {
            setBikes((prev) =>
              prev.map((b) => (b._id === savedBike._id ? { ...b, ...savedBike } : b))
            );
            setAlertMessage({ type: 'success', text: `"${savedBike.name}" updated successfully!` });
          } else {
            setBikes((prev) => [savedBike, ...prev]);
            setAlertMessage({ type: 'success', text: `"${savedBike.name}" has been published to the fleet!` });
          }
          setTimeout(() => setAlertMessage(null), 3000);
        }}
      />

      {/* View Bike Details Modal */}
      <BikeViewModal
        isOpen={Boolean(viewingBike)}
        bike={viewingBike}
        onClose={() => setViewingBike(null)}
        onEdit={(bike) => {
          setViewingBike(null);
          handleOpenEdit(bike);
        }}
      />
    </div>
  );
};
