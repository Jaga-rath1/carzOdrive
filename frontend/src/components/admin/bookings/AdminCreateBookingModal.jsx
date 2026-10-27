import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  PlusCircle,
  X,
  User,
  Car,
  Bike,
  Compass,
  UserCheck,
  Calendar,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Check,
  Loader2,
  Search,
  Sparkles,
  CreditCard,
  Banknote,
  FileText
} from 'lucide-react';
import { bookingsAPI, vehiclesAPI, bikesAPI, packagesAPI, driversAPI, usersAPI } from '../../../services/api';

const SERVICE_TABS = [
  { id: 'SELF_DRIVE_CAR', label: 'Self Drive Car', icon: Car },
  { id: 'SELF_DRIVE_BIKE', label: 'Self Drive Bike', icon: Bike },
  { id: 'CAR_WITH_DRIVER', label: 'Car with Driver', icon: Car },
  { id: 'DRIVER_ONLY', label: 'Driver Only', icon: UserCheck },
  { id: 'TOUR_PACKAGE', label: 'Tour Package', icon: Compass },
];

const PRESET_LOCATIONS = [
  'SUM Hospital Hub, Bhubaneswar',
  'Biju Patnaik International Airport (BBI)',
  'Bhubaneswar Railway Station (Master Canteen)',
  'Patia / KIIT Square Hub',
  'Cuttack Railway Station / Netaji Terminal',
  'Puri Sea Beach / Jagannath Temple Hub',
];

