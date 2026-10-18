const cloudinary = require('cloudinary').v2;
const { env } = require('./env');
const logger = require('../utils/logger');

const isConfigured = Boolean(
  env.cloudinary.cloudName &&
  env.cloudinary.apiKey &&
  env.cloudinary.apiSecret
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  logger.success(`✓ Cloudinary CDN active [Cloud: ${env.cloudinary.cloudName}]`);
} else {
  logger.info('ℹ️ Cloudinary: Keys pending in .env -> Using local uploads directory fallback (Everything functional)');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured: () => Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret),
};
