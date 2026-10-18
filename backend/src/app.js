const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { env } = require('./config/env');
const router = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/not-found.middleware');

const app = express();

// Trust reverse proxy (nginx, cloudflare, load balancer)
app.set('trust proxy', 1);

// 1. Security Headers via Helmet (configured to allow cross-origin assets for car & bike images)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
  })
);

// 2. High-performance payload compression (Gzip / Deflate)
app.use(compression());

// 3. Request Correlation ID & Performance Tracker
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.id);
  req.startTime = Date.now();
  next();
});

// 4. CORS Policy
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (env.nodeEnv !== 'production') return callback(null, true);
      const allowed = [
        env.frontendUrl,
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ];
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// 5. Body Parsers with limits (preserves rawBody for payment webhooks)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      if (req.originalUrl && req.originalUrl.includes('/webhook')) {
        req.rawBody = buf.toString('utf8');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const path = require('path');
const uploadsController = require('./controllers/uploads.controller');
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  },
  express.static(path.join(__dirname, '../public/uploads'), {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    },
  }),
  uploadsController.serveDocument
);

// 6. Request Logging
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// 7. Security Rate Limiters (Relaxed for local development and profile checks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 100 : 50000,
  skip: (req) => {
    if (env.nodeEnv !== 'production') return true;
    const ip = req.ip || req.connection.remoteAddress || '';
    if (ip.includes('127.0.0.1') || ip === '::1' || ip === 'localhost') return true;
    if (req.path === '/me' || req.path === '/refresh') return true;
    return false;
  },
  message: { success: false, message: 'Too many requests from this IP, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/auth', authLimiter);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 2000 : 100000,
  skip: (req) => {
    if (env.nodeEnv !== 'production') return true;
    const ip = req.ip || req.connection.remoteAddress || '';
    if (ip.includes('127.0.0.1') || ip === '::1' || ip === 'localhost') return true;
    return false;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1', generalLimiter);

// 8. Main API Router
app.use('/api/v1', router);

// 9. Root Health Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'CarzoDrive Production API',
    version: '1.0.0',
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
  });
});

// 10. Centralized Not-Found and Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
