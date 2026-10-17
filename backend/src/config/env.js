require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/carzodrive',
  partnerMongodbUri: process.env.PARTNER_MONGODB_URI || 'mongodb://localhost:27017/carzodrive_partners',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_carzodrive_2026_super_secure_key_32chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_carzodrive_2026_super_secure_key_32chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '60d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || 'test_app_id',
    secretKey: process.env.CASHFREE_SECRET_KEY || 'test_secret_key',
    webhookSecret: process.env.CASHFREE_WEBHOOK_SECRET || 'test_webhook_secret',
    environment: process.env.CASHFREE_ENVIRONMENT || 'sandbox',
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@carzodrive.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe@123',
    name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'carzodrive',
  },
  email: {
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'CARZODRIVE Concierge <no-reply@carzodrive.com>',
  },
};

function validateEnv() {
  if (process.env.NODE_ENV === 'production') {
    const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
    }
  }
}

module.exports = { env, validateEnv };
