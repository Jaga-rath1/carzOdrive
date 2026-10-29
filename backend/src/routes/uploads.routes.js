const express = require('express');
const multer = require('multer');
const { authenticate } = require('../middleware/auth.middleware');
const uploadsController = require('../controllers/uploads.controller');

const router = express.Router();

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/avif',
    'application/pdf',
  ];

  if (allowed.includes(file.mimetype.toLowerCase())) {
    return cb(null, true);
  }

  return cb(
    new Error(
      'Invalid file format. Only JPEG, PNG, WEBP, AVIF, and PDF files are allowed.'
    ),
    false
  );
};

const singleUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

const multipleUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
}).array('images', 10);

function handleUploadError(err, res) {
  let message = err.message;

  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large. Maximum size is 10MB per file.';
  } else if (
    err.code === 'LIMIT_FILE_COUNT' ||
    err.code === 'LIMIT_UNEXPECTED_FILE'
  ) {
    message = 'Too many files or an unexpected upload field.';
  }

  return res.status(400).json({
    success: false,
    message,
  });
}

// Authenticated single upload.
// Accepts one file using either "image" or "file".
router.post('/image', authenticate, (req, res, next) => {
  singleUpload(req, res, (err) => {
    if (err) return handleUploadError(err, res);

    req.file = req.files?.image?.[0] || req.files?.file?.[0];

    return uploadsController.uploadSingleImage(req, res, next);
  });
});

// Authenticated multiple upload: up to 10 files.
router.post('/images', authenticate, (req, res, next) => {
  multipleUpload(req, res, (err) => {
    if (err) return handleUploadError(err, res);

    return uploadsController.uploadMultipleImages(req, res, next);
  });
});

// Existing document delivery routes.
// These still need a separate ownership/private-storage fix.
router.get('/document/:filename', uploadsController.serveDocument);
router.get('/view', uploadsController.serveDocument);

module.exports = router;
