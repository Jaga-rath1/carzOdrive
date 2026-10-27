import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Car,
  FileCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Eye,
  Lock,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { getDocumentPreviewUrl } from '../../utils/documentUtils';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';
import { useDriverSettings } from '../../hooks/useDriverSettings';

export const DriverStepReview = ({
  formData,
  submitError,
  isSubmitting,
  isAuthenticated = true,
  openAuthModal,
  onGoToStep,
  onInputChange,
  onBack,
  onSubmit,
}) => {
  const { driverSettings } = useDriverSettings();
  const regFee = driverSettings?.registrationFee ?? 799;
  const isRegActive = driverSettings?.isRegistrationActive !== false;
  const [activeReviewDoc, setActiveReviewDoc] = useState(null);
  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
          STEP 04 OF 04
        </span>
        <h2 className="text-2xl font-black text-slate-950 mt-1">
          Review & Confirmation
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please verify your application details and uploaded documents before submission.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Summary: Personal Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" /> 01 Personal Details
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Name</span>
              <span className="font-bold text-slate-900">{formData.name || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Phone</span>
              <span className="font-bold text-slate-900">{formData.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Email</span>
              <span className="font-bold text-slate-900 truncate block">{formData.email || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">City</span>
              <span className="font-bold text-slate-900">{formData.city}</span>
            </div>
          </div>
        </div>

        {/* Summary: Driving Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" /> 02 Driving Details
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Experience</span>
              <span className="font-bold text-slate-900">{formData.drivingExperience}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">License No</span>
              <span className="font-mono font-bold text-slate-900">{formData.licenseNumber || 'OD-02-20180012345'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Vehicle Category</span>
              <span className="font-bold text-slate-900 truncate block">{formData.vehicleType}</span>
            </div>
          </div>
        </div>

        {/* Summary: Documents */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" /> 03 Uploaded Documents
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Edit Documents
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* Driving License */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
              formData.drivingLicenseDoc ? 'bg-white border-emerald-300 shadow-2xs' : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {formData.drivingLicenseDoc ? (
                  <img
                    src={getDocumentPreviewUrl(formData.drivingLicenseDoc)}
                    alt="Driving License"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-300 bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => setActiveReviewDoc({
                      url: formData.drivingLicenseDoc,
                      title: 'Commercial Driving License',
                      type: 'Official Driver Credential',
                    })}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-slate-900 font-bold block truncate text-xs">Driving License</span>
                  <span className={`text-[10px] font-bold block ${formData.drivingLicenseDoc ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {formData.drivingLicenseDoc ? '✓ Attached' : 'Missing'}
                  </span>
                </div>
              </div>
              {formData.drivingLicenseDoc && (
                <button
                  type="button"
                  onClick={() => setActiveReviewDoc({
                    url: formData.drivingLicenseDoc,
                    title: 'Commercial Driving License',
                    type: 'Official Driver Credential',
                  })}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors shrink-0"
                  title="Inspect document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ID Proof */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
              formData.idProofDoc ? 'bg-white border-emerald-300 shadow-2xs' : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {formData.idProofDoc ? (
                  <img
                    src={getDocumentPreviewUrl(formData.idProofDoc)}
                    alt="ID Proof"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-300 bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => setActiveReviewDoc({
                      url: formData.idProofDoc,
                      title: 'Government Identity Proof',
                      type: 'Aadhaar / Voter ID / Passport',
                    })}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-slate-900 font-bold block truncate text-xs">ID (Aadhaar)</span>
                  <span className={`text-[10px] font-bold block ${formData.idProofDoc ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {formData.idProofDoc ? '✓ Attached' : 'Missing'}
                  </span>
                </div>
              </div>
              {formData.idProofDoc && (
                <button
                  type="button"
                  onClick={() => setActiveReviewDoc({
                    url: formData.idProofDoc,
                    title: 'Government Identity Proof',
                    type: 'Aadhaar / Voter ID / Passport',
                  })}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors shrink-0"
                  title="Inspect document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Profile Photo */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
              formData.profilePhotoDoc ? 'bg-white border-emerald-300 shadow-2xs' : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {formData.profilePhotoDoc ? (
                  <img
                    src={getDocumentPreviewUrl(formData.profilePhotoDoc)}
                    alt="Driver Photo"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => setActiveReviewDoc({
                      url: formData.profilePhotoDoc,
                      title: 'Driver Portrait Photo',
                      type: 'Front-facing Profile Picture',
                    })}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-slate-900 font-bold block truncate text-xs">Driver Photo</span>
                  <span className={`text-[10px] font-bold block ${formData.profilePhotoDoc ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {formData.profilePhotoDoc ? '✓ Attached' : 'Missing'}
                  </span>
                </div>
              </div>
              {formData.profilePhotoDoc && (
                <button
                  type="button"
                  onClick={() => setActiveReviewDoc({
                    url: formData.profilePhotoDoc,
                    title: 'Driver Portrait Photo',
                    type: 'Front-facing Profile Picture',
                  })}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors shrink-0"
                  title="Inspect document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Address Proof */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
              formData.addressProofDoc ? 'bg-white border-emerald-300 shadow-2xs' : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {formData.addressProofDoc ? (
                  <img
                    src={getDocumentPreviewUrl(formData.addressProofDoc)}
                    alt="Address Proof"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-300 bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => setActiveReviewDoc({
                      url: formData.addressProofDoc,
                      title: 'Address Proof',
                      type: 'Utility Bill or Agreement',
                    })}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-slate-900 font-bold block truncate text-xs">Address Proof</span>
                  <span className={`text-[10px] font-bold block ${formData.addressProofDoc ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {formData.addressProofDoc ? '✓ Attached' : 'Optional'}
                  </span>
                </div>
              </div>
              {formData.addressProofDoc && (
                <button
                  type="button"
                  onClick={() => setActiveReviewDoc({
                    url: formData.addressProofDoc,
                    title: 'Address Proof',
                    type: 'Utility Bill or Agreement',
                  })}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors shrink-0"
                  title="Inspect document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Registration Pricing & Verification Plan (Managed by Admin) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 block">
                Official Pilot Verification Tier
              </span>
              <p className="text-[11px] text-blue-700">
                100% Police verification, badge issuance, protocol uniform, and client dispatch access.
              </p>
            </div>
          </div>
          <div className="text-right sm:border-l sm:border-blue-200/80 sm:pl-4 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Registration Fee</span>
            <span className="text-lg font-black text-slate-950 font-mono">
              {regFee === 0 ? (
                <span className="text-emerald-600 font-bold">₹0 (Free Onboarding)</span>
              ) : (
                `₹${regFee.toLocaleString('en-IN')}`
              )}
            </span>
          </div>
        </div>

        {!isRegActive && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Driver partner intake is temporarily paused by administration. You can still save details, or contact support.</span>
          </div>
        )}

        {/* Terms declaration */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeTerms}
              onChange={(e) => onInputChange('agreeTerms', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-600 leading-relaxed font-medium">
              I certify that all details and submitted documents are authentic and valid. I agree to CARZODRIVE's Driver Code of Conduct and authorize background verification.
            </span>
          </label>
        </div>
        {!isAuthenticated && (
          <AuthRequiredNotice
            title="Login Required to Submit Driver Application"
            message="Please log in or sign up before submitting your registration. Your driver credentials will be securely linked to your account."
            className="mt-3"
          />
        )}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        {!isAuthenticated ? (
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/login"
              state={{ returnTo: '/driver-registration' }}
              className="px-7 py-3.5 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Submit Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => openAuthModal && openAuthModal('login')}
              className="px-3.5 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              title="Open Quick Popup Modal"
            >
              Popup
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!formData.agreeTerms || isSubmitting}
            className={`px-9 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer ${
              formData.agreeTerms && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Document Inspector Modal */}
      {activeReviewDoc && (
        <DocumentViewerModal
          isOpen={!!activeReviewDoc}
          onClose={() => setActiveReviewDoc(null)}
          documentUrl={activeReviewDoc.url}
          title={activeReviewDoc.title}
          documentType={activeReviewDoc.type}
          verified={false}
        />
      )}
    </motion.div>
  );
};
