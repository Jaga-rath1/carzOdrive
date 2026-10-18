import React from 'react';
import {
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
  Shield,
  UserCheck,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { resolveDocumentUrl } from '../../utils/documentUtils';

export const RentBikeDocuments = ({
  formData,
  fileInputRef,
  rcFileInputRef,
  insuranceFileInputRef,
  idProofFileInputRef,
  uploadingPhoto,
  uploadError,
  uploadingDoc,
  docErrors,
  onFileChange,
  onDocUpload,
}) => {
  return (
    <div>
      {/* Real Photo Upload with Cloudinary */}
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-slate-800 block">
          Two-Wheeler Photograph (Cloudinary CDN)
        </label>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          Cloudinary Storage
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {uploadError && (
        <p className="text-xs text-rose-600 mb-2 font-medium">{uploadError}</p>
      )}

      {formData.imageUrl ? (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={resolveDocumentUrl(formData.imageUrl)}
              alt="Uploaded Bike Preview"
              className="w-14 h-14 rounded-xl object-cover border border-emerald-400 bg-white"
            />
            <div>
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Uploaded to Cloudinary
              </span>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px] sm:max-w-xs">
                {formData.imageUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={resolveDocumentUrl(formData.imageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Photo</span>
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-slate-600 hover:text-black px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => (!uploadingPhoto ? fileInputRef.current?.click() : null)}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
            uploadingPhoto
              ? 'border-blue-400 bg-blue-50/50 cursor-wait'
              : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 text-slate-600'
          }`}
        >
          {uploadingPhoto ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
              <span className="text-xs font-bold text-blue-900">
                Uploading Photo to Cloudinary CDN...
              </span>
              <span className="text-[11px] text-slate-500">Optimizing format & resolution</span>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 mx-auto mb-1.5 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 block">
                Click to Upload Bike Photo (Cloudinary)
              </span>
              <span className="text-[11px] text-slate-500">
                Clear side/front view of the bike (Max 10MB)
              </span>
            </>
          )}
        </div>
      )}

      {/* RC Document, Insurance, and Owner ID Uploads */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black text-slate-900 block uppercase tracking-wider">
            Verification Documents (Super Admin Review)
          </label>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Mandatory KYC
          </span>
        </div>

        {/* Hidden Inputs for Docs */}
        <input
          type="file"
          ref={rcFileInputRef}
          onChange={(e) => onDocUpload('rcDocumentUrl', e.target.files?.[0])}
          accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
          className="hidden"
        />
        <input
          type="file"
          ref={insuranceFileInputRef}
          onChange={(e) => onDocUpload('insuranceDocumentUrl', e.target.files?.[0])}
          accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
          className="hidden"
        />
        <input
          type="file"
          ref={idProofFileInputRef}
          onChange={(e) => onDocUpload('idProofUrl', e.target.files?.[0])}
          accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* RC Document */}
          <div
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              formData.rcDocumentUrl
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 mb-0.5">RC Book (Copy) *</div>
            <span className="text-[10px] text-slate-500 block mb-2">Bike Registration Document</span>

            {docErrors.rcDocumentUrl && (
              <p className="text-[10px] text-rose-600 mb-1">{docErrors.rcDocumentUrl}</p>
            )}

            {uploadingDoc.rcDocumentUrl ? (
              <div className="text-[11px] text-blue-600 font-bold flex items-center justify-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </div>
            ) : formData.rcDocumentUrl ? (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Uploaded
                </div>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={resolveDocumentUrl(formData.rcDocumentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View File</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => rcFileInputRef.current?.click()}
                    className="text-[10px] font-bold text-slate-500 hover:text-black cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => rcFileInputRef.current?.click()}
                className="w-full py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              >
                Upload RC (PDF/Img)
              </button>
            )}
          </div>

          {/* Insurance Policy */}
          <div
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              formData.insuranceDocumentUrl
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 mb-0.5">Insurance Policy *</div>
            <span className="text-[10px] text-slate-500 block mb-2">Valid Two-Wheeler Policy</span>

            {docErrors.insuranceDocumentUrl && (
              <p className="text-[10px] text-rose-600 mb-1">{docErrors.insuranceDocumentUrl}</p>
            )}

            {uploadingDoc.insuranceDocumentUrl ? (
              <div className="text-[11px] text-blue-600 font-bold flex items-center justify-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </div>
            ) : formData.insuranceDocumentUrl ? (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Uploaded
                </div>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={resolveDocumentUrl(formData.insuranceDocumentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View File</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => insuranceFileInputRef.current?.click()}
                    className="text-[10px] font-bold text-slate-500 hover:text-black cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => insuranceFileInputRef.current?.click()}
                className="w-full py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              >
                Upload Insurance
              </button>
            )}
          </div>

          {/* Owner Identity Proof */}
          <div
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              formData.idProofUrl
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 mb-0.5">Owner ID Proof *</div>
            <span className="text-[10px] text-slate-500 block mb-2">Aadhaar / Driving License</span>

            {docErrors.idProofUrl && (
              <p className="text-[10px] text-rose-600 mb-1">{docErrors.idProofUrl}</p>
            )}

            {uploadingDoc.idProofUrl ? (
              <div className="text-[11px] text-blue-600 font-bold flex items-center justify-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </div>
            ) : formData.idProofUrl ? (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Uploaded
                </div>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={resolveDocumentUrl(formData.idProofUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View File</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => idProofFileInputRef.current?.click()}
                    className="text-[10px] font-bold text-slate-500 hover:text-black cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => idProofFileInputRef.current?.click()}
                className="w-full py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              >
                Upload ID Proof
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
