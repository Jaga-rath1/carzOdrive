import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Car,
  Bike,
  Loader2,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  FileText
} from 'lucide-react';

export const EditVendorSubmissionModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicleBrand: '',
    vehicleModel: '',
    bikeBrand: '',
    bikeModel: '',
    registrationNumber: '',
    manufacturingYear: '',
    pricePerDay: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 5,
    engineCC: 125,
    city: 'Bhubaneswar',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    status: 'PENDING_APPROVAL',
    approvalNotes: '',
  });

  const isCar = item?.itemType === 'car';

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        vehicleBrand: item.vehicleBrand || item.brand || '',
        vehicleModel: item.vehicleModel || item.model || '',
        bikeBrand: item.bikeBrand || item.brand || '',
        bikeModel: item.bikeModel || item.model || '',
        registrationNumber: item.registrationNumber || item.vehicleNumber || item.bikeNumber || item.rcNumber || '',
        manufacturingYear: item.manufacturingYear || item.year || 2023,
        pricePerDay: item.expectedDailyPrice || item.pricePerDay || item.priceNumeric || 2500,
        fuelType: item.fuelType || 'Petrol',
        transmission: item.transmission || 'Manual',
        seats: item.seats || 5,
        engineCC: item.engineCC || 125,
        city: item.city || item.location?.city || 'Bhubaneswar',
        ownerName: item.ownerName || '',
        ownerPhone: item.ownerPhone || '',
        ownerEmail: item.ownerEmail || '',
        status: item.status || 'PENDING_APPROVAL',
        approvalNotes: item.approvalNotes || '',
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.itemType, item._id, formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isCar ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                {isCar ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Edit {isCar ? 'Rental Car' : 'Rental Bike'} Listing
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {item._id} • {item.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-xl text-slate-400 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Section: Vehicle Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Vehicle Listing Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Hyundai Creta SX (O) 2023"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Registration / RC Number *
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    placeholder="OD 02 AX 1234"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Expected Daily Rate (₹/day) *
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    required
                    min="100"
                    max="100000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-black text-blue-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Manufacturing Year
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="manufacturingYear"
                    value={formData.manufacturingYear}
                    onChange={handleChange}
                    min="2010"
                    max="2030"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City Hub Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              {isCar ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Seating Capacity
                    </label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      min="2"
                      max="15"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Engine Displacement (CC)
                  </label>
                  <input
                    type="number"
                    name="engineCC"
                    value={formData.engineCC}
                    onChange={handleChange}
                    min="50"
                    max="2000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Section: Host / Owner Info */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
                Host / Partner Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Host Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Host Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Host Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Status and Notes */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
                Moderation & Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Listing Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="PENDING_APPROVAL">Pending Audit</option>
                    <option value="APPROVED">Approved & Published Live</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Admin / Audit Notes
                  </label>
                  <input
                    type="text"
                    name="approvalNotes"
                    value={formData.approvalNotes}
                    onChange={handleChange}
                    placeholder="e.g. Verified RC and commercial fitness on 17-Oct"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
