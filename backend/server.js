import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';

// Bot import (support both approaches)
import createBot from './bot/bot.js';

console.log('🚀 Starting Safebot server...');
console.log('✅ Environment variables loaded.');

const port = process.env.PORT || 5000;
console.log(`⚡ Server will run on port ${port}.`);

// Connect to MongoDB
console.log('🔗 Connecting to MongoDB...');
const dbConnected = await connectDB();
if (!dbConnected) {
  console.error('❌ Database connection failed. Server cannot start.');
  process.exit(1);
}

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://umat-chatbot-frontend.onrender.com", // deployed frontend
  "https://5e39cf295eda.ngrok-free.app" // ngrok dev tunnel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () =>
  console.log(`✅ Server is live and listening on port ${port}`)
);

// Telegram bot startup
const BOT_TOKEN = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

if (BOT_TOKEN) {
  console.log('🤖 Telegram bot token found. Launching bot...');
  try {
    const bot = createBot();
    bot.launch()
      .then(() => console.log('✅ Telegram bot is running!'))
      .catch(err => console.error(`❌ Bot launch failed: ${err.message}`));
  } catch (err) {
    console.error(`❌ Bot creation failed: ${err.message}`);
  }
} else {
  console.warn('⚠️ Telegram bot token not configured. Skipping bot launch.');
}
