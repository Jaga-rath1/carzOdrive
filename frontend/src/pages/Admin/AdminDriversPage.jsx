import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  Award,
  MapPin,
  Sparkles,
  AlertCircle,
  UserPlus,
  Trash2,
  Eye,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { DriverVerifyModal } from '../../components/admin/DriverVerifyModal';
import { AddDriverModal } from '../../components/admin/AddDriverModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { driversAPI } from '../../services/api';
import { resolveDocumentUrl, getDocumentPreviewUrl } from '../../utils/documentUtils';

export const AdminDriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'ALL'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeDocViewer, setActiveDocViewer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await driversAPI.getAll();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.drivers || []);
      setDrivers(list);
      const pending = list.filter((d) => d.status === 'PENDING').length;
      if (pending === 0 && list.length > 0) {
        setActiveTab('ALL');
      }
    } catch (err) {
      console.warn('Drivers fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleQuickApprove = async (driver) => {
    try {
      await driversAPI.approve(driver._id);
      setDrivers((prev) =>
        prev.map((d) => (d._id === driver._id ? { ...d, status: 'APPROVED' } : d))
      );
      setFeedback({ type: 'success', text: `Driver "${driver.name}" has been verified & approved.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to approve driver.' });
    }
  };

  const handleDeleteDriver = async (driver) => {
    if (!window.confirm(`Are you sure you want to permanently delete driver "${driver.name}"?`)) {
      return;
    }
    try {
      await driversAPI.delete(driver._id);
      setDrivers((prev) => prev.filter((d) => d._id !== driver._id));
      setFeedback({ type: 'success', text: `Driver "${driver.name}" permanently deleted from fleet.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete driver.' });
    }
  };

  const handleDriverAdded = (newDriver) => {
    setDrivers((prev) => [newDriver, ...prev]);
    setFeedback({
      type: 'success',
      text: `Driver "${newDriver.name}" successfully enrolled and published to the live fleet!`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const pendingCount = drivers.filter((d) => d.status === 'PENDING').length;
  const approvedCount = drivers.filter((d) => d.status === 'APPROVED').length;

  const filteredDrivers = drivers.filter((d) => {
    const matchesTab =
      activeTab === 'ALL' || d.status?.toUpperCase() === activeTab.toUpperCase();

    const matchesSearch =
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Driver Verification & Fleet Portal</h2>
          <p className="text-xs text-zinc-500">
            Manual KYC authentication and direct chauffeur enrollment for CarzoDrive fleet
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Add Driver Directly</span>
          </button>

          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingCount} Pending</span>
          </span>
        </div>
      </div>

      {/* Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <span>Pending Review</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'PENDING' ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'APPROVED'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <span>Verified & Active</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'APPROVED' ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            All Registrations
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, license, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Driver Registration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver._id}
            className="rounded-3xl bg-white border border-zinc-200/90 hover:border-zinc-300 p-5 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
          >
            {/* Top Info */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-950 font-black text-base shadow-xs overflow-hidden shrink-0">
                    {driver.profilePhotoDoc || driver.photo || driver.avatar ? (
                      <img
                        src={resolveDocumentUrl(driver.profilePhotoDoc || driver.photo || driver.avatar)}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-black text-zinc-950 truncate">{driver.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono truncate">
                      License: {driver.licenseNumber}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                    driver.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : driver.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {driver.status}
                </span>
              </div>

              {/* Driver Meta Pills */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span className="truncate">{driver.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span className="truncate">{driver.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span>{driver.experience ? `${driver.experience} Years Exp` : 'Fresh Driver'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span className="truncate">{driver.serviceArea?.[0] || 'Bhubaneswar'}</span>
                </div>
              </div>

              {/* Attached Documents Quick Strip */}
              <div className="mt-3 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-600 font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <FileText className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Attached Credentials</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold">
                    {[
                      driver.drivingLicenseDoc ? 'License' : null,
                      driver.idProofDoc ? 'Aadhaar' : null,
                      driver.profilePhotoDoc ? 'Photo' : null,
                      driver.addressProofDoc ? 'Address' : null,
                    ].filter(Boolean).length || driver.documents?.length || 0} Docs
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {driver.drivingLicenseDoc && (
                    <a
                      href={resolveDocumentUrl(driver.drivingLicenseDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 text-zinc-700 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Click to view Driving License on a separate page"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> License
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {driver.idProofDoc && (
                    <a
                      href={resolveDocumentUrl(driver.idProofDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-300 text-zinc-700 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Click to view Govt ID on a separate page"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Govt ID
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {driver.profilePhotoDoc && (
                    <a
                      href={resolveDocumentUrl(driver.profilePhotoDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 text-zinc-700 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Click to view Portrait on a separate page"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Portrait
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {driver.addressProofDoc && (
                    <a
                      href={resolveDocumentUrl(driver.addressProofDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Click to view Address Proof on a separate page"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Address
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}

                  {/* Array documents fallback */}
                  {Array.isArray(driver.documents) &&
                    driver.documents.map((d, dIdx) => {
                      if (!d || !d.url) return null;
                      if (
                        d.url === driver.drivingLicenseDoc ||
                        d.url === driver.idProofDoc ||
                        d.url === driver.profilePhotoDoc ||
                        d.url === driver.addressProofDoc
                      ) return null;
                      return (
                        <a
                          key={dIdx}
                          href={resolveDocumentUrl(d.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 border border-zinc-200 text-zinc-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title={`Click to view ${d.type || d.name || 'Document'} on a separate page`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {d.type || d.name || `Doc ${dIdx + 1}`}
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      );
                    })}

                  {!driver.drivingLicenseDoc &&
                    !driver.idProofDoc &&
                    !driver.profilePhotoDoc &&
                    (!Array.isArray(driver.documents) || driver.documents.length === 0) && (
                      <span className="text-[10px] text-zinc-400 italic">No KYC scans attached</span>
                    )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedDriver(driver)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-all text-center"
              >
                Inspect Credentials & Docs
              </button>

              {driver.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => handleQuickApprove(driver)}
                  className="py-2 px-3.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm border border-emerald-600 cursor-pointer transition-all active:scale-95"
                >
                  Verify
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDeleteDriver(driver)}
                className="p-2 rounded-xl text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Delete Driver"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && !isLoading && (
        <div className="py-16 text-center text-xs text-zinc-400">
          <UserCheck className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p>No driver registrations found for this filter.</p>
        </div>
      )}

      {/* Driver Verify Inspect Modal */}
      <DriverVerifyModal
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        driver={selectedDriver}
        onStatusUpdated={(driverId, newStatus) => {
          setDrivers((prev) =>
            prev.map((d) => (d._id === driverId ? { ...d, status: newStatus } : d))
          );
          setFeedback({
            type: 'success',
            text: `Driver status successfully updated to ${newStatus}.`,
          });
          setTimeout(() => setFeedback(null), 3000);
        }}
      />

      {/* Direct Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDriverAdded={handleDriverAdded}
      />
      {/* Direct Document Inspection Lightbox Modal */}
      {activeDocViewer && (
        <DocumentViewerModal
          isOpen={!!activeDocViewer}
          onClose={() => setActiveDocViewer(null)}
          documentUrl={activeDocViewer.url}
          title={activeDocViewer.title}
          documentType={activeDocViewer.type}
          verified={true}
        />
      )}
    </div>
  );
};
