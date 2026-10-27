import React, { useState, useEffect } from 'react';
import {
  Percent,
  Tag,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Car,
  Bike,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { settingsAPI } from '../../services/api';

const PRESETS = [
  { label: '5% Default', value: 5, name: 'Default 5% Welcome Discount', badge: '5% OFF' },
  { label: '10% Weekend', value: 10, name: 'Weekend Freedom 10% Discount', badge: '10% OFF' },
  { label: '15% Festive', value: 15, name: 'Festive Season 15% OFF', badge: '15% OFF' },
  { label: '20% Mega Saver', value: 20, name: 'Mega Roadtrip 20% OFF', badge: '20% OFF' },
];

const AVAILABLE_SERVICES = [
  { id: 'car-self-ride', label: 'Car Self-Ride (Rental)' },
  { id: 'bike-self-ride', label: 'Bike Self-Ride (Rental)' },
  { id: 'car-with-driver', label: 'Car With Driver' },
  { id: 'tours-packages', label: 'Tours & Travel Packages' },
  { id: 'driver-only', label: 'Driver Only (Pilot Hire)' },
];

export const AdminDiscountsPage = () => {
  const [formData, setFormData] = useState({
    isActive: true,
    percentage: 5,
    name: 'Default 5% Welcome Discount',
    badgeText: '5% OFF',
    bannerText: '🎉 Special Offer: Flat 5% OFF on all self-drive bookings! Automatic discount applied at checkout.',
    minBookingAmount: 0,
    maxDiscountCap: 0,
    applicableServices: ['car-self-ride', 'bike-self-ride', 'car-with-driver', 'tours-packages', 'driver-only'],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [previewSamplePrice, setPreviewSamplePrice] = useState(2500);

  const fetchDiscount = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await settingsAPI.getDiscount();
      if (res?.data) {
        setFormData({
          isActive: res.data.isActive ?? true,
          percentage: Number(res.data.percentage ?? 5),
          name: res.data.name || 'Default 5% Welcome Discount',
          badgeText: res.data.badgeText || `${res.data.percentage ?? 5}% OFF`,
          bannerText: res.data.bannerText || `🎉 Special Offer: Flat ${res.data.percentage ?? 5}% OFF on all self-drive bookings! Automatic discount applied at checkout.`,
          minBookingAmount: Number(res.data.minBookingAmount ?? 0),
          maxDiscountCap: Number(res.data.maxDiscountCap ?? 0),
          applicableServices: res.data.applicableServices || ['car-self-ride', 'bike-self-ride', 'car-with-driver', 'tours-packages', 'driver-only'],
        });
      }
    } catch (err) {
      console.warn('Failed to load discount settings:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to load discount settings from server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  const showNotification = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage((cur) => (cur?.text === text ? null : cur));
    }, 5000);
  };

  const handlePercentageChange = (val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setFormData((prev) => ({
      ...prev,
      percentage: num,
      badgeText: prev.badgeText.includes('%') ? `${num}% OFF` : prev.badgeText,
      bannerText: prev.bannerText.includes('%')
        ? prev.bannerText.replace(/\d+%\s*OFF/i, `${num}% OFF`)
        : `🎉 Special Offer: Flat ${num}% OFF on all self-drive bookings! Automatic discount applied at checkout.`,
    }));
  };

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      percentage: preset.value,
      name: preset.name,
      badgeText: preset.badge,
      bannerText: `🎉 Special Offer: Flat ${preset.value}% OFF on all self-drive bookings! Automatic discount applied at checkout.`,
    }));
  };

  const toggleService = (srvId) => {
    setFormData((prev) => {
      const exists = prev.applicableServices.includes(srvId);
      const updated = exists
        ? prev.applicableServices.filter((s) => s !== srvId)
        : [...prev.applicableServices, srvId];
      return { ...prev, applicableServices: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await settingsAPI.updateDiscount(formData);
      showNotification('success', 'Discount settings updated and broadcasted live to all client sessions!');
      if (res?.data) {
        setFormData((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to update discount:', err);
      showNotification('error', err.message || 'Failed to save discount settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Live calculations for the preview
  const discountActive = formData.isActive && formData.percentage > 0;
  const sampleBase = previewSamplePrice;
  let sampleDiscountAmount = 0;
  if (discountActive && sampleBase >= (formData.minBookingAmount || 0)) {
    sampleDiscountAmount = Math.round((sampleBase * formData.percentage) / 100);
    if (formData.maxDiscountCap > 0 && sampleDiscountAmount > formData.maxDiscountCap) {
      sampleDiscountAmount = formData.maxDiscountCap;
    }
  }
  const sampleAfterDiscount = Math.max(0, sampleBase - sampleDiscountAmount);
  const sampleGst = Math.round(sampleAfterDiscount * 0.18);
  const sampleTotal = sampleAfterDiscount + sampleGst;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-zinc-950 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Percent className="w-3.5 h-3.5" />
              <span>Storewide Promotional Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Discount & Offers Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Control the universal discount applied to customer bookings. Changes update dynamically across vehicle cards, booking modals, and top promotional banners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchDiscount}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-400/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold border animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-zinc-500 hover:text-black cursor-pointer font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Promotion Status</div>
            <div className="text-base font-black text-zinc-900 mt-0.5 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                }`}
              />
              <span>{formData.isActive ? 'Active on Client Site' : 'Currently Disabled'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-colors ${
              formData.isActive
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {formData.isActive ? 'Turn OFF' : 'Turn ON'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Current Discount Value</div>
          <div className="text-2xl font-black text-zinc-900 mt-0.5 flex items-baseline gap-1">
            <span>{formData.percentage}%</span>
            <span className="text-xs font-semibold text-zinc-500">OFF (Default: 5%)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Client Badge Preview</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-xs">
              <Sparkles className="w-3 h-3 text-zinc-950" />
              <span>{formData.badgeText || `${formData.percentage}% OFF`}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Section 1: Discount Rate & Presets */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                  1. Discount Rate & Quick Presets
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">Default: 5%</span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-2">Quick 1-Click Presets:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((p) => {
                  const isSelected = formData.percentage === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-amber-400'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                      }`}
                    >
                      <div className="text-sm font-black">{p.value}%</div>
                      <div className="text-[10px] opacity-75">{p.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider & Numeric Input */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700">Custom Discount Percentage (%)</label>
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => handlePercentageChange(e.target.value)}
                    className="w-14 text-center font-mono font-black text-base text-zinc-950 outline-none bg-transparent"
                  />
                  <span className="text-xs font-black text-zinc-500">%</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={formData.percentage}
                onChange={(e) => handlePercentageChange(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>0% (Disabled)</span>
                <span>5% (Default)</span>
                <span>15%</span>
                <span>25%</span>
                <span>50% (Max Safe)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Marketing Labels & Copy */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Tag className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                2. Marketing Text & Client Badges
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Campaign Title (Internal Reference)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Default 5% Welcome Discount"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Badge Text (Car Cards & Modals)
                </label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. 5% OFF"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Minimum Booking Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minBookingAmount}
                  onChange={(e) => setFormData({ ...formData, minBookingAmount: Number(e.target.value) || 0 })}
                  placeholder="0 for all bookings"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Top Announcement Banner Copy (Shown across all client pages)
              </label>
              <textarea
                rows="2"
                value={formData.bannerText}
                onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                placeholder="Banner announcement message shown at top of website"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 outline-none focus:border-black resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Maximum Discount Cap (₹) — Optional
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscountCap}
                onChange={(e) => setFormData({ ...formData, maxDiscountCap: Number(e.target.value) || 0 })}
                placeholder="0 for unlimited discount"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-black"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Set to 0 if there is no maximum ceiling cap.</p>
            </div>
          </div>

          {/* Section 3: Applicable Services */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                3. Applicable Services & Fleets
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_SERVICES.map((srv) => {
                const isChecked = formData.applicableServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => toggleService(srv.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{srv.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{isSaving ? 'Updating Storewide Settings...' : 'Save & Publish Discount to Client Apps'}</span>
            </button>
          </div>
        </form>

        {/* Right Panel: Live Customer Previews: 5 cols */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          <div className="flex items-center gap-2 px-1 text-xs font-black text-zinc-900 uppercase tracking-wide">
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Live Client-Side Preview</span>
          </div>

          {/* 1. Preview: Top Announcement Banner */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              1. Top Header Notification Bar
            </div>
            {formData.isActive ? (
              <div className="rounded-2xl bg-zinc-950 text-white p-3 text-center border border-amber-400/30 shadow-md">
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{formData.bannerText}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-100 text-zinc-400 p-3 text-center text-xs italic border border-dashed border-zinc-300">
                Banner hidden (Promotion is currently inactive)
              </div>
            )}
          </div>

          {/* 2. Preview: Vehicle Card Pricing */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              2. Vehicle Card Pricing & Badge
            </div>
            <div className="bg-white rounded-3xl p-4 border border-zinc-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-zinc-950">Mahindra Thar 4x4 LX</h4>
                  <div className="text-[10px] text-zinc-400 font-semibold">Self-Drive SUV • Bhubaneswar Hub</div>
                </div>
                {discountActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{formData.badgeText || `${formData.percentage}% OFF`}</span>
                  </span>
                )}
              </div>

              {/* Price row */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 font-semibold">Standard 24h Rate</div>
                  <div className="flex items-baseline gap-2">
                    {discountActive ? (
                      <>
                        <span className="text-lg font-black text-zinc-950 font-mono">
                          ₹{sampleAfterDiscount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-zinc-400 line-through font-mono">
                          ₹{sampleBase.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{sampleDiscountAmount.toLocaleString('en-IN')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-zinc-950 font-mono">
                        ₹{sampleBase.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400">/day</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-zinc-900 bg-amber-400 px-3 py-1.5 rounded-xl shadow-xs">
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Preview: Booking Modal Breakdown */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              3. Booking Checkout Modal Breakdown
            </div>
            <div className="bg-white rounded-3xl p-4 border border-zinc-200 shadow-md space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-zinc-800 pb-2 border-b border-zinc-100">
                <span>Interactive Price Simulator</span>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <span>Base: ₹</span>
                  <input
                    type="number"
                    step="500"
                    value={previewSamplePrice}
                    onChange={(e) => setPreviewSamplePrice(Math.max(500, Number(e.target.value) || 0))}
                    className="w-16 px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-bold outline-none text-right"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-zinc-600">
                <div className="flex justify-between">
                  <span>Base Rental Fee:</span>
                  <span className="font-mono">₹{sampleBase.toLocaleString('en-IN')}</span>
                </div>

                {discountActive && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{formData.name} ({formData.percentage}%):</span>
                    </span>
                    <span className="font-mono">-₹{sampleDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Net Taxable Amount:</span>
                  <span className="font-mono">₹{sampleAfterDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Standard GST (18%):</span>
                  <span className="font-mono">₹{sampleGst.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between font-black text-sm text-zinc-950">
                <span>Customer Total:</span>
                <span className="font-mono text-base text-zinc-950">₹{sampleTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
