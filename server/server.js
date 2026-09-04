import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './services/dbService.js';
import { initCronJobs } from './jobs/cronScheduler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import motherRoutes from './routes/motherRoutes.js';
import healthCheckRoutes from './routes/healthCheckRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import tipRoutes from './routes/tipRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().substring(11, 19)}] ${req.method} ${req.url}`);
  next();
});

// Health check probe
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'MOTHER+ Maternal Health Continuity Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/mothers', motherRoutes);
app.use('/api/health-check', healthCheckRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Global Error Handler
app.use(errorHandler);

// Initialize DB & Start Server
async function startServer() {
  try {
    await db.init();
    console.log('✔ Database Layer Initialized successfully (store.json)');

    initCronJobs();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌸 MOTHER+ Server running on http://localhost:${PORT}`);
      console.log(`   WhatsApp Webhook: http://localhost:${PORT}/api/whatsapp/webhook`);
      console.log(`   Healthcare API:   http://localhost:${PORT}/api/dashboard/stats`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
