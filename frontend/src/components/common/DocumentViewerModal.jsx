import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  FileCheck,
  Copy,
  Check,
  Maximize2
} from 'lucide-react';
import {
  resolveDocumentUrl,
  getDocumentPreviewUrl,
  isPdfUrl,
  downloadDocument
} from '../../utils/documentUtils';

export const DocumentViewerModal = ({
  isOpen,
  onClose,
  documentUrl,
  title = 'Document Preview',
  documentType = 'Verification Document',
  verified = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'pdf'
  const [imgError, setImgError] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Reset transforms whenever document changes or opens
  useEffect(() => {
    if (isOpen && documentUrl) {
      setZoom(1);
      setRotation(0);
      setImgError(false);
      setIframeError(false);
      setIsLoading(true);
      const isDocPdf = isPdfUrl(documentUrl) || isPdfUrl(resolveDocumentUrl(documentUrl));
      setViewMode(isDocPdf ? 'pdf' : 'image');
      setCopied(false);
      setIsDownloading(false);
    }
  }, [isOpen, documentUrl]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !documentUrl) return null;

  const resolvedUrl = resolveDocumentUrl(documentUrl);
  const previewUrl = getDocumentPreviewUrl(documentUrl);
  const isPdf = isPdfUrl(documentUrl) || isPdfUrl(resolvedUrl);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}${isPdf ? '.pdf' : '.jpg'}`;
      await downloadDocument(documentUrl, filename);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleCopyLink = () => {
    if (!resolvedUrl) return;
    navigator.clipboard.writeText(resolvedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[94vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0">
                {isPdf ? <FileText className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{title}</h3>
                  <span
                    className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shrink-0 ${
                      isPdf
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    }`}
                  >
                    {isPdf ? 'PDF DOCUMENT' : 'IMAGE'}
                  </span>
                  {verified && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{documentType}</p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy shareable link"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                title="Download original file"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" /> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Download</span>
              </button>

              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new window"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open New Tab</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                title="Close (Esc)"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-600 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Inspection Toolbar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 bg-zinc-900/50 border-b border-zinc-800/60 text-xs text-zinc-400 gap-2">
            {/* View Mode Tabs (For PDFs) */}
            {isPdf ? (
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('image');
                    setIsLoading(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'image'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  HD Image Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('pdf');
                    setIsLoading(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'pdf'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Native PDF Viewer
                </button>
              </div>
            ) : (
              <span className="text-zinc-400 font-medium text-xs">High-Definition Image Preview</span>
            )}

            {/* Transform Controls (Only active in Image Mode) */}
            {viewMode === 'image' && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[11px] font-mono text-zinc-400 mr-1 hidden sm:inline">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40 cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40 cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer flex items-center gap-1"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">{rotation}°</span>
                </button>
                {(zoom !== 1 || rotation !== 0) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 text-[11px] font-bold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Canvas Viewing Area */}
          <div className="relative flex-1 min-h-[380px] sm:min-h-[500px] overflow-auto flex items-center justify-center p-3 sm:p-5 bg-zinc-950/95 select-none">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-20 gap-2">
                <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
                <span className="text-xs text-zinc-400 font-medium">Loading document...</span>
              </div>
            )}

            {/* Error Fallback */}
            {imgError && viewMode === 'image' ? (
              <div className="text-center p-8 max-w-md space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rasterized preview unavailable</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    This document can be inspected using the native browser PDF reader or opened in a new tab.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  {isPdf && (
                    <button
                      type="button"
                      onClick={() => {
                        setImgError(false);
                        setViewMode('pdf');
                        setIsLoading(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Switch to Native PDF Reader
                    </button>
                  )}
                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>
            ) : isPdf ? (
              <div className="w-full h-[68vh] rounded-2xl border border-zinc-800 bg-white relative overflow-hidden flex flex-col">
                <iframe
                  src={resolvedUrl}
                  title={title}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setIframeError(true);
                  }}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src={previewUrl}
                  alt={title}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    // If previewUrl failed, try native PDF mode or show error
                    if (isPdf) {
                      setViewMode('pdf');
                    } else {
                      setImgError(true);
                    }
                  }}
                  className="max-w-full max-h-[68vh] rounded-2xl object-contain shadow-2xl border border-zinc-800 bg-white/5"
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-400">
            <span className="truncate max-w-sm sm:max-w-md font-mono text-[11px] text-zinc-500">
              {resolvedUrl}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black transition-all cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
