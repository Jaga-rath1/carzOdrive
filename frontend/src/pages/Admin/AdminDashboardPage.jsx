import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Bike,
  UserCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  UserPlus,
  FileText,
  Eye,
  ExternalLink,
  Percent
} from 'lucide-react';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';
import { AddVehicleModal } from '../../components/admin/AddVehicleModal';
import { AddBikeModal } from '../../components/admin/AddBikeModal';
import { DriverVerifyModal } from '../../components/admin/DriverVerifyModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { vehiclesAPI, bikesAPI, driversAPI, bookingsAPI } from '../../services/api';
import { resolveDocumentUrl, getDocumentPreviewUrl } from '../../utils/documentUtils';
import { useDiscount } from '../../hooks/useDiscount';

export const AdminDashboardPage = () => {
  const { discount } = useDiscount();
  const [vehicles, setVehicles] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fleetTab, setFleetTab] = useState('CARS'); // 'CARS' | 'BIKES'

  // Modals state
  const [addCarOpen, setAddCarOpen] = useState(false);
  const [addBikeOpen, setAddBikeOpen] = useState(false);
  const [selectedDriverToVerify, setSelectedDriverToVerify] = useState(null);
  const [activeDocViewer, setActiveDocViewer] = useState(null);
  const [driverTab, setDriverTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED'

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vRes, bRes, dRes, bkRes] = await Promise.all([
        vehiclesAPI.getAll().catch(() => ({ data: [] })),
        bikesAPI.getAll().catch(() => ({ data: [] })),
        driversAPI.getAll().catch(() => ({ data: [] })),
        bookingsAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const vehicleList = Array.isArray(vRes?.data) ? vRes.data : (vRes?.data?.vehicles || []);
      const bikeList = Array.isArray(bRes?.data) ? bRes.data : (bRes?.data?.bikes || []);
      const driverList = Array.isArray(dRes?.data) ? dRes.data : (dRes?.data?.drivers || []);
      const bookingList = Array.isArray(bkRes?.data) ? bkRes.data : (bkRes?.data?.bookings || []);

      setVehicles(vehicleList);
      setBikes(bikeList);
      setDrivers(driverList);
      setBookings(bookingList);

      const hasPending = driverList.some((d) => d.status === 'PENDING');
      if (hasPending) {
        setDriverTab('PENDING');
      } else {
        setDriverTab('ALL');
      }
    } catch (err) {
      console.warn('Dashboard fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingDrivers = drivers.filter((d) => d.status === 'PENDING');
  const approvedDrivers = drivers.filter((d) => d.status === 'APPROVED');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-100 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-70" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>CarzoDrive Fleet & Partner Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Executive Management Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Add and manage fleet cars and bikes, inspect incoming driver registrations, and monitor vehicle availability across Odisha hubs.
            </p>
          </div>

          {/* Quick Add CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAddCarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-sm border border-black transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Car</span>
            </button>

            <button
              type="button"
              onClick={() => setAddBikeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-zinc-900" />
              <span>Add New Bike</span>
            </button>

            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Staff & Permissions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bookings & Revenue Overview Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 text-white p-6 sm:p-7 border border-blue-900/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Bookings & Revenue Tracker</span>
          </div>
          <h3 className="text-xl font-black">
            {bookings.length} Total Bookings • ₹{bookings.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString('en-IN')} Total Value
          </h3>
          <p className="text-xs text-blue-200/80">
            {bookings.filter(b => b.paymentStatus === 'PAID').length} fully paid online • {bookings.filter(b => b.paymentMode === 'offline' || b.paymentStatus === 'OFFLINE_PENDING').length} pay on pickup pending
          </p>
        </div>

        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-blue-50 font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
        >
          <span>Manage Bookings & Payments</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Storewide Discount Status Widget */}
      <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-zinc-950">
                {discount?.isActive ? `${discount.percentage}% Storewide Customer Discount Active` : 'Promotional Discount Inactive'}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  discount?.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {discount?.isActive ? 'Live on Site' : 'Paused'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              {discount?.isActive
                ? `Customers receive flat ${discount.percentage}% discount on vehicle checkout. Badge: "${discount.badgeText || `${discount.percentage}% OFF`}".`
                : 'Default 5% discount can be enabled anytime from the offers control center.'}
            </p>
          </div>
        </div>

        <Link
          to="/admin/discounts"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-amber-400 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <span>Configure Discount & Presets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard
          title="Cars in Fleet"
          value={vehicles.length}
          subtitle="All approved & bookable"
          icon={Car}
          color="cyan"
          trend={{ value: `${vehicles.length} Live`, label: 'In Database' }}
        />

        <AdminStatsCard
          title="Bikes in Fleet"
          value={bikes.length}
          subtitle="Motorcycles & Scooties"
          icon={Bike}
          color="blue"
          trend={{ value: `${bikes.length} Live`, label: 'In Database' }}
        />

        <AdminStatsCard
          title="Pending Drivers"
          value={pendingDrivers.length}
          subtitle="Awaiting manual review"
          icon={Clock}
          color="amber"
          trend={{ value: `${pendingDrivers.length} Pending`, label: 'License verification' }}
        />

        <AdminStatsCard
          title="Verified Drivers"
          value={approvedDrivers.length}
          subtitle="Background verified"
          icon={UserCheck}
          color="emerald"
          trend={{ value: `${approvedDrivers.length} Active`, label: 'In Database' }}
        />
      </div>

      {/* Two Column Layout: Pending Drivers + Recent Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Registrations & Document Verification Hub */}
        <div className="rounded-3xl bg-white border border-zinc-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-950">Driver Credentials & KYC Documents</h3>
                <p className="text-[11px] text-zinc-500">Live inspection of driver licenses & identity proofs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDriverTab('ALL')}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    driverTab === 'ALL' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  All ({drivers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDriverTab('PENDING')}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    driverTab === 'PENDING' ? 'bg-white text-amber-700 shadow-2xs' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  Pending ({pendingDrivers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDriverTab('APPROVED')}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    driverTab === 'APPROVED' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  Verified ({approvedDrivers.length})
                </button>
              </div>

              <Link
                to="/admin/drivers"
                className="text-xs font-bold text-zinc-900 hover:text-black flex items-center gap-1 group pl-1"
                title="Open full driver management portal"
              >
                <span>Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {(driverTab === 'PENDING'
              ? pendingDrivers
              : driverTab === 'APPROVED'
              ? approvedDrivers
              : drivers
            ).slice(0, 4).map((driver) => {
              const driverAvatar = resolveDocumentUrl(driver.profilePhotoDoc || driver.photo || driver.avatar);
              return (
                <div
                  key={driver._id}
                  className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-300 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-zinc-900">
                        {driverAvatar ? (
                          <img
                            src={driverAvatar}
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
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-zinc-950 truncate">{driver.name}</p>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border ${
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
                        <p className="text-[11px] text-zinc-500 font-mono truncate">
                          {driver.licenseNumber} • {driver.phone || 'No phone'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDriverToVerify(driver)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 border border-black cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      Inspect & Verify
                    </button>
                  </div>

                  {/* Attached Documents Row on Dashboard */}
                  <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[10px] font-bold text-zinc-400 mr-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Scans:
                    </span>

                    {driver.drivingLicenseDoc && (
                      <a
                        href={resolveDocumentUrl(driver.drivingLicenseDoc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Click to view Driving License on a separate page"
                      >
                        <span>License</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    )}

                    {driver.idProofDoc && (
                      <a
                        href={resolveDocumentUrl(driver.idProofDoc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Click to view Govt ID on a separate page"
                      >
                        <span>Govt ID</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    )}

                    {driver.profilePhotoDoc && (
                      <a
                        href={resolveDocumentUrl(driver.profilePhotoDoc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Click to view Portrait Photo on a separate page"
                      >
                        <span>Photo</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    )}

                    {driver.addressProofDoc && (
                      <a
                        href={resolveDocumentUrl(driver.addressProofDoc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Click to view Address Proof on a separate page"
                      >
                        <span>Address</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
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
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title={`Click to view ${d.type || d.name || 'Document'} on a separate page`}
                          >
                            <span>{d.type || d.name || `Doc ${dIdx + 1}`}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
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
              );
            })}

            {drivers.length === 0 && (
              <div className="py-8 text-center text-xs text-zinc-500">
                <CheckCircle2 className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <span>No driver registration applications yet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Active Fleet Preview (Pure White Vehicle Cards) */}
        <div className="rounded-3xl bg-white border border-zinc-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                {fleetTab === 'CARS' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-950">Active Fleet Vehicles</h3>
                <p className="text-[11px] text-zinc-500">Real-time listing prices & availability</p>
              </div>
            </div>

            {/* Cars vs Bikes Toggle */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setFleetTab('CARS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fleetTab === 'CARS'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                Cars ({vehicles.length})
              </button>
              <button
                type="button"
                onClick={() => setFleetTab('BIKES')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fleetTab === 'BIKES'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                Bikes ({bikes.length})
              </button>
            </div>
          </div>

          {/* White Vehicle Cards */}
          <div className="space-y-2.5">
            {fleetTab === 'CARS' ? (
              vehicles.slice(0, 3).map((car) => (
                <div
                  key={car._id || car.slug}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-white border border-zinc-200 shrink-0 p-0.5 shadow-2xs">
                      <img
                        src={car.image || '/images/vehicles/swift-2026-grey.jpg'}
                        alt={car.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/vehicles/swift-2026-grey.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {car.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                        <span className="text-blue-600 font-black">₹{car.pricePerDay}</span>/day • {car.category?.toUpperCase() || 'SUV'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
              ))
            ) : (
              bikes.slice(0, 3).map((bike) => (
                <div
                  key={bike._id || bike.slug}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-white border border-zinc-200 shrink-0 p-0.5 shadow-2xs">
                      <img
                        src={bike.image || '/images/vehicles/re-classic-350.jpg'}
                        alt={bike.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/vehicles/re-classic-350.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {bike.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                        <span className="text-blue-600 font-black">₹{bike.pricePerDay || bike.pricePerHour * 24}</span>/day • {bike.category?.toUpperCase() || 'MOTORCYCLE'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-right">
            <Link
              to={fleetTab === 'CARS' ? '/admin/vehicles' : '/admin/bikes'}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group"
            >
              <span>Manage All {fleetTab === 'CARS' ? 'Cars' : 'Bikes'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddVehicleModal
        isOpen={addCarOpen}
        onClose={() => setAddCarOpen(false)}
        onVehicleAdded={(newCar) => {
          setVehicles((prev) => [newCar, ...prev]);
        }}
      />

      <AddBikeModal
        isOpen={addBikeOpen}
        onClose={() => setAddBikeOpen(false)}
        onBikeAdded={(newBike) => {
          setBikes((prev) => [newBike, ...prev]);
        }}
      />

      <DriverVerifyModal
        isOpen={!!selectedDriverToVerify}
        onClose={() => setSelectedDriverToVerify(null)}
        driver={selectedDriverToVerify}
        onStatusUpdated={(driverId, newStatus) => {
          setDrivers((prev) =>
            prev.map((d) => (d._id === driverId ? { ...d, status: newStatus } : d))
          );
        }}
      />

      {/* Direct Document Inspector Modal on Dashboard */}
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
