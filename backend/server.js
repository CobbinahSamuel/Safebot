import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/adminRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bot from './bot/bot.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

// ✅ Fallback for Telegram token
const BOT_TOKEN = process.env.TELEGRAM_TOKEN || "8070044484:AAE3JziVdYMY9mQXBslUkwfbEfGUTN2FfqM";

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

 app.use(cookieParser());
 
 app.use('/api/admin', adminRoutes);
  app.use('/api/incidents', incidentRoutes);
  app.use('/api/auth', authRoutes);





// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`🚀 Server started on port ${port}`));

// ✅ Ensure bot launches with correct token
if (BOT_TOKEN) {
  bot.launch()
    .then(() => console.log("🤖 Telegram bot running!"))
    .catch(err => console.error("❌ Failed to launch bot:", err));
} else {
  console.error("⚠️ Telegram bot token missing. Bot not started.");
}
