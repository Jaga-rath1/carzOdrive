process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_min_32_characters_long_ok';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars_long_ok';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.PORT = '5001';
process.env.CASHFREE_APP_ID = 'test_app_id';
process.env.CASHFREE_SECRET_KEY = 'test_secret_key';
process.env.CASHFREE_WEBHOOK_SECRET = 'test_webhook_secret';
process.env.CASHFREE_ENVIRONMENT = 'sandbox';
process.env.FRONTEND_URL = 'http://localhost:3000';
// MONGODB_URI is set by globalSetup via MongoMemoryServer
