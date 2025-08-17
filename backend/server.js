import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import incidentRoutes from './routes/incidentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import bot from './bot/bot.js';

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

const app = express();

 app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
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

app.listen(port, () => console.log(`Server started on port ${port}`));

// Only start bot if token is configured
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot.launch().then(() => console.log("Telegram bot running!"))
    .catch(err => console.log("Bot launch failed:", err.message));
} else {
  console.log("Telegram bot token not configured, skipping bot launch");
}


