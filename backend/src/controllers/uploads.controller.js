const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { badRequest, created } = require('../utils/response');
const uploadsService = require('../services/uploads.service');
const logger = require('../utils/logger');

const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return badRequest(res, 'No image file provided in request. Field name should be "image" or "file".');
  }

  const { folder, prefix } = req.body || {};

  const result = await uploadsService.uploadImageBuffer(req.file.buffer, {
    folder: folder || req.query.folder,
    prefix: prefix || req.query.prefix || 'upload',
    mimetype: req.file.mimetype,
  });

  return created(res, result, 'Image uploaded successfully');
});

const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return badRequest(res, 'No image files provided in request');
  }

  const { folder, prefix } = req.body || {};

  const uploadPromises = req.files.map((file) =>
    uploadsService.uploadImageBuffer(file.buffer, {
      folder: folder || req.query.folder,
      prefix: prefix || req.query.prefix || 'upload',
      mimetype: file.mimetype,
    })
  );

  const results = await Promise.all(uploadPromises);

  return created(
    res,
    { files: results, urls: results.map((r) => r.url), count: results.length },
    'Images uploaded successfully'
  );
});

/**
 * Enterprise Production-Grade Document Delivery & Proxy Controller
 * Handles streaming local storage cache, proxying Cloudinary assets, and bypassing Cloudinary 401 ACL locks on PDFs.
 */
const serveDocument = asyncHandler(async (req, res) => {
  let filename = req.params.filename || (req.path ? req.path.replace(/^\//, '') : '');
  const targetUrl = req.query.url;
  const isDownload = req.query.download === '1' || req.query.download === 'true';
  const isPreview = req.query.preview === '1' || req.query.preview === 'true';
  const customName = req.query.name;

  if (!filename && targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      const parts = parsed.pathname.split('/');
      filename = parts[parts.length - 1];
    } catch {
      filename = path.basename(targetUrl);
    }
  }

  if (!filename && !targetUrl) {
    return badRequest(res, 'Filename or target URL required');
  }

  const safeFilename = filename ? path.basename(filename) : 'document';
  const ext = path.extname(safeFilename).toLowerCase() || (targetUrl?.toLowerCase().includes('.pdf') ? '.pdf' : '.jpg');
  const localPath = path.join(LOCAL_UPLOADS_DIR, safeFilename);

  // Set permissive cross-origin headers so browser iframes, tabs, and canvas can render without restriction
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const dispositionType = isDownload ? 'attachment' : 'inline';
  const downloadFileName = customName ? (customName.endsWith(ext) ? customName : `${customName}${ext}`) : safeFilename;

  // 1. Check local uploads cache first (serves full native PDF with 200 OK)
  if (filename && fs.existsSync(localPath)) {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `${dispositionType}; filename="${downloadFileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return fs.createReadStream(localPath).pipe(res);
  }

  // 2. Fall back to upstream storage (Cloudinary) across potential folders
  const candidateUrls = [];
  if (targetUrl) {
    candidateUrls.push(targetUrl);
  } else if (filename) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'gjjtie9o';
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/documents/rc/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/documents/rc-bikes/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/documents/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/vendor-docs/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/vehicles/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/drivers/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/carzodrive/${safeFilename}`);
    candidateUrls.push(`https://res.cloudinary.com/${cloudName}/image/upload/${safeFilename}`);
  }

  for (const remoteUrl of candidateUrls) {
    try {
      let fetchUrl = remoteUrl;
      // If preview requested for PDF, fetch Cloudinary's rasterized PNG
      if (isPreview && ext === '.pdf' && remoteUrl.includes('cloudinary.com')) {
        fetchUrl = remoteUrl.replace(/\.pdf(\?.*)?$/i, '.png$1');
      }

      let remoteRes = await fetch(fetchUrl);

      // If Cloudinary rejected raw PDF delivery (401 ACL deny), fall back to Cloudinary PNG rasterization!
      if (!remoteRes.ok && ext === '.pdf' && remoteUrl.includes('cloudinary.com')) {
        const pngUrl = remoteUrl.replace(/\.pdf(\?.*)?$/i, '.png$1');
        remoteRes = await fetch(pngUrl);
      }

      if (remoteRes.ok) {
        const upstreamType = remoteRes.headers.get('content-type') || contentType;
        res.setHeader('Content-Type', upstreamType);
        res.setHeader('Content-Disposition', `${dispositionType}; filename="${downloadFileName}"`);
        res.setHeader('Cache-Control', 'public, max-age=86400');

        const arrayBuffer = await remoteRes.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (streamErr) {
      logger.warn('Document proxy candidate fetch notice:', streamErr.message);
    }
  }

  return res.status(404).json({ success: false, message: 'Requested document was not found' });
});

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  serveDocument,
};

