import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import { env } from './config/env.js';
import { isDbConnected } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import municipalityRoutes from './routes/municipality.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import userRoutes from './routes/user.routes.js';
import workOrderRoutes from './routes/workOrder.routes.js';
import escalationRoutes from './routes/escalation.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import slaRoutes from './routes/sla.routes.js';
import auditRoutes from './routes/audit.routes.js';
import aiChatRoutes from './routes/aiChat.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Renderer desktop integration
}));

// CORS setup allowing Electron / Vite dev server
app.use(cors({
  origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Attach Request ID
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  const dbStatus = isDbConnected();
  const statusCode = dbStatus ? 200 : 503;
  res.status(statusCode).json({
    success: dbStatus,
    data: {
      status: dbStatus ? 'OPERATIONAL' : 'DATABASE_UNAVAILABLE',
      platform: 'NagarSetu AI Civic Operations REST API',
      version: '1.0.0',
      database: dbStatus ? 'CONNECTED' : 'DISCONNECTED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: dbStatus
      ? 'NagarSetu AI REST API is fully operational.'
      : 'Governance API Unavailable: MongoDB connection not established.',
  });
});

// Database Readiness Gatekeeper Middleware for all /api/v1/ routes (except /health & /analytics/public)
app.use('/api/v1', (req, res, next) => {
  if (req.path === '/health' || req.path === '/analytics/public') return next();
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'GOVERNANCE_API_UNAVAILABLE',
        message: 'Governance API Unavailable: Unable to connect to the NagarSetu MongoDB database.',
      },
      requestId: req.requestId,
    });
  }
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/municipalities', municipalityRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use('/api/v1/escalations', escalationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/sla', slaRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/ai', aiChatRoutes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;
