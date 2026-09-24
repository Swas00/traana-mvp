import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { store } from './models/index.js';
import alertsRouter from './routes/alerts.js';
import sheltersRouter from './routes/shelters.js';
import resourcesRouter from './routes/resources.js';
import assistantRouter from './routes/assistant.js';
import adminRouter from './routes/admin.js';
import datasetsRouter from './routes/datasets.js';
import sachetRouter from './routes/sachet.js';
import { sachetService } from './services/sachetSync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/traana_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/alerts', alertsRouter);
app.use('/api/shelters', sheltersRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/admin', adminRouter);
app.use('/api/datasets', datasetsRouter);
app.use('/api/sachet', sachetRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'TRAANA (Threat Response & Assistance Network for Alerts and Navigation)',
    version: '1.0.0-MVP',
    timestamp: new Date().toISOString(),
    database: store.useMongo ? 'Connected (MongoDB)' : 'Active (Resilient Memory Store)'
  });
});

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../frontend/dist');

// Serve static frontend in production if built
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Root info fallback
  app.get('/', (req, res) => {
    res.json({
      name: 'TRAANA REST API',
      endpoints: [
        '/api/alerts',
        '/api/alerts/active',
        '/api/shelters',
        '/api/shelters/nearby',
        '/api/resources',
        '/api/resources/hospitals',
        '/api/resources/relief',
        '/api/resources/contacts',
        '/api/resources/hazards',
        '/api/assistant',
        '/api/admin/status',
        '/api/admin/trigger-flood',
        '/api/admin/reset-demo',
        '/api/sachet/live-alerts',
        '/api/sachet/telemetry'
      ]
    });
  });
}

// Database initialization & server start
async function startServer() {
  try {
    console.log('[TRAANA] Attempting MongoDB connection...');
    const mongoPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });

    await mongoPromise;
    console.log('✅ [TRAANA] MongoDB connected successfully to ' + MONGODB_URI);
    await store.init(true);
  } catch (mongoErr) {
    console.warn('⚠️ [TRAANA] MongoDB connection timed out or unavailable (' + mongoErr.message + ').');
    console.log('ℹ️ [TRAANA] Running in resilient in-memory mode with full seed data persistence.');
    await store.init(false);
  }

  app.listen(PORT, () => {
    console.log(`🚀 [TRAANA Backend] Server running on http://localhost:${PORT}`);
    // Start continuous synchronization with NDMA SACHET
    sachetService.startAutoSync(60000);
  });
}


startServer();
