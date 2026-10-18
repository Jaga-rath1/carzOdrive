import React, { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  Loader2
} from 'lucide-react';
import { vendorsAPI } from '../../services/api';
import { isPdfUrl } from '../../utils/documentUtils';
import { VendorSubmissionCard } from '../../components/admin/vendor-fleet/VendorSubmissionCard';
import { VendorInspectionModal } from '../../components/admin/vendor-fleet/VendorInspectionModal';
import { EditVendorSubmissionModal } from '../../components/admin/vendor-fleet/EditVendorSubmissionModal';

export const AdminVendorFleetPage = () => {
  const [submissions, setSubmissions] = useState({ cars: [], bikes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'car' | 'bike'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [inspectingItem, setInspectingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus && filterStatus !== 'ALL') params.status = filterStatus;
      if (filterType && filterType !== 'ALL') params.type = filterType;

      const res = await vendorsAPI.getAdminSubmissions(params);
      if (res?.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load vendor fleet:', err);
      setError(err.message || 'Failed to fetch vendor submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus, filterType]);

  const handleApprove = async (type, id) => {
    setActionLoadingId(id);
    setActionSuccessMsg(null);
    try {
      await vendorsAPI.approveSubmission(type, id);
      setActionSuccessMsg(`Vehicle successfully APPROVED and published to the live ${type} rental fleet!`);
      await fetchSubmissions();
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (type, id) => {
    const reason = window.prompt('Enter reason for rejection (optional):', 'RC document verification pending');
    if (reason === null) return;

    setActionLoadingId(id);
    setActionSuccessMsg(null);
    try {
      await vendorsAPI.rejectSubmission(type, id, reason);
      setActionSuccessMsg(`Vehicle marked as REJECTED.`);
      await fetchSubmissions();
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (type, id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name || 'this listing'}"?\n\nIf it was already approved, it will also be unpublished and removed from the active rental fleet.`
    );
    if (!confirmed) return;

    setActionLoadingId(id);
    setActionSuccessMsg(null);
    try {
      await vendorsAPI.deleteSubmission(type, id);
      setActionSuccessMsg(`Listing "${name || 'Vehicle'}" deleted successfully from database.`);
      await fetchSubmissions();
    } catch (err) {
      alert(`Failed to delete vehicle listing: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveEdit = async (type, id, updatedData) => {
    setIsSavingEdit(true);
    setActionSuccessMsg(null);
    try {
      await vendorsAPI.updateSubmission(type, id, updatedData);
      setActionSuccessMsg(`Listing updated successfully!`);
      setEditingItem(null);
      await fetchSubmissions();
    } catch (err) {
      alert(`Failed to update listing: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const getSubmissionsDocs = (item) => {
    if (!item) return [];
    const docs = [];
    if (item.rcDocumentUrl) {
      docs.push({
        type: 'RC Book (Registration Certificate)',
        url: item.rcDocumentUrl,
        name: `${item.name}-RC`,
        isPdf: isPdfUrl(item.rcDocumentUrl),
        isImage: !isPdfUrl(item.rcDocumentUrl),
      });
    }
    if (item.insuranceDocumentUrl) {
      docs.push({
        type: 'Comprehensive Commercial Insurance',
        url: item.insuranceDocumentUrl,
        name: `${item.name}-Insurance`,
        isPdf: isPdfUrl(item.insuranceDocumentUrl),
        isImage: !isPdfUrl(item.insuranceDocumentUrl),
      });
    }
    if (item.idProofUrl) {
      docs.push({
        type: 'Host Aadhaar / ID Proof',
        url: item.idProofUrl,
        name: `${item.ownerName || 'Host'}-ID`,
        isPdf: isPdfUrl(item.idProofUrl),
        isImage: !isPdfUrl(item.idProofUrl),
      });
    }
    if (item.fitnessCertificateUrl) {
      docs.push({
        type: 'Fitness Certificate (Speed Governor)',
        url: item.fitnessCertificateUrl,
        name: `${item.name}-Fitness`,
        isPdf: isPdfUrl(item.fitnessCertificateUrl),
        isImage: !isPdfUrl(item.fitnessCertificateUrl),
      });
    }
    if (item.permitDocumentUrl) {
      docs.push({
        type: 'State / All India Tourist Permit',
        url: item.permitDocumentUrl,
        name: `${item.name}-Permit`,
        isPdf: isPdfUrl(item.permitDocumentUrl),
        isImage: !isPdfUrl(item.permitDocumentUrl),
      });
    }
    if (item.pollutionCertificateUrl) {
      docs.push({
        type: 'Pollution Under Control (PUCC)',
        url: item.pollutionCertificateUrl,
        name: `${item.name}-PUCC`,
        isPdf: isPdfUrl(item.pollutionCertificateUrl),
        isImage: !isPdfUrl(item.pollutionCertificateUrl),
      });
    }
    if (Array.isArray(item.documents)) {
      item.documents.forEach((d, idx) => {
        if (d && d.url && !docs.some((existing) => existing.url === d.url)) {
          docs.push({
            type: d.type || `Document #${idx + 1}`,
            url: d.url,
            name: d.name || `Document #${idx + 1}`,
            isPdf: isPdfUrl(d.url),
            isImage: !isPdfUrl(d.url),
          });
        }
      });
    }
    return docs;
  };

  // Combine cars and bikes with itemType flag
  const allListings = [
    ...(submissions.cars || []).map((c) => ({ ...c, itemType: 'car' })),
    ...(submissions.bikes || []).map((b) => ({ ...b, itemType: 'bike' })),
  ];

  // Apply Search Filter
  const filteredListings = allListings.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q) ||
      item.ownerPhone?.toLowerCase().includes(q) ||
      item.registrationNumber?.toLowerCase().includes(q) ||
      item.rcNumber?.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalCount = allListings.length;
  const pendingCount = allListings.filter((i) => i.status === 'PENDING_APPROVAL' || i.status === 'PENDING').length;
  const approvedCount = allListings.filter((i) => i.status === 'APPROVED').length;
  const rejectedCount = allListings.filter((i) => i.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Host & Vendor Fleet Submissions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and approve peer-to-peer vehicles listed by car/bike hosts across Bhubaneswar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Live Status:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MongoDB Connected
          </span>
        </div>
      </div>

      {/* Success Notification Bar */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900 font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Listings</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cars & Bikes combined</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Audit</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Awaiting Super Admin review</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Fleet</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Published & bookable</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{rejectedCount}</div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Doc mismatch / expired RC</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by owner name, phone, car/bike model or reg number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_APPROVAL">Pending Review Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Vehicles (Cars & Bikes)</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes Only</option>
          </select>

          <button
            onClick={fetchSubmissions}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shrink-0"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-slate-200/90 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading vendor listings from MongoDB...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="py-20 bg-white rounded-2xl border border-slate-200/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No vendor listings found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus === 'PENDING_APPROVAL'
              ? 'No pending host listings at this time. All submissions have been processed.'
              : 'Try adjusting your search query or filters above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <VendorSubmissionCard
              key={item._id}
              item={item}
              actionLoadingId={actionLoadingId}
              handleApprove={handleApprove}
              handleReject={handleReject}
              setInspectingItem={setInspectingItem}
              onEdit={(item) => setEditingItem(item)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Super Admin Vehicle & Documents Inspection Modal */}
      <VendorInspectionModal
        inspectingItem={inspectingItem}
        onClose={() => setInspectingItem(null)}
        getSubmissionsDocs={getSubmissionsDocs}
        handleApprove={handleApprove}
        handleReject={handleReject}
        onEdit={(item) => setEditingItem(item)}
        onDelete={handleDelete}
      />

      {/* Edit Vehicle Listing Modal */}
      <EditVendorSubmissionModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
        isSaving={isSavingEdit}
      />
    </div>
  );
};
