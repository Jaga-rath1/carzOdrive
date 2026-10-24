import React, { useState, useEffect } from 'react';
import {
  Car,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AddVehicleModal } from '../../components/admin/AddVehicleModal';
import { VehicleViewModal } from '../../components/admin/vehicle-modal/VehicleViewModal';
import { AdminVehicleCard } from '../../components/admin/vehicles/AdminVehicleCard';
import { vehiclesAPI } from '../../services/api';

const VEHICLE_CATEGORIES = ['ALL', 'SEDAN', 'SUV', 'HATCHBACK', 'LUXURY'];

export const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await vehiclesAPI.getAll();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.vehicles || []);
      setVehicles(list);
    } catch (err) {
      console.warn('Vehicles fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingVehicle(car);
    setIsAddModalOpen(true);
  };

  const handleOpenView = (car) => {
    setViewingVehicle(car);
  };

  const handleDelete = async (vehicleId, vehicleName) => {
    if (!window.confirm(`Are you sure you want to remove "${vehicleName}" from the fleet?`)) return;

    try {
      await vehiclesAPI.delete(vehicleId);
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      setAlertMessage({ type: 'success', text: `"${vehicleName}" removed from active fleet.` });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to delete vehicle.' });
    }
  };

  const filteredVehicles = vehicles
    .filter((v) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        v.name?.toLowerCase().includes(q) ||
        v.brand?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q) ||
        v.registrationNumber?.toLowerCase().includes(q) ||
        v.rcNumber?.toLowerCase().includes(q) ||
        v.color?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'ALL' ||
        v.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aStock = a.quantity !== undefined ? Number(a.quantity) : (a.availableCount ?? (a.isAvailable !== false ? 1 : 0));
      const aAvail = a.isAvailable !== false && aStock > 0 && a.availabilityStatus !== 'Currently Unavailable';
      const bStock = b.quantity !== undefined ? Number(b.quantity) : (b.availableCount ?? (b.isAvailable !== false ? 1 : 0));
      const bAvail = b.isAvailable !== false && bStock > 0 && b.availabilityStatus !== 'Currently Unavailable';
      if (aAvail === bAvail) return 0;
      return aAvail ? -1 : 1;
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Cars Fleet Management</h2>
          <p className="text-xs text-zinc-500">
            Total {vehicles.length} active self-drive & chauffeur cars available in Odisha (Live from Database)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-sm border border-black cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
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
            placeholder="Search by car name, brand, reg number, color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-900 placeholder:text-zinc-400 shadow-xs outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {VEHICLE_CATEGORIES.map((cat) => (
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

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredVehicles.map((car) => (
          <AdminVehicleCard
            key={car._id || car.slug}
            car={car}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && !isLoading && (
        <div className="py-16 text-center text-xs text-zinc-400">
          <Car className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p>No cars found matching "{searchTerm}".</p>
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        vehicleToEdit={editingVehicle}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        onVehicleAdded={(savedCar) => {
          if (editingVehicle) {
            setVehicles((prev) =>
              prev.map((c) => (c._id === savedCar._id ? { ...c, ...savedCar } : c))
            );
            setAlertMessage({ type: 'success', text: `"${savedCar.name}" updated successfully!` });
          } else {
            setVehicles((prev) => [savedCar, ...prev]);
            setAlertMessage({ type: 'success', text: `"${savedCar.name}" has been published to the fleet!` });
          }
          setTimeout(() => setAlertMessage(null), 3000);
        }}
      />

      {/* View Vehicle Specs Modal */}
      <VehicleViewModal
        isOpen={Boolean(viewingVehicle)}
        vehicle={viewingVehicle}
        onClose={() => setViewingVehicle(null)}
        onEdit={(car) => {
          setViewingVehicle(null);
          handleOpenEdit(car);
        }}
      />
    </div>
  );
};
