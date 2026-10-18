import React from 'react';
import {
  Car,
  Bike,
  Check,
  X,
  Phone,
  Eye,
  MessageSquare,
  Loader2,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { resolveDocumentUrl } from '../../../utils/documentUtils';

export const VendorSubmissionCard = ({
  item,
  actionLoadingId,
  handleApprove,
  handleReject,
  setInspectingItem,
  onEdit,
  onDelete,
}) => {
  const isCar = item.itemType === 'car';
  const isPending = item.status === 'PENDING_APPROVAL' || item.status === 'PENDING';
  const isApproved = item.status === 'APPROVED';
  const isRejected = item.status === 'REJECTED';
  const isProcessing = actionLoadingId === item._id;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
        isPending
          ? 'border-amber-300 shadow-md shadow-amber-500/5'
          : isApproved
          ? 'border-emerald-200 shadow-xs'
          : 'border-slate-200 opacity-80'
      }`}
    >
      {/* Header with Type, Status, Edit & Delete */}
      <div>
        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800">
            {isCar ? <Car className="w-3.5 h-3.5 text-blue-600" /> : <Bike className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isCar ? 'RENTAL CAR' : 'RENTAL BIKE'}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isPending
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : isApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isPending ? 'Pending' : isApproved ? 'Active' : 'Rejected'}
            </span>

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="Edit listing details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item.itemType, item._id, item.name)}
                className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="Delete listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-3">
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{item.name}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{item.year || 2023}</span>
              <span>•</span>
              <span>{item.category?.toUpperCase() || item.type}</span>
              <span>•</span>
              <span className="font-mono font-bold text-slate-700">
                {item.registrationNumber || item.rcNumber || 'RC Pending'}
              </span>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Expected Host Daily Rate:</span>
            <span className="text-sm font-black text-blue-900">
              {formatCurrency(item.priceNumeric || item.pricePerDay || 2500)}/day
            </span>
          </div>

          {/* Owner Details */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Host / Owner:</span>
              <span className="font-bold text-slate-900">
                {item.ownerName || item.vendorId?.name || 'Partner Host'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Phone:</span>
              <a
                href={`tel:${item.ownerPhone}`}
                className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{item.ownerPhone || 'N/A'}</span>
              </a>
            </div>

            {item.ownerEmail && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Email:</span>
                <span className="font-medium text-slate-700 truncate max-w-[180px]">
                  {item.ownerEmail}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">City Hub:</span>
              <span className="font-semibold text-slate-700">
                {item.location?.city || 'Bhubaneswar'}
              </span>
            </div>
          </div>

          {/* Attached Documents Pills - Click to view in separate page */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] font-bold">
            {item.rcDocumentUrl ? (
              <a
                href={resolveDocumentUrl(item.rcDocumentUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Click to view RC Book on separate page"
              >
                <span>✓ RC Book</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            ) : (
              <span className="px-2 py-0.5 rounded-md border bg-slate-50 text-slate-400 border-slate-200">
                RC Missing
              </span>
            )}

            {item.insuranceDocumentUrl ? (
              <a
                href={resolveDocumentUrl(item.insuranceDocumentUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Click to view Insurance Policy on separate page"
              >
                <span>✓ Insurance</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            ) : (
              <span className="px-2 py-0.5 rounded-md border bg-slate-50 text-slate-400 border-slate-200">
                Insurance Missing
              </span>
            )}

            {item.idProofUrl ? (
              <a
                href={resolveDocumentUrl(item.idProofUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Click to view Host ID on separate page"
              >
                <span>✓ Owner ID</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            ) : (
              <span className="px-2 py-0.5 rounded-md border bg-slate-50 text-slate-400 border-slate-200">
                ID Missing
              </span>
            )}
          </div>

          {/* Inspect Documents & Vehicle Button */}
          <button
            type="button"
            onClick={() => setInspectingItem(item)}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspect Vehicle & Documents</span>
          </button>

          {item.approvalNotes && (
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
              "{item.approvalNotes}"
            </p>
          )}

          {isRejected && item.rejectionReason && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
              <strong>Reason:</strong> {item.rejectionReason}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        {item.ownerPhone && (
          <a
            href={`https://wa.me/${item.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello ${item.ownerName || 'Partner'}! Regarding your ${item.name} (${item.registrationNumber || ''}) listing on CARZODRIVE:`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        )}

        {isPending ? (
          <>
            <button
              onClick={() => handleApprove(item.itemType, item._id)}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleReject(item.itemType, item._id)}
              disabled={isProcessing}
              className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          </>
        ) : isApproved ? (
          <div className="flex-1 flex items-center justify-between text-xs text-emerald-700 font-bold px-2 py-1">
            <span>✓ Active in Fleet</span>
            <button
              onClick={() => handleReject(item.itemType, item._id)}
              className="text-[11px] text-slate-500 hover:text-rose-600 underline font-normal cursor-pointer"
            >
              Deactivate
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleApprove(item.itemType, item._id)}
            disabled={isProcessing}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Re-Audit & Approve</span>
          </button>
        )}
      </div>
    </div>
  );
};
