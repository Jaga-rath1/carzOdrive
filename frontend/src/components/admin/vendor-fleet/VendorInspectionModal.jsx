import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Bike,
  ShieldCheck,
  X,
  ImageIcon,
  FileText,
  ExternalLink,
  MessageSquare,
  Check,
  Edit2,
  Trash2
} from 'lucide-react';
import { getDocumentPreviewUrl, resolveDocumentUrl } from '../../../utils/documentUtils';

export const VendorInspectionModal = ({
  inspectingItem,
  onClose,
  getSubmissionsDocs,
  handleApprove,
  handleReject,
  onEdit,
  onDelete,
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  {inspectingItem.itemType === 'car' ? (
                    <Car className="w-6 h-6" />
                  ) : (
                    <Bike className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{inspectingItem.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {inspectingItem.itemType?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Registration RC: {inspectingItem.registrationNumber || inspectingItem.rcNumber || 'Pending'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(inspectingItem);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-colors"
                    title="Edit vehicle listing"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(inspectingItem.itemType, inspectingItem._id, inspectingItem.name);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-colors"
                    title="Delete vehicle listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Vehicle Photo Banner & Details */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center">
                  {inspectingItem.image ? (
                    <img
                      src={resolveDocumentUrl(inspectingItem.image)}
                      alt={inspectingItem.name}
                      onClick={() => window.open(resolveDocumentUrl(inspectingItem.image), '_blank')}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-all"
                      title="Click to view image in full size"
                    />
                  ) : (
                    <div className="text-xs text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span>No Photo</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-1">Click photo to open in new tab</p>
              </div>

              <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block font-medium">Owner / Host:</span>
                  <span className="font-bold text-slate-900">{inspectingItem.ownerName || 'Host'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Phone:</span>
                  <span className="font-bold text-blue-600">{inspectingItem.ownerPhone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Email:</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {inspectingItem.ownerEmail || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">City Hub:</span>
                  <span className="font-bold text-slate-900">
                    {inspectingItem.city || inspectingItem.location?.city || 'Bhubaneswar'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Expected Rate:</span>
                  <span className="font-black text-blue-900">
                    ₹{inspectingItem.expectedDailyPrice || inspectingItem.pricePerDay || inspectingItem.priceNumeric || 2500}/day
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Listing Status:</span>
                  <span
                    className={`font-black uppercase inline-block px-2 py-0.5 rounded text-[10px] ${
                      inspectingItem.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inspectingItem.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inspectingItem.status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Documents List */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Submitted Compliance Documents ({getSubmissionsDocs(inspectingItem).length})</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Click button to open document on separate page
                </span>
              </div>

              <div className="space-y-2.5">
                {getSubmissionsDocs(inspectingItem).length > 0 ? (
                  getSubmissionsDocs(inspectingItem).map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {doc.isImage || doc.previewUrl || getDocumentPreviewUrl(doc.url) ? (
                          <img
                            src={getDocumentPreviewUrl(doc.url)}
                            alt={doc.type}
                            onClick={() => window.open(resolveDocumentUrl(doc.url), '_blank')}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-300 cursor-pointer hover:opacity-90 shrink-0 bg-white shadow-2xs"
                            title="Click to view document in new tab"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          onClick={() => window.open(resolveDocumentUrl(doc.url), '_blank')}
                          className={`w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 cursor-pointer ${
                            doc.isImage || getDocumentPreviewUrl(doc.url) ? 'hidden' : ''
                          }`}
                          title="Click to view document in new tab"
                        >
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-slate-900 truncate">{doc.type}</p>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-200 text-slate-700">
                              {doc.isPdf ? 'PDF' : 'IMAGE'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{doc.name}</p>
                          <a
                            href={resolveDocumentUrl(doc.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 hover:underline font-mono truncate max-w-xs block"
                            title="Click to open link directly"
                          >
                            {resolveDocumentUrl(doc.url)}
                          </a>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        <a
                          href={resolveDocumentUrl(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          title="Open document on a separate page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Document</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                    No documents attached for this submission.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Controls */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
              >
                Close
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {inspectingItem.ownerPhone && (
                  <a
                    href={`https://wa.me/${inspectingItem.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${inspectingItem.ownerName || 'Partner'}! Regarding your ${inspectingItem.name} listing on CARZODRIVE:`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Host</span>
                  </a>
                )}

                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(inspectingItem);
                      onClose();
                    }}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(inspectingItem.itemType, inspectingItem._id, inspectingItem.name);
                      onClose();
                    }}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleReject(inspectingItem.itemType, inspectingItem._id);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-colors"
                >
                  Reject Listing
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleApprove(inspectingItem.itemType, inspectingItem._id);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm border border-emerald-600 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Approve & Publish Live</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
