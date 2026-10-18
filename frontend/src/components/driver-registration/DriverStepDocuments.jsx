import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  FileText,
  Camera,
  FileCheck,
  CheckCircle2,
  Loader2,
  Eye,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import {
  resolveDocumentUrl,
  getDocumentPreviewUrl,
  isPdfUrl
} from '../../utils/documentUtils';

export const DriverStepDocuments = ({
  formData,
  uploadingDoc,
  uploadErrors,
  licenseInputRef,
  idProofInputRef,
  profilePhotoInputRef,
  addressProofInputRef,
  onFileUpload,
  onRemoveDoc,
  onBack,
  onNext,
}) => {
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  const documentCards = [
    {
      id: 'drivingLicenseDoc',
      title: 'Commercial Driving License',
      subtitle: 'Valid Commercial (HMV / LMV / Cab) Driving License',
      formats: 'JPG, PNG, or PDF (Max 10MB)',
      required: true,
      inputRef: licenseInputRef,
      icon: CreditCard,
      color: 'blue',
      accept: 'image/png,image/jpeg,image/webp,image/jpg,application/pdf',
    },
    {
      id: 'idProofDoc',
      title: 'Government Identity Proof',
      subtitle: 'Aadhaar Card, Indian Passport or Voter Identity',
      formats: 'JPG, PNG, or PDF (Max 10MB)',
      required: true,
      inputRef: idProofInputRef,
      icon: FileText,
      color: 'indigo',
      accept: 'image/png,image/jpeg,image/webp,image/jpg,application/pdf',
    },
    {
      id: 'profilePhotoDoc',
      title: 'Driver Portrait Photo',
      subtitle: 'Front-facing, clear high-resolution portrait photograph',
      formats: 'JPG, PNG, or WEBP (Max 10MB)',
      required: true,
      inputRef: profilePhotoInputRef,
      icon: Camera,
      color: 'violet',
      accept: 'image/png,image/jpeg,image/webp,image/jpg',
    },
    {
      id: 'addressProofDoc',
      title: 'Address Proof (Optional)',
      subtitle: 'Electricity bill, Rent agreement, or Domicile proof',
      formats: 'JPG, PNG, or PDF (Max 10MB)',
      required: false,
      inputRef: addressProofInputRef,
      icon: FileCheck,
      color: 'emerald',
      accept: 'image/png,image/jpeg,image/webp,image/jpg,application/pdf',
    },
  ];

  const handleOpenViewer = (url, title, type) => {
    if (!url) return;
    setActiveViewerDoc({
      url,
      title,
      type,
    });
  };

  const hasMandatoryDocs =
    Boolean(formData.drivingLicenseDoc) &&
    Boolean(formData.idProofDoc) &&
    Boolean(formData.profilePhotoDoc);

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
          STEP 03 OF 04
        </span>
        <h2 className="text-2xl font-black text-slate-950 mt-1">
          Document Verification & Preview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload official government-issued driver credentials. You can inspect, preview, and review each document directly before proceeding.
        </p>
      </div>

      {/* Hidden File Inputs */}
      {documentCards.map((card) => (
        <input
          key={`input-${card.id}`}
          type="file"
          ref={card.inputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(card.id, file);
            e.target.value = ''; // Reset input so same file can be selected again
          }}
          accept={card.accept}
          className="hidden"
        />
      ))}

      {/* Grid of Document Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documentCards.map((card) => {
          const docUrl = formData[card.id];
          const isUploading = uploadingDoc[card.id];
          const errorMsg = uploadErrors[card.id];
          const IconComponent = card.icon;
          const isPdf = isPdfUrl(docUrl);
          const previewImgUrl = getDocumentPreviewUrl(docUrl);

          return (
            <div
              key={card.id}
              className={`rounded-2xl border-2 transition-all p-4 flex flex-col justify-between ${
                docUrl
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : isUploading
                  ? 'border-blue-400 bg-blue-50/30'
                  : 'border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              {/* Card Top Info */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        docUrl
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{card.title}</span>
                        {card.required && (
                          <span className="text-rose-500 font-bold">*</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{card.subtitle}</p>
                    </div>
                  </div>

                  {docUrl && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Attached</span>
                    </span>
                  )}
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200 mt-2">
                    {errorMsg}
                  </p>
                )}

                {/* Visual Preview Area */}
                {isUploading ? (
                  <div className="py-7 flex flex-col items-center justify-center gap-2 bg-white/70 rounded-xl border border-blue-200/80 my-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">
                      Uploading & Encrypting Document...
                    </span>
                    <span className="text-[10px] text-slate-500">Processing Cloudinary CDN storage</span>
                  </div>
                ) : docUrl ? (
                  <div className="mt-2.5 mb-3 bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <div className="flex items-center gap-3">
                      {/* Document Thumbnail with Click-to-Zoom */}
                      <div
                        onClick={() => handleOpenViewer(docUrl, card.title, card.subtitle)}
                        className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group shadow-2xs"
                        title="Click to view full document"
                      >
                        <img
                          src={previewImgUrl}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            // If rendered image preview fails, show a clean fallback icon
                            e.target.style.display = 'none';
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-600">
                          <FileText className="w-7 h-7" />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>

                        {/* PDF / Image Type Pill */}
                        <span className="absolute bottom-1 right-1 text-[8px] font-black uppercase px-1 py-0.2 rounded bg-black/70 text-white">
                          {isPdf ? 'PDF' : 'IMG'}
                        </span>
                      </div>

                      {/* Document Details & Quick Inspect */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-emerald-800 truncate">
                            Ready for Verification
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5 max-w-[190px]">
                          {resolveDocumentUrl(docUrl)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenViewer(docUrl, card.title, card.subtitle)}
                          className="mt-1.5 text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Document</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-3 py-5 px-3 border border-dashed border-slate-200 rounded-xl text-center bg-white/60">
                    <p className="text-[11px] text-slate-500">{card.formats}</p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {docUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenViewer(docUrl, card.title, card.subtitle)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => card.inputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        Replace
                      </button>

                      {onRemoveDoc && (
                        <button
                          type="button"
                          onClick={() => onRemoveDoc(card.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => card.inputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <span>Upload {card.title}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Notice */}
      {!hasMandatoryDocs && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Driving License, Government ID (Aadhaar), and Driver Portrait Photo are mandatory for verified partner onboarding.
          </span>
        </div>
      )}

      {/* Step Navigation Controls */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasMandatoryDocs}
          className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer ${
            hasMandatoryDocs
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* High-Definition Document Inspection Modal */}
      {activeViewerDoc && (
        <DocumentViewerModal
          isOpen={!!activeViewerDoc}
          onClose={() => setActiveViewerDoc(null)}
          documentUrl={activeViewerDoc.url}
          title={activeViewerDoc.title}
          documentType={activeViewerDoc.type}
          verified={false}
        />
      )}
    </motion.div>
  );
};
