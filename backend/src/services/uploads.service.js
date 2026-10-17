const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { env } = require('../config/env');
const logger = require('../utils/logger');

// Ensure local uploads directory exists for fallback
const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

/**
 * Upload an image buffer directly to Cloudinary.
 * If Cloudinary is not configured, fall back to local disk storage.
 */
async function uploadImageBuffer(fileBuffer, options = {}) {
  const folder = options.folder || env.cloudinary.folder || 'carzodrive/vehicles';
  const fileName = `${options.prefix || 'img'}-${Date.now()}-${uuidv4().slice(0, 8)}`;

  const isPdf = options.mimetype === 'application/pdf' || options.mimetype?.includes('pdf');
  const ext = isPdf ? '.pdf' : (options.mimetype ? `.${options.mimetype.split('/')[1] || 'jpg'}` : '.jpg');
  const localFileName = `${fileName}${ext}`;
  const localFilePath = path.join(LOCAL_UPLOADS_DIR, localFileName);

  // Always write local file as permanent zero-dependency fallback & backup
  try {
    await fs.promises.writeFile(localFilePath, fileBuffer);
    logger.info(`Saved local upload cache: /uploads/${localFileName}`);
  } catch (localWriteErr) {
    logger.warn('Local upload cache write warning:', localWriteErr.message);
  }

  const localResult = {
    url: `/uploads/${localFileName}`,
    previewUrl: `/uploads/${localFileName}`,
    localUrl: `/uploads/${localFileName}`,
    publicId: fileName,
    format: ext.replace('.', ''),
    isPdf,
    provider: 'local',
  };

  if (isCloudinaryConfigured()) {
    try {
      const cldResult = await new Promise((resolve, reject) => {
        const uploadParams = {
          folder,
          public_id: fileName,
          resource_type: 'image', // In Cloudinary, image resource_type allows PDF multi-page rendering to PNG/JPG
        };
        if (!isPdf) {
          uploadParams.transformation = [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadParams,
          (error, result) => {
            if (error) {
              logger.warn('Cloudinary upload stream notice:', error.message);
              return reject(error);
            }
            const previewUrl = isPdf
              ? result.secure_url.replace(/\.pdf(\?.*)?$/i, '.png$1')
              : result.secure_url;

            resolve({
              url: result.secure_url,
              previewUrl,
              localUrl: `/uploads/${localFileName}`,
              publicId: result.public_id,
              format: result.format || (isPdf ? 'pdf' : 'jpg'),
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              isPdf,
              provider: 'cloudinary',
            });
          }
        );

        uploadStream.end(fileBuffer);
      });

      return cldResult;
    } catch (cldErr) {
      logger.warn('Cloudinary upload unsuccessful, falling back smoothly to local storage:', cldErr.message);
      return localResult;
    }
  }

  return localResult;
}

module.exports = {
  uploadImageBuffer,
};
