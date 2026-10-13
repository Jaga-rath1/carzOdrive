const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const router = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/not-found.middleware');

const app = express();

// Trust proxy (needed if behind nginx/load balancer)
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [env.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing (limit 10mb to allow images as base64 only if needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (skip in test)
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/auth', authLimiter);

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1', generalLimiter);

// Routes
app.use('/api/v1', router);

// Not found and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