export const AdminCreateBookingModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen || typeof document === 'undefined') return null;

  // Form State
  const [customerType, setCustomerType] = useState('walkin'); // 'walkin' | 'registered'
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Asset Fleet State
  const [serviceType, setServiceType] = useState('SELF_DRIVE_CAR');
  const [vehicles, setVehicles] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Form Inputs
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Selected Asset
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [userCarModel, setUserCarModel] = useState(''); // for driver-only

  // Dates & Route
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [days, setDays] = useState(1);
  const [pickupLocation, setPickupLocation] = useState(PRESET_LOCATIONS[0]);
  const [dropoffLocation, setDropoffLocation] = useState(PRESET_LOCATIONS[0]);

  // Pricing & Ledger
  const [dailyRate, setDailyRate] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);

  // Payment Options
  const [paymentMode, setPaymentMode] = useState('offline'); // 'offline' | 'full' | 'partial'
  const [onlineMethod, setOnlineMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('OFFLINE_PENDING');
  const [status, setStatus] = useState('CONFIRMED');
  const [transactionId, setTransactionId] = useState('');
  const [adminNotes, setAdminNotes] = useState('Direct Walk-in / Phone booking by Admin');

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Registered Users
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await usersAPI.getAll({ limit: 100 });
        if (isMounted) {
          setRegisteredUsers(res?.data?.users || res?.data || []);
        }
      } catch (err) {
        console.warn('Failed to load users for admin booking:', err.message);
      } finally {
        if (isMounted) setIsLoadingUsers(false);
      }
    };
    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Assets for Fleet
  useEffect(() => {
    let isMounted = true;
    const fetchAssets = async () => {
      setIsLoadingAssets(true);
      try {
        const [carsRes, bikesRes, pkgsRes, driversRes] = await Promise.all([
          vehiclesAPI.getAll({ limit: 100 }).catch(() => ({ data: [] })),
          bikesAPI.getAll({ limit: 100 }).catch(() => ({ data: [] })),
          packagesAPI.getAll().catch(() => ({ data: [] })),
          driversAPI.getAll({ limit: 100 }).catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          setVehicles(carsRes?.data?.vehicles || carsRes?.data || []);
          setBikes(bikesRes?.data?.bikes || bikesRes?.data || []);
          setPackages(pkgsRes?.data?.packages || pkgsRes?.data || []);
          setDrivers(driversRes?.data?.drivers || driversRes?.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch fleet for admin booking:', err);
      } finally {
        if (isMounted) setIsLoadingAssets(false);
      }
    };
    fetchAssets();
    return () => { isMounted = false; };
  }, []);

  // Calculate duration whenever dates change
  useEffect(() => {
    if (pickupDate && returnDate) {
      const p = new Date(pickupDate);
      const r = new Date(returnDate);
      const diffTime = r.getTime() - p.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDays(diffDays);
    }
  }, [pickupDate, returnDate]);

  // Handle Asset Selection & Auto-Price Recalculation
  useEffect(() => {
    let rate = 0;
    let dep = 0;

    if (serviceType === 'SELF_DRIVE_CAR' || serviceType === 'CAR_WITH_DRIVER') {
      const v = vehicles.find((item) => (item._id || item.id) === selectedAssetId);
      if (v) {
        rate = serviceType === 'CAR_WITH_DRIVER'
          ? (v.pricing?.withDriver?.daily || (v.pricePerDay || 0) + 700)
          : (v.pricing?.selfDrive?.daily || v.pricePerDay || 0);
        dep = v.depositNumeric || v.pricing?.securityDeposit || 0;
      }
    } else if (serviceType === 'SELF_DRIVE_BIKE') {
      const b = bikes.find((item) => (item._id || item.id) === selectedAssetId);
      if (b) {
        rate = b.pricing?.daily || b.pricePerDay || 0;
        dep = b.depositNumeric || b.pricing?.securityDeposit || 0;
      }
    } else if (serviceType === 'TOUR_PACKAGE') {
      const p = packages.find((item) => (item._id || item.id) === selectedAssetId);
      if (p) {
        rate = p.pricing?.adultPrice || p.pricePerPerson || p.price || 0;
        dep = 0;
      }
    } else if (serviceType === 'DRIVER_ONLY') {
      rate = 999;
      dep = 0;
    }

    setDailyRate(rate);
    setSecurityDeposit(dep);

    const base = rate * (days || 1);
    const tax = Math.round(base * 0.18);
    const tot = base + tax + dep;

    setBaseAmount(base);
    setTaxes(tax);
    setTotalAmount(tot);

    if (paymentMode === 'full') {
      setPaidAmount(tot);
      setBalanceAmount(0);
      setPaymentStatus('PAID');
    } else if (paymentMode === 'offline') {
      setPaidAmount(0);
      setBalanceAmount(tot);
      setPaymentStatus('OFFLINE_PENDING');
    } else if (paymentMode === 'partial') {
      const token = Math.max(500, Math.round(tot * 0.25));
      setPaidAmount(token);
      setBalanceAmount(tot - token);
      setPaymentStatus('PARTIALLY_PAID');
    }
  }, [selectedAssetId, serviceType, days, paymentMode, vehicles, bikes, packages]);

  // Adjust Paid vs Balance when Total or Paid changes manually
  const handlePaidChange = (val) => {
    const num = Number(val) || 0;
    setPaidAmount(num);
    const bal = Math.max(0, totalAmount - num);
    setBalanceAmount(bal);
    if (num >= totalAmount && totalAmount > 0) {
      setPaymentStatus('PAID');
    } else if (num > 0) {
      setPaymentStatus('PARTIALLY_PAID');
    } else {
      setPaymentStatus(paymentMode === 'offline' ? 'OFFLINE_PENDING' : 'PENDING');
    }
  };

  const handleTotalChange = (val) => {
    const num = Number(val) || 0;
    setTotalAmount(num);
    const bal = Math.max(0, num - paidAmount);
    setBalanceAmount(bal);
  };

  // Select Registered User
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setCustomerName(u.name || '');
    setCustomerEmail(u.email || '');
    setCustomerPhone(u.phone || '');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Customer name is required.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('A valid 10-digit mobile number is required.');
      return;
    }
    if (!selectedAssetId && serviceType !== 'DRIVER_ONLY') {
      setErrorMessage('Please select a vehicle, bike, or package for this booking.');
      return;
    }

    setIsSubmitting(true);

    try {
      let vehicleName = '';
      let vehicleImage = '';

      if (serviceType === 'SELF_DRIVE_CAR' || serviceType === 'CAR_WITH_DRIVER') {
        const v = vehicles.find((x) => (x._id || x.id) === selectedAssetId);
        vehicleName = v?.name || '';
        vehicleImage = v?.images?.[0] || v?.primaryImage || '';
      } else if (serviceType === 'SELF_DRIVE_BIKE') {
        const b = bikes.find((x) => (x._id || x.id) === selectedAssetId);
        vehicleName = b?.name || '';
        vehicleImage = b?.images?.[0] || b?.primaryImage || '';
      } else if (serviceType === 'TOUR_PACKAGE') {
        const p = packages.find((x) => (x._id || x.id) === selectedAssetId);
        vehicleName = p?.title || p?.name || '';
        vehicleImage = p?.images?.[0] || '';
      } else if (serviceType === 'DRIVER_ONLY') {
        vehicleName = userCarModel ? `Driver for ${userCarModel}` : 'Professional Driver';
      }

      const payload = {
        customerId: customerType === 'registered' ? (selectedUser?._id || selectedUser?.id || null) : null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        guestName: customerName.trim(),
        guestPhone: customerPhone.trim(),
        guestEmail: customerEmail.trim() || undefined,
        guestNotes: customerNotes.trim(),
        serviceType,
        vehicleId: (serviceType === 'SELF_DRIVE_CAR' || serviceType === 'CAR_WITH_DRIVER') && selectedAssetId ? selectedAssetId : null,
        bikeId: serviceType === 'SELF_DRIVE_BIKE' && selectedAssetId ? selectedAssetId : null,
        packageId: serviceType === 'TOUR_PACKAGE' && selectedAssetId ? selectedAssetId : null,
        driverId: serviceType === 'DRIVER_ONLY' && selectedAssetId ? selectedAssetId : null,
        userCarModel: userCarModel.trim(),
        vehicleName,
        vehicleImage,
        pickupLocation,
        dropoffLocation,
        startDate: new Date(pickupDate).toISOString(),
        endDate: new Date(returnDate).toISOString(),
        pickupDate,
        returnDate,
        days: Number(days) || 1,
        totalAmount: Number(totalAmount) || 0,
        paidAmount: Number(paidAmount) || 0,
        balanceAmount: Number(balanceAmount) || 0,
        securityDeposit: Number(securityDeposit) || 0,
        priceBreakdown: {
          baseAmount: Number(baseAmount) || 0,
          securityDeposit: Number(securityDeposit) || 0,
          taxes: Number(taxes) || 0,
          extraCharges: 0,
          protectionFee: 0,
          totalAmount: Number(totalAmount) || 0,
        },
        paymentMode,
        onlineMethod,
        paymentStatus,
        status,
        transactionId: transactionId.trim() || undefined,
        adminNotes: adminNotes.trim(),
      };

      const res = await bookingsAPI.createAdminBooking(payload);
      const createdBooking = res?.data || res;
      onSuccess?.(createdBooking);
      onClose();
    } catch (err) {
      console.error('Admin create booking error:', err);
      const msg = err.data?.message || err.message || 'Failed to create booking. Please check details.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = registeredUsers.filter((u) => {
    const q = userSearchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                Create New Booking <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">Admin Concierge</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Book vehicles, bikes, or tours directly for any walk-in customer or registered user
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto text-xs text-zinc-700">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Type & Details */}
          <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>1. Customer Information</span>
              </span>
              <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => { setCustomerType('walkin'); setSelectedUser(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    customerType === 'walkin' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600'
                  }`}
                >
                  Walk-in / Guest
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('registered')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    customerType === 'registered' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600'
                  }`}
                >
                  Registered User
                </button>
              </div>
            </div>

            {/* If Registered User Search */}
            {customerType === 'registered' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search user by name, phone or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                </div>
                {userSearchTerm && filteredUsers.length > 0 && (
                  <div className="max-h-36 overflow-y-auto bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100 shadow-lg">
                    {filteredUsers.slice(0, 5).map((u) => (
                      <div
                        key={u._id}
                        onClick={() => { handleSelectUser(u); setUserSearchTerm(''); }}
                        className="p-2.5 hover:bg-zinc-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-zinc-950">{u.name || 'Unnamed User'}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{u.phone} • {u.email}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedUser && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold">{selectedUser.name}</span>
                        <span className="text-[11px] text-emerald-700 ml-2 font-mono">({selectedUser.phone})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedUser(null); setCustomerName(''); setCustomerEmail(''); setCustomerPhone(''); }}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sahoo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Mobile Phone (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-mono outline-none focus:border-black font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Email (For Invoice Receipt)</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Type & Asset Selection */}
          <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <span className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-zinc-200">
              <Car className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Service Type & Vehicle Selection</span>
            </span>

            {/* Service Type Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SERVICE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = serviceType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setServiceType(tab.id); setSelectedAssetId(''); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer font-bold ${
                      active
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.02]'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-[11px] leading-tight text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Asset Dropdown or Car Model Input */}
            {serviceType === 'DRIVER_ONLY' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Customer Car Model & Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyundai Creta (OD 02 AB 1234)"
                    value={userCarModel}
                    onChange={(e) => setUserCarModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Assign Driver (Optional)</label>
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black font-semibold"
                  >
                    <option value="">-- Assign Driver Later --</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.fullName || d.name} (License: {d.licenseNumber || 'Active'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Select {serviceType === 'SELF_DRIVE_BIKE' ? 'Bike' : serviceType === 'TOUR_PACKAGE' ? 'Tour Package' : 'Car'} *
                </label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-semibold outline-none focus:border-black"
                >
                  <option value="">-- Choose from Available Fleet --</option>
                  {(serviceType === 'SELF_DRIVE_CAR' || serviceType === 'CAR_WITH_DRIVER') &&
                    vehicles.map((v) => {
                      const count = v.quantity !== undefined ? v.quantity : (v.availableCount ?? v.count ?? 1);
                      const isAvail = v.isAvailable !== false && count > 0;
                      return (
                        <option key={v._id || v.id} value={v._id || v.id} disabled={!isAvail}>
                          {isAvail ? '🟢' : '🔴'} {v.name} ({v.transmission || 'Manual'} • {v.fuelType || 'Petrol'}) — ₹{v.pricing?.selfDrive?.daily || v.pricePerDay || 0}/day [{isAvail ? `Available: ${count}` : 'Currently Unavailable'}]
                        </option>
                      );
                    })}
                  {serviceType === 'SELF_DRIVE_BIKE' &&
                    bikes.map((b) => {
                      const count = b.quantity !== undefined ? b.quantity : (b.availableCount ?? b.count ?? 1);
                      const isAvail = b.isAvailable !== false && count > 0;
                      return (
                        <option key={b._id || b.id} value={b._id || b.id} disabled={!isAvail}>
                          {isAvail ? '🟢' : '🔴'} {b.name} ({b.engineCapacity || '150cc'}) — ₹{b.pricing?.daily || b.pricePerDay || 0}/day [{isAvail ? `Available: ${count}` : 'Currently Unavailable'}]
                        </option>
                      );
                    })}
                  {serviceType === 'TOUR_PACKAGE' &&
                    packages.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.title || p.name} — ₹{p.pricing?.adultPrice || p.pricePerPerson || p.price || 0}/person ({p.duration || 'Full Day'})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 3: Dates & Hub Routing */}
          <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <span className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-zinc-200">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Booking Dates & Hub Locations</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Pick-up Date *</label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Return Date *</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Total Duration (Days)</label>
                <div className="px-3 py-2 rounded-xl bg-zinc-200/60 border border-zinc-200 text-xs font-black text-zinc-900">
                  {days} Day{days > 1 ? 's' : ''} ({days * 24} Hours)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Pick-up Hub / Address *</label>
                <input
                  type="text"
                  required
                  list="pickup-hubs"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
                <datalist id="pickup-hubs">
                  {PRESET_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Drop-off Hub / Address *</label>
                <input
                  type="text"
                  required
                  list="dropoff-hubs"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
                />
                <datalist id="dropoff-hubs">
                  {PRESET_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Section 4: Billing, Payments & Discounts */}
          <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <span className="font-black text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-zinc-200">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>4. Billing, Pricing & Payment Settlement</span>
            </span>

            {/* Pricing Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-zinc-200">
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">Daily Rate</span>
                <span className="text-sm font-black text-zinc-900">₹{dailyRate.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">Base Trip ({days}d)</span>
                <span className="text-sm font-black text-zinc-900">₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">GST Taxes (18%)</span>
                <span className="text-sm font-black text-zinc-900">₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">Security Deposit</span>
                <span className="text-sm font-black text-amber-600">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Amount Override & Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Total Billable Amount (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={totalAmount}
                  onChange={(e) => handleTotalChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-black text-zinc-950 font-mono outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-emerald-700 mb-1">Paid / Collected Amount (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={paidAmount}
                  onChange={(e) => handlePaidChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-50/50 border border-emerald-300 text-sm font-black text-emerald-950 font-mono outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-700 mb-1">Outstanding Balance (₹)</label>
                <div className="px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-300 text-sm font-black text-amber-950 font-mono">
                  ₹{balanceAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Payment Method & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                >
                  <option value="offline">Offline / Pay on Pickup (Cash/POS)</option>
                  <option value="full">Full Online / 100% Paid</option>
                  <option value="partial">Token Advance (Partial)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Collection Channel</label>
                <select
                  value={onlineMethod}
                  onChange={(e) => setOnlineMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                >
                  <option value="cash">Direct Cash at Hub</option>
                  <option value="upi">UPI / QR Code</option>
                  <option value="card">Debit / Credit Card (POS)</option>
                  <option value="netbanking">Bank Transfer / NEFT</option>
                  <option value="whatsapp">WhatsApp Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                >
                  <option value="PAID">PAID (Settled in full)</option>
                  <option value="PARTIALLY_PAID">PARTIALLY_PAID (Token paid)</option>
                  <option value="OFFLINE_PENDING">OFFLINE_PENDING (Collect at hub)</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Payment Txn / Cash Receipt Ref</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank (e.g. CASH-COUNTER-1)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-mono outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Booking Confirmation Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 font-bold outline-none focus:border-black"
                >
                  <option value="CONFIRMED">CONFIRMED (Ready for Trip)</option>
                  <option value="ACTIVE">ACTIVE (Already picked up)</option>
                  <option value="PENDING">PENDING (Awaiting confirmation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 mb-1">Internal Admin Notes</label>
              <input
                type="text"
                placeholder="e.g. VIP client, collected 2000 cash at SUM Hospital counter"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-black"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-500 hidden sm:block">
            Generating booking creates a live Tax Invoice & synchronizes fleet availability.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Create & Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
