import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Download,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { bookingsAPI, uploadsAPI } from '../../../services/api';
import { DocumentViewerModal } from '../../common/DocumentViewerModal';
import {
  resolveDocumentUrl,
  getDocumentPreviewUrl,
  isPdfUrl,
  downloadDocument,
} from '../../../utils/documentUtils';

export const BookingDocumentsModal = ({
  isOpen,
  onClose,
  booking,
  onBookingUpdated,
}) => {
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);
  const [copiedDl, setCopiedDl] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState(booking?.documentsVerificationNotes || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !booking) return null;

  const customerName = booking.guestName || booking.customerId?.name || 'Customer';
  const customerPhone = booking.guestPhone || booking.customerId?.phone || '';
  const customerEmail = booking.guestEmail || booking.customerId?.email || '';

  // Aggregate all unique documents
  const documentsList = [];
  const addedUrls = new Set();

  const addDoc = (name, type, url) => {
    if (url && typeof url === 'string' && !addedUrls.has(url)) {
      addedUrls.add(url);
      documentsList.push({
        name: name || 'Document',
        type: type || 'KYC_DOCUMENT',
        url,
        resolvedUrl: resolveDocumentUrl(url),
        previewUrl: getDocumentPreviewUrl(url),
        isPdf: isPdfUrl(url),
      });
    }
  };

  if (booking.drivingLicenseDoc) {
    addDoc(
      booking.drivingLicenseDocName || 'Driving License (Front & Back)',
      'DRIVING_LICENSE',
      booking.drivingLicenseDoc
    );
  }

  if (booking.idProofDoc) {
    addDoc(
      booking.idProofDocName || 'Government ID Proof',
      'ID_PROOF',
      booking.idProofDoc
    );
  }

  if (Array.isArray(booking.documents)) {
    booking.documents.forEach((d) => {
      if (d && d.url) {
        addDoc(d.name || 'Verification Document', d.type || 'DOCUMENT', d.url);
      }
    });
  }

  const handleCopyDl = () => {
    if (!booking.drivingLicenseNumber) return;
    navigator.clipboard.writeText(booking.drivingLicenseNumber);
    setCopiedDl(true);
    setTimeout(() => setCopiedDl(false), 2000);
  };

  const handleVerifyStatus = async (verified) => {
    setIsUpdatingStatus(true);
    setFeedback(null);
    try {
      const res = await bookingsAPI.verifyDocuments(booking._id, {
        verified,
        notes: verificationNotes,
      });
      const updated = res?.data || res;
      setFeedback({
        type: 'success',
        text: verified ? 'Documents marked as Verified & Approved!' : 'Documents marked as Flagged / Unverified',
      });
      if (onBookingUpdated) onBookingUpdated(updated);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to update document status',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAdminAttachFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setIsUploadingDoc(true);
    setFeedback(null);
    try {
      const uploadRes = await uploadsAPI.uploadImage(file, {
        folder: 'carzodrive/bookings/documents',
        prefix: 'admin-doc',
      });
      const docUrl = uploadRes?.data?.url || uploadRes?.url;

      if (!docUrl) throw new Error('Upload did not return a valid URL');

      const res = await bookingsAPI.attachDocument(booking._id, {
        name: file.name,
        type: 'ADMIN_ATTACHED',
        url: docUrl,
      });

      const updated = res?.data || res;
      setFeedback({ type: 'success', text: `Document "${file.name}" attached successfully!` });
      if (onBookingUpdated) onBookingUpdated(updated);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to attach document' });
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const waDocMsg = encodeURIComponent(
    `Hello ${customerName}! This is CARZODRIVE Admin regarding your booking (${booking.bookingNumber || booking._id}) for ${booking.vehicleName || 'Vehicle'}:\n` +
    `• We are reviewing your reservation documents.\n` +
    `• Driving License No: ${booking.drivingLicenseNumber || 'Not provided'}\n\n` +
    `Please confirm if your documents are up-to-date. Thank you!`
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 border border-slate-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-950 truncate">
                    Booking KYC Documents
                  </h3>
                  <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {booking.bookingNumber || booking._id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Customer: <strong>{customerName}</strong> • {customerPhone} • {booking.vehicleName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mx-5 mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1">
            {/* Driving License Snapshot Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                    Government Driving License (DL) Number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {booking.documentsVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      KYC Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">DL No:</span>
                  <span className="font-mono text-sm font-black text-slate-950 uppercase tracking-wider">
                    {booking.drivingLicenseNumber || 'NOT SUBMITTED'}
                  </span>
                  {booking.drivingLicenseNumber && (
                    <button
                      type="button"
                      onClick={handleCopyDl}
                      className="p-1 rounded text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy DL Number"
                    >
                      {copiedDl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {customerPhone && (
                  <a
                    href={`https://wa.me/91${customerPhone.replace(/[^0-9]/g, '')}?text=${waDocMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                )}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Attached Uploads ({documentsList.length})</span>
                </h4>

                {/* Attach Document Input */}
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-colors shadow-2xs">
                  {isUploadingDoc ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Attach Document</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,application/pdf"
                    className="hidden"
                    disabled={isUploadingDoc}
                    onChange={handleAdminAttachFile}
                  />
                </label>
              </div>

              {documentsList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No documents uploaded during booking</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Customer did not upload a digital file or booked via offline WhatsApp. You can click "Attach Document" above to upload photos received on WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documentsList.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Preview thumbnail */}
                        <div
                          onClick={() =>
                            setActiveViewerDoc({
                              url: doc.url,
                              title: `${customerName} - ${doc.name}`,
                              type: doc.type,
                              verified: booking.documentsVerified,
                            })
                          }
                          className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 cursor-pointer group flex items-center justify-center"
                        >
                          <img
                            src={doc.previewUrl}
                            alt={doc.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                            <Eye className="w-4 h-4" />
                            <span>Click to Inspect in HD</span>
                          </div>
                          <span
                            className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${
                              doc.isPdf ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {doc.isPdf ? 'PDF' : 'IMAGE'}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-900 block truncate" title={doc.name}>
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            {doc.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveViewerDoc({
                              url: doc.url,
                              title: `${customerName} - ${doc.name}`,
                              type: doc.type,
                              verified: booking.documentsVerified,
                            })
                          }
                          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Full HD</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            downloadDocument(
                              doc.url,
                              `${booking.bookingNumber}_${doc.name.replace(/[^a-z0-9]/gi, '_')}`
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={doc.resolvedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200 transition-colors"
                          title="Open in new window"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Verification Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Verification Notes / Handover Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. DL verified against original at pickup hub, license valid till 2030."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-500">
                  {booking.documentsVerifiedAt && (
                    <span>
                      Last updated:{' '}
                      {new Date(booking.documentsVerifiedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleVerifyStatus(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Flag / Reject KYC
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleVerifyStatus(true)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Approve & Verify KYC</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Full HD Document Viewer */}
      {activeViewerDoc && (
        <DocumentViewerModal
          isOpen={Boolean(activeViewerDoc)}
          onClose={() => setActiveViewerDoc(null)}
          documentUrl={activeViewerDoc.url}
          title={activeViewerDoc.title}
          documentType={activeViewerDoc.type}
          verified={activeViewerDoc.verified}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};
