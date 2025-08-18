import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import incidentRoutes from './routes/incidentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import createBot from './bot/bot.js';

console.log('Starting Safebot server...');
console.log('Environment variables loaded.');

const port = process.env.PORT || 5000;
console.log(`Server will run on port ${port}.`);

// Connect to MongoDB
console.log('Connecting to MongoDB...');
const dbConnected = await connectDB();
if (!dbConnected) {
  console.error('Database connection failed. Server cannot start.');
  process.exit(1);
}

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://5e39cf295eda.ngrok-free.app'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.use(cookieParser());
 
 app.use('/api/users', userRoutes);
  app.use('/api/incidents', incidentRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/test', testRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`✅ Server is live and listening on port ${port}`));

// Only start bot if token is configured
if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('Telegram bot token found. Creating and launching bot...');
  try {
    const bot = createBot();
    bot.launch().then(() => console.log('✅ Telegram bot is running!'))
      .catch(err => console.error(`❌ Bot launch failed: ${err.message}`));
  } catch (err) {
    console.error(`❌ Bot creation failed: ${err.message}`);
  }
} else {
  console.warn('⚠️ Telegram bot token not configured. Skipping bot launch.');
}
