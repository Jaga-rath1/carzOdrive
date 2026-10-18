import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  Award,
  MapPin,
  Calendar,
  Languages,
  ExternalLink,
  Sparkles,
  Eye,
  Download,
  Image as ImageIcon,
  FileCheck
} from 'lucide-react';
import { driversAPI } from '../../services/api';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import {
  resolveDocumentUrl,
  getDocumentPreviewUrl,
  isPdfUrl,
  downloadDocument
} from '../../utils/documentUtils';

export const DriverVerifyModal = ({ isOpen, onClose, driver, onStatusUpdated }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  if (!isOpen || !driver) return null;

  // Aggregate all attached documents
  const documentsList = [];
  const addedUrls = new Set();

  const addDoc = (type, url, name) => {
    if (url && typeof url === 'string' && !addedUrls.has(url)) {
      addedUrls.add(url);
      const isPdf = isPdfUrl(url);
      documentsList.push({
        type,
        url,
        resolvedUrl: resolveDocumentUrl(url),
        previewUrl: getDocumentPreviewUrl(url),
        name: name || type,
        isPdf,
        verified: driver.status === 'APPROVED',
      });
    }
  };

  if (driver.drivingLicenseDoc) {
    addDoc('Commercial Driving License', driver.drivingLicenseDoc, 'Driver License Scan (Front & Back)');
  }
  if (driver.idProofDoc) {
    addDoc('Government ID Proof (Aadhaar)', driver.idProofDoc, 'Aadhaar / Voter ID / Passport Scan');
  }
  if (driver.profilePhotoDoc) {
    addDoc('Profile Portrait Photo', driver.profilePhotoDoc, 'Driver Portrait Photograph');
  }
  if (driver.addressProofDoc) {
    addDoc('Address Proof Document', driver.addressProofDoc, 'Electricity Bill / Rent Agreement');
  }

  if (Array.isArray(driver.documents)) {
    driver.documents.forEach((d) => {
      if (d && d.url) {
        addDoc(d.type || 'Verification Document', d.url, d.name);
      }
    });
  }

  // Also include driver.photo or driver.avatar if present and unique
  if (driver.photo && !addedUrls.has(driver.photo)) {
    addDoc('Driver Portrait Photo', driver.photo, 'Driver Portrait Photo');
  }

  const handleApprove = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      await driversAPI.approve(driver._id);
      setFeedback({ type: 'success', text: `Driver "${driver.name}" verified and approved successfully!` });
      if (onStatusUpdated) onStatusUpdated(driver._id, 'APPROVED');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to approve driver.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setFeedback({ type: 'error', text: 'Please specify the rejection reason.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      await driversAPI.reject(driver._id, rejectionReason);
      setFeedback({ type: 'success', text: `Application for "${driver.name}" has been rejected.` });
      if (onStatusUpdated) onStatusUpdated(driver._id, 'REJECTED');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to reject driver.' });
    } finally {
      setIsLoading(false);
    }
  };

  const driverAvatarUrl = resolveDocumentUrl(
    driver.profilePhotoDoc || driver.photo || driver.avatar
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-900 max-h-[90vh] overflow-y-auto my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-950 font-black text-lg overflow-hidden shrink-0 shadow-xs">
                {driverAvatarUrl ? (
                  <img
                    src={driverAvatarUrl}
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
              <div>
                <h2 className="text-xl font-black text-zinc-950">{driver.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500 font-mono">License: {driver.licenseNumber || 'OD-PENDING'}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
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
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Driver Details Summary */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <Phone className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{driver.phone || 'Phone not provided'}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <Mail className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{driver.email || 'Email not provided'}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <Award className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{driver.drivingExperience || (driver.experience ? `${driver.experience} Years Exp` : 'Professional Chauffeur')}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <MapPin className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>{driver.city || driver.serviceArea?.join(', ') || 'Bhubaneswar / Odisha'}</span>
            </div>

            {driver.vehicleType && (
              <div className="flex items-center gap-2.5 text-xs text-zinc-700 col-span-full">
                <span className="font-bold text-zinc-900">Vehicle Category:</span>
                <span>{driver.vehicleType}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-xs text-zinc-700 col-span-full">
              <Languages className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>Languages: {Array.isArray(driver.languages) ? driver.languages.join(', ') : 'Odia, Hindi, English'}</span>
            </div>
          </div>

          {/* Verification Documents List with Full Inspection */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Uploaded Verification Documents ({documentsList.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                Click inspect to view in full HD resolution
              </span>
            </div>

            <div className="space-y-2.5">
              {documentsList.length > 0 ? (
                documentsList.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Document Thumbnail - Click to open in separate tab */}
                      <a
                        href={doc.resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-zinc-300 shrink-0 cursor-pointer group shadow-2xs block"
                        title="Click to view document on separate page"
                      >
                        <img
                          src={doc.previewUrl}
                          alt={doc.type}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-black uppercase px-1 py-0.2 rounded bg-black/70 text-white">
                          {doc.isPdf ? 'PDF' : 'IMG'}
                        </span>
                      </a>

                      {/* Document Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-zinc-950 truncate">{doc.type}</p>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                              doc.isPdf
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {doc.isPdf ? 'PDF' : 'IMAGE'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate max-w-xs">{doc.name}</p>
                        <p className="text-[10px] text-blue-600 font-mono truncate max-w-xs">
                          {doc.resolvedUrl}
                        </p>
                      </div>
                    </div>

                    {/* Single Share / Open in Separate Page Action Button */}
                    <div className="flex items-center shrink-0 self-end sm:self-center">
                      <a
                        href={doc.resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                        title="Click to view document on a separate page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View / Open in Tab</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
                  No documents uploaded for this application.
                </div>
              )}
            </div>
          </div>

          {/* Rejection input box */}
          {showRejectInput && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <label className="block text-xs font-bold text-rose-900">Reason for Rejection *</label>
              <input
                type="text"
                placeholder="e.g. Expired driving license or unclear document scan"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-xs text-zinc-900 outline-none focus:border-rose-600"
              />
            </div>
          )}

          {/* Verification Action Buttons */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {!showRejectInput ? (
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-colors"
                >
                  Reject Application
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleReject}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              )}

              <button
                type="button"
                disabled={isLoading || driver.status === 'APPROVED'}
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm border border-emerald-600 cursor-pointer disabled:opacity-40 flex items-center gap-2 transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>{driver.status === 'APPROVED' ? 'Verified Driver' : 'Verify & Approve Driver'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production-grade Document Viewer Modal with Zoom, Rotate & Download */}
      {activeViewerDoc && (
        <DocumentViewerModal
          isOpen={!!activeViewerDoc}
          onClose={() => setActiveViewerDoc(null)}
          documentUrl={activeViewerDoc.url}
          title={activeViewerDoc.title}
          documentType={activeViewerDoc.type}
          verified={activeViewerDoc.verified}
        />
      )}
    </>
  );
};
