const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
  cloudinary,
  isCloudinaryConfigured,
} = require('../config/cloudinary');
const { env } = require('../config/env');
const logger = require('../utils/logger');

const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

function storageError() {
  const error = new Error(
    'Document storage is unavailable. Please try uploading again.'
  );
  error.status = 503;
  error.statusCode = 503;
  return error;
}

async function uploadImageBuffer(fileBuffer, options = {}) {
  const isProduction = env.nodeEnv === 'production';
  const configured = isCloudinaryConfigured();

  if (isProduction && !configured) {
    logger.error('Production uploads require Cloudinary configuration.');
    throw storageError();
  }

  const folder =
    options.folder || env.cloudinary.folder || 'carzodrive/vehicles';

  const fileName =
    `${options.prefix || 'img'}-${Date.now()}-${uuidv4().slice(0, 8)}`;

  const isPdf =
    options.mimetype === 'application/pdf' ||
    Boolean(options.mimetype?.includes('pdf'));

  const ext = isPdf
    ? '.pdf'
    : options.mimetype
      ? `.${options.mimetype.split('/')[1] || 'jpg'}`
      : '.jpg';

  const localFileName = `${fileName}${ext}`;
  const localUrl = `/uploads/${localFileName}`;
  let localSaved = false;

  // Local fallback is available only outside production.
  if (!isProduction) {
    try {
      await fs.promises.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
      await fs.promises.writeFile(
        path.join(LOCAL_UPLOADS_DIR, localFileName),
        fileBuffer
      );
      localSaved = true;
    } catch (error) {
      logger.warn('Local upload write failed:', error.message);
    }
  }

  if (configured) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadParams = {
          folder,
          public_id: fileName,
          resource_type: 'image',
        };

        if (!isPdf) {
          uploadParams.transformation = [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ];
        }

        const stream = cloudinary.uploader.upload_stream(
          uploadParams,
          (error, uploaded) => {
            if (error) return reject(error);

            if (!uploaded?.secure_url) {
              return reject(new Error('Storage returned no upload URL.'));
            }

            resolve(uploaded);
          }
        );

        stream.on('error', reject);
        stream.end(fileBuffer);
      });

      return {
        url: result.secure_url,
        previewUrl: isPdf
          ? result.secure_url.replace(/\.pdf(\?.*)?$/i, '.png$1')
          : result.secure_url,
        ...(localSaved ? { localUrl } : {}),
        publicId: result.public_id,
        format: result.format || (isPdf ? 'pdf' : 'jpg'),
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        isPdf,
        provider: 'cloudinary',
      };
    } catch (error) {
      logger.warn('Cloudinary upload failed:', error.message);

      if (isProduction) {
        throw storageError();
      }
    }
  }

  if (!localSaved) {
    throw storageError();
  }

  return {
    url: localUrl,
    previewUrl: localUrl,
    localUrl,
    publicId: fileName,
    format: ext.replace('.', ''),
    isPdf,
    provider: 'local',
  };
}

module.exports = {
  uploadImageBuffer,
};
