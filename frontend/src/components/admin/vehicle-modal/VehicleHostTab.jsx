import React from 'react';
import { Eye, Upload, ExternalLink, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { resolveDocumentUrl, isPdfUrl } from '../../../utils/documentUtils';

export const VehicleHostTab = ({ formData, handleChange, rcFileInputRef, handleRcUpload, uploadingRc = false }) => {
  const isPdf = formData.rcDocumentUrl ? isPdfUrl(formData.rcDocumentUrl) : false;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-3">
          Vehicle Attachment & Host Ownership (Optional)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Owner Full Name</label>
            <input
              type="text"
              name="ownerName"
              placeholder="e.g. Rajesh Mohapatra"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Owner Contact Phone</label>
            <input
              type="text"
              name="ownerPhone"
              placeholder="+91 98765 43210"
              value={formData.ownerPhone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Owner Email Address</label>
            <input
              type="email"
              name="ownerEmail"
              placeholder="owner@example.com"
              value={formData.ownerEmail}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none"
            />
          </div>
        </div>

        {/* RC Document Upload & Instant View */}
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-zinc-900 block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>RC Smart Card / Registration Document</span>
              </span>
              <p className="text-[11px] text-zinc-500">
                Uploaded to secure Cloudinary CDN storage (supports PDF & Images)
              </p>
            </div>

            <input
              type="file"
              ref={rcFileInputRef}
              onChange={handleRcUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />

            <div className="flex items-center gap-2">
              {uploadingRc ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading RC...</span>
                </span>
              ) : formData.rcDocumentUrl ? (
                <a
                  href={resolveDocumentUrl(formData.rcDocumentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  title="Open uploaded RC document directly in a separate page"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View RC ({isPdf ? 'PDF' : 'IMAGE'})</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              ) : null}

              <button
                type="button"
                disabled={uploadingRc}
                onClick={() => rcFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{formData.rcDocumentUrl ? 'Replace RC' : 'Upload RC'}</span>
              </button>
            </div>
          </div>

          {/* Uploaded Document Banner */}
          {formData.rcDocumentUrl && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-950">RC Document Attached:</span>
                <span className="text-[11px] text-zinc-600 font-mono truncate max-w-xs sm:max-w-md">
                  {formData.rcDocumentUrl}
                </span>
              </div>
              <a
                href={resolveDocumentUrl(formData.rcDocumentUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0 ml-2"
              >
                Open in New Tab ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
