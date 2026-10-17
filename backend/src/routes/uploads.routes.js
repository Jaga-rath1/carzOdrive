const express = require('express');
const multer = require('multer');
const uploadsController = require('../controllers/uploads.controller');

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif', 'application/pdf'];
  if (allowed.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Single image upload (accepts either field name 'image' or 'file')
router.post('/image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    // If not under 'image', try 'file'
    if (!req.file) {
      return upload.single('file')(req, res, (err2) => {
        if (err2) return res.status(400).json({ success: false, message: err2.message });
        return uploadsController.uploadSingleImage(req, res, next);
      });
    }
    return uploadsController.uploadSingleImage(req, res, next);
  });
});

// Multiple images upload (up to 10 files)
router.post('/images', upload.array('images', 10), uploadsController.uploadMultipleImages);

// Production Document Viewing & Stream Proxy (Bypasses Cloudinary 401 ACL deny and serves native PDF)
router.get('/document/:filename', uploadsController.serveDocument);
router.get('/view', uploadsController.serveDocument);

module.exports = router;

