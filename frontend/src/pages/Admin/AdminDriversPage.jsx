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
  FileCheck,
  ExternalLink,
  IndianRupee,
  Sliders,
  Save,
  Check,
  Tag
} from 'lucide-react';
import { DriverVerifyModal } from '../../components/admin/DriverVerifyModal';
import { AddDriverModal } from '../../components/admin/AddDriverModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { driversAPI, settingsAPI } from '../../services/api';
import { resolveDocumentUrl, getDocumentPreviewUrl } from '../../utils/documentUtils';
import { useDriverSettings } from '../../hooks/useDriverSettings';

export const AdminDriversPage = () => {
  const { driverSettings, refetch: refetchDriverSettings } = useDriverSettings();
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'ALL'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeDocViewer, setActiveDocViewer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Driver Pricing & Registration Fee State
  const [isPricingExpanded, setIsPricingExpanded] = useState(false);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    dailyRate: 799,
    registrationFee: 799,
    isRegistrationActive: true,
    badgeText: '₹799/Day',
  });

  useEffect(() => {
    if (driverSettings) {
      setPricingForm({
        dailyRate: driverSettings.dailyRate !== undefined ? driverSettings.dailyRate : 799,
        registrationFee: driverSettings.registrationFee !== undefined ? driverSettings.registrationFee : 799,
        isRegistrationActive: driverSettings.isRegistrationActive ?? true,
        badgeText: driverSettings.badgeText || `₹${driverSettings.dailyRate ?? 799}/Day`,
      });
    }
  }, [driverSettings]);

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

  const handleSavePricing = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingPricing(true);
    try {
      const cleanDaily = pricingForm.dailyRate !== '' && !isNaN(Number(pricingForm.dailyRate))
        ? Math.max(0, Number(pricingForm.dailyRate))
        : 799;
      const cleanReg = pricingForm.registrationFee !== '' && !isNaN(Number(pricingForm.registrationFee))
        ? Math.max(0, Number(pricingForm.registrationFee))
        : 799;

      await settingsAPI.updateDriverSettings({
        dailyRate: cleanDaily,
        registrationFee: cleanReg,
        isRegistrationActive: Boolean(pricingForm.isRegistrationActive),
        badgeText: pricingForm.badgeText || `₹${cleanDaily}/Day`,
      });
      setFeedback({
        type: 'success',
        text: `Driver pricing updated: Daily Hire ₹${cleanDaily}/day & Registration Fee ₹${cleanReg}. Updated live on customer portal!`,
      });
      setIsPricingExpanded(false);
      refetchDriverSettings();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update driver settings.' });
    } finally {
      setIsSavingPricing(false);
    }
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
            Manual KYC authentication, dynamic registration fees, and driver enrollment for CarzoDrive fleet
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPricingExpanded((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Daily Rate & Registration Fee (₹{pricingForm.dailyRate})</span>
          </button>

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

      {/* Driver Pricing & Registration Fee Management Widget */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-zinc-950">Driver Daily Hire Rate & Registration Fee</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Admin Controlled
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Current customer hire price: <strong className="text-zinc-900 font-mono">₹{driverSettings?.dailyRate || 799}/day</strong> • Driver registration fee: <strong className="text-zinc-900 font-mono">₹{driverSettings?.registrationFee || 799}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPricingExpanded((p) => !p)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
          >
            {isPricingExpanded ? 'Close Settings' : 'Edit Rate & Fee'}
          </button>
        </div>

        {isPricingExpanded && (
          <form onSubmit={handleSavePricing} className="pt-2 space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Rate Input */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <label className="block text-xs font-bold text-zinc-700">
                  Customer Daily Hire Rate (₹/day)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-zinc-500 font-mono">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={pricingForm.dailyRate}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? '' : Number(raw);
                      setPricingForm((p) => ({
                        ...p,
                        dailyRate: val,
                        badgeText: val !== '' ? `₹${val}/Day` : '',
                      }));
                    }}
                    placeholder="e.g. 799"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-300 font-mono font-black text-base text-zinc-950 outline-none focus:border-black"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[599, 799, 850, 899, 900, 999, 1199].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPricingForm((p) => ({ ...p, dailyRate: amt, badgeText: `₹${amt}/Day` }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer border ${
                        pricingForm.dailyRate === amt
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      ₹{amt} {amt === 799 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Fee Input */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <label className="block text-xs font-bold text-zinc-700">
                  Driver Onboarding / Registration Fee (₹)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-zinc-500 font-mono">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={pricingForm.registrationFee}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setPricingForm((p) => ({ ...p, registrationFee: raw === '' ? '' : Number(raw) }));
                    }}
                    placeholder="e.g. 799"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-300 font-mono font-black text-base text-zinc-950 outline-none focus:border-black"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[0, 499, 799, 999].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPricingForm((p) => ({ ...p, registrationFee: amt }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer border ${
                        pricingForm.registrationFee === amt
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {amt === 0 ? '₹0 (Free)' : `₹${amt}`} {amt === 799 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge & Toggle */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Display Badge Label
                  </label>
                  <input
                    type="text"
                    value={pricingForm.badgeText}
                    onChange={(e) => setPricingForm((p) => ({ ...p, badgeText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-300 font-bold text-xs text-zinc-950 outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-700">Driver Registration Open</span>
                  <button
                    type="button"
                    onClick={() => setPricingForm((p) => ({ ...p, isRegistrationActive: !p.isRegistrationActive }))}
                    className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer ${
                      pricingForm.isRegistrationActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {pricingForm.isRegistrationActive ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsPricingExpanded(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingPricing}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSavingPricing ? 'Updating System...' : 'Save & Publish Driver Rates'}</span>
              </button>
            </div>
          </form>
        )}
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
