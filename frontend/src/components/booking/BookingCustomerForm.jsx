import React from 'react';
import {
  User,
  Mail,
  Phone,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileText,
} from 'lucide-react';

export const BookingCustomerForm = ({
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  guestNotes,
  setGuestNotes,
  selectedService,
  drivingLicenseNumber,
  setDrivingLicenseNumber,
  drivingLicenseDoc,
  setDrivingLicenseDoc,
  drivingLicenseDocName,
  setDrivingLicenseDocName,
  step1Error,
}) => {
  const isSelfDrive =
    selectedService === 'self-drive-car' || selectedService === 'self-drive-bike';

  const handleLicenseFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Driving License file must be smaller than 5MB');
      return;
    }

    if (setDrivingLicenseDocName) {
      setDrivingLicenseDocName(file.name);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (setDrivingLicenseDoc) {
        setDrivingLicenseDoc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* 1. Customer Personal & Contact Info Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Customer & Handover Information
          </span>
          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Required
          </span>
        </label>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Full Name (As on Driving License / ID) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Soumya Ranjan Mohapatra"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              WhatsApp Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Special Delivery Instructions / Landmark Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Near SUM Hospital Gate 2, or Airport Arrival"
            value={guestNotes}
            onChange={(e) => setGuestNotes(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* 2. DRIVING LICENSE VERIFICATION SECTION (MANDATORY FOR SELF-DRIVE CAR & SELF-DRIVE BIKE) */}
      {isSelfDrive && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-300/90 space-y-3.5 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                Driving License Verification (Mandatory for Self-Drive)
              </span>
            </div>
            <span className="text-[10px] text-amber-900 font-bold bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
              RTO Mandated
            </span>
          </div>

          {/* DL NUMBER INPUT + DISABLED VALIDATE BUTTON */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Driving License Number (DL No.) <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required={isSelfDrive}
                  placeholder="e.g. OD02 20230012345 or DL-XXXXXXXXXXXX"
                  value={drivingLicenseNumber || ''}
                  onChange={(e) =>
                    setDrivingLicenseNumber && setDrivingLicenseNumber(e.target.value.toUpperCase())
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              {/* VALIDATE BUTTON (DISABLED AS REQUESTED) */}
              <button
                type="button"
                disabled
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shrink-0 flex items-center gap-1.5 shadow-2xs select-none"
                title="Online Parivahan DL API verification coming soon. Physical verification will be conducted at vehicle pickup."
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Validate</span>
              </button>
            </div>
            <p className="mt-1 text-[11px] text-amber-800 font-medium">
              ℹ️ Online verification is currently disabled. License will be physically verified during vehicle key handover.
            </p>
          </div>

          {/* DRIVING LICENSE DOCUMENT UPLOAD */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Upload Driving License (Photo / PDF) <span className="text-rose-600">*</span>
            </label>

            {drivingLicenseDoc ? (
              <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {drivingLicenseDocName || 'Driving License Attached'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      ✓ Document Attached & Ready
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (setDrivingLicenseDoc) setDrivingLicenseDoc(null);
                    if (setDrivingLicenseDocName) setDrivingLicenseDocName('');
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline shrink-0 cursor-pointer"
                >
                  Remove / Change
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/40 rounded-xl p-3.5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center group">
                <UploadCloud className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">
                  Click to select Driving License (Front Photo or PDF)
                </span>
                <span className="text-[10px] text-slate-500">
                  PNG, JPG, JPEG, or PDF up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden"
                  onChange={handleLicenseFileUpload}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {step1Error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{step1Error}</span>
        </div>
      )}
    </div>
  );
};
