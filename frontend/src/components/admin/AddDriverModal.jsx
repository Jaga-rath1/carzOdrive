import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar,
  IndianRupee,
  ShieldCheck,
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Eye
} from 'lucide-react';
import { driversAPI, uploadsAPI } from '../../services/api';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { getDocumentPreviewUrl, resolveDocumentUrl, isPdfUrl } from '../../utils/documentUtils';

const DEFAULT_DRIVER_STATE = {
  name: '',
  phone: '',
  email: '',
  city: 'Bhubaneswar',
  address: '',
  licenseNumber: '',
  licenseType: 'COMMERCIAL',
  vehicleType: 'CAB_SEDAN',
  experienceYears: 5,
  dailyRate: 899,
  hourlyRate: 120,
  languages: 'Odia, Hindi, English',
  serviceArea: 'Bhubaneswar, Cuttack, Puri',
  photo: '',
  drivingLicenseDoc: '',
  idProofDoc: '',
};

export const AddDriverModal = ({ isOpen, onClose, onDriverAdded }) => {
  const [formData, setFormData] = useState(DEFAULT_DRIVER_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [error, setError] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setError(null);
    try {
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/drivers', prefix: fieldName });
      const url = res?.data?.url || res?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, [fieldName]: url }));
      }
    } catch (err) {
      console.warn('Upload error:', err);
      setError(`Failed to upload ${fieldName}: ${err.message || 'Network error'}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Driver full name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Driver phone number is required');
      return;
    }
    if (!formData.licenseNumber.trim()) {
      setError('Commercial driving license number is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        city: formData.city.trim(),
        address: formData.address.trim(),
        licenseNumber: formData.licenseNumber.trim().toUpperCase(),
        licenseType: formData.licenseType,
        vehicleType: formData.vehicleType,
        experienceYears: Number(formData.experienceYears) || 5,
        drivingExperience: Number(formData.experienceYears) || 5,
        dailyRate: Number(formData.dailyRate) || 899,
        hourlyRate: Number(formData.hourlyRate) || 120,
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
        serviceArea: formData.serviceArea.split(',').map((s) => s.trim()).filter(Boolean),
        photo: formData.photo || '/images/drivers/driver-placeholder.jpg',
        avatar: formData.photo || '/images/drivers/driver-placeholder.jpg',
        drivingLicenseDoc: formData.drivingLicenseDoc || undefined,
        idProofDoc: formData.idProofDoc || undefined,
      };

      const res = await driversAPI.create(payload);
      if (onDriverAdded) {
        onDriverAdded(res?.data || res);
      }
      setFormData(DEFAULT_DRIVER_STATE);
      onClose();
    } catch (err) {
      console.error('Failed to add driver:', err);
      setError(err.message || 'Failed to create driver record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>Add Driver to Fleet</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pre-Approved
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Directly enroll a verified chauffeur into the live rental catalog</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 1. Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <span>Personal & Contact Bio</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Chandra Sahoo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. driver@carzodrive.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Operational City</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bhubaneswar"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Professional Credentials */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <span>Driving License & Specialization</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  License Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g. OD-02-2018-0099881"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono font-bold uppercase text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">License Category</label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                >
                  <option value="COMMERCIAL">Commercial (Transport)</option>
                  <option value="LMV_COMMERCIAL">LMV Commercial Cab</option>
                  <option value="HEAVY_PASSENGER">Heavy Passenger / Luxury Bus</option>
                  <option value="PRIVATE_LMV">Private LMV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Vehicle Expertise</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                >
                  <option value="CAB_SEDAN">Executive Sedan (Dzire, Ciaz)</option>
                  <option value="SUV_MUV">Full SUV & MUV (Innova, Scorpio)</option>
                  <option value="LUXURY_PREMIUM">Luxury Cars (Mercedes, BMW)</option>
                  <option value="ALL_VEHICLES">All Fleet Vehicles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  min="1"
                  max="40"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Daily Chauffeur Fee (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="dailyRate"
                    min="100"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Hourly Fee (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="hourlyRate"
                    min="50"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Uploads & Portrait */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <span>Photo & Verification Documents</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Photo */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">Driver Portrait</span>
                  {uploadingField === 'photo' && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
                </div>
                {formData.photo ? (
                  <div className="relative w-full h-20 rounded-xl overflow-hidden border border-zinc-200">
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, photo: '' }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-500 mt-1">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                    />
                  </label>
                )}
              </div>

              {/* Driving License Scan */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">License Document</span>
                  {uploadingField === 'drivingLicenseDoc' && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
                </div>
                {formData.drivingLicenseDoc ? (
                  <div className="relative w-full h-20 rounded-xl overflow-hidden border border-zinc-200 bg-white flex items-center justify-center p-1 group">
                    <img
                      src={getDocumentPreviewUrl(formData.drivingLicenseDoc)}
                      alt="License Preview"
                      className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-200 group-hover:scale-105"
                      onClick={() => setPreviewDoc({
                        url: formData.drivingLicenseDoc,
                        title: 'Commercial Driving License',
                        type: 'Commercial Transport Driving Credential',
                      })}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-600">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({
                          url: formData.drivingLicenseDoc,
                          title: 'Commercial Driving License',
                          type: 'Commercial Transport Driving Credential',
                        })}
                        className="p-1 rounded-lg bg-white/90 text-zinc-900 hover:bg-white text-xs cursor-pointer shadow-sm"
                        title="Inspect Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, drivingLicenseDoc: '' }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black z-10 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-500 mt-1">Upload License</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'drivingLicenseDoc')}
                    />
                  </label>
                )}
              </div>

              {/* Aadhaar / ID Proof */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">Aadhaar / ID Scan</span>
                  {uploadingField === 'idProofDoc' && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
                </div>
                {formData.idProofDoc ? (
                  <div className="relative w-full h-20 rounded-xl overflow-hidden border border-zinc-200 bg-white flex items-center justify-center p-1 group">
                    <img
                      src={getDocumentPreviewUrl(formData.idProofDoc)}
                      alt="ID Preview"
                      className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-200 group-hover:scale-105"
                      onClick={() => setPreviewDoc({
                        url: formData.idProofDoc,
                        title: 'Government Identity Proof',
                        type: 'Aadhaar / Passport Scan',
                      })}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-600">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({
                          url: formData.idProofDoc,
                          title: 'Government Identity Proof',
                          type: 'Aadhaar / Passport Scan',
                        })}
                        className="p-1 rounded-lg bg-white/90 text-zinc-900 hover:bg-white text-xs cursor-pointer shadow-sm"
                        title="Inspect Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, idProofDoc: '' }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black z-10 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-500 mt-1">Upload ID Proof</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'idProofDoc')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enrolling Driver...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enroll Driver to Fleet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Document Inspector Modal */}
      {previewDoc && (
        <DocumentViewerModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentUrl={previewDoc.url}
          title={previewDoc.title}
          documentType={previewDoc.type}
          verified={true}
        />
      )}
    </div>
  );
};
