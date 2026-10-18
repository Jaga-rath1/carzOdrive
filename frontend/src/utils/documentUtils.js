/**
 * Enterprise Production-Grade Document & KYC Media Resolver Utility
 * Handles Cloudinary assets, local uploads, PDF image rasterization, and secure cross-origin display
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Base server origin (e.g., http://localhost:5000)
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Extracts clean filename from any local or remote URL
 */
export function extractDocumentFilename(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('/');
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}

/**
 * Checks if the URL represents a PDF document.
 */
export function isPdfUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.pdf') || url.toLowerCase().includes('.pdf');
}

/**
 * Checks if the URL represents an image document.
 */
export function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:image/')) return true;
  const clean = url.split('?')[0].toLowerCase();
  return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(clean) || (url.includes('/image/upload/') && !isPdfUrl(url));
}

/**
 * Resolves a raw URL to a guaranteed fully qualified URL accessible by the browser.
 * For Cloudinary PDF files (which Cloudinary blocks with 401 ACL deny),
 * it seamlessly routes to the backend delivery endpoint (http://localhost:5000/uploads/... or /api/v1/uploads/document/...)
 * which serves the full original PDF with 200 OK and inline disposition!
 */
export function resolveDocumentUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Local object URLs or base64 data URLs
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Relative backend uploads path (e.g. /uploads/drivingLicense-123.pdf)
  if (trimmed.startsWith('/uploads')) {
    return `${SERVER_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${SERVER_ORIGIN}/${trimmed}`;
  }

  // If it's a Cloudinary PDF document, bypass Cloudinary's 401 ACL block by routing to the backend endpoint
  if (trimmed.includes('cloudinary.com') && isPdfUrl(trimmed)) {
    const filename = extractDocumentFilename(trimmed);
    if (filename) {
      return `${SERVER_ORIGIN}/uploads/${filename}?url=${encodeURIComponent(trimmed)}`;
    }
  }

  // Full external URL (Cloudinary images, AWS S3, etc.)
  return trimmed;
}

/**
 * Gets an image-renderable preview URL for any document.
 * Cloudinary default security restricts raw .pdf delivery (401 ACL deny),
 * but instantly renders high-definition rasterized images of the PDF when requested with .png or .jpg!
 */
export function getDocumentPreviewUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If Cloudinary PDF, convert delivery extension to .png to fetch rendered page preview directly from Cloudinary
  if (trimmed.includes('cloudinary.com') && isPdfUrl(trimmed)) {
    return trimmed.replace(/\.pdf(\?.*)?$/i, '.png$1');
  }

  const resolved = resolveDocumentUrl(trimmed);

  // If local PDF, request preview from backend
  if (isPdfUrl(resolved)) {
    const filename = extractDocumentFilename(resolved);
    if (filename) {
      return `${API_BASE_URL}/uploads/document/${filename}?preview=1`;
    }
  }

  return resolved;
}

/**
 * Helper to download a document safely using direct stream attachment headers
 */
export async function downloadDocument(url, filename = 'document') {
  if (!url) return;
  const resolved = resolveDocumentUrl(url);
  const isPdf = isPdfUrl(url) || isPdfUrl(resolved);
  const ext = isPdf ? '.pdf' : '.jpg';
  const downloadName = filename.toLowerCase().endsWith(ext) ? filename : `${filename}${ext}`;

  // If we can extract the filename, use backend download endpoint directly
  const docFilename = extractDocumentFilename(resolved);
  if (docFilename) {
    const downloadEndpoint = `${API_BASE_URL}/uploads/document/${docFilename}?download=1&name=${encodeURIComponent(downloadName)}`;
    const link = document.createElement('a');
    link.href = downloadEndpoint;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fallback: fetch blob
  try {
    const res = await fetch(resolved, { mode: 'cors' });
    if (!res.ok) throw new Error('Download request rejected');
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(resolved, '_blank', 'noopener,noreferrer');
  }
}
