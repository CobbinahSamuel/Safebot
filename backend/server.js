import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

 app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  

 app.use(express.json());
 app.use(express.urlencoded({extended: true})); 

 app.use(cookieParser());
 
 app.use('/api/auth', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

