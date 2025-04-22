import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './interfaces/Routers/admin/AuthRoutes';
import ClientRouter from './interfaces/Routers/admin/ClientRouter';
import EmployeeRouter from './interfaces/Routers/admin/EmployeeRouter';
import cors from 'cors';
import { createClient } from 'redis';
import employee from './interfaces/Routers/emplopyee/AuthRouter';
import { errorHandler } from './middleware/errorHandle';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Redis setup
const redisClient = createClient({
  url: 'redis://localhost:6379' 
});

redisClient.on('connect', () => {
  console.log('🔗 Redis connected successfully!');
});

redisClient.on('error', (err: Error) => {
  console.error('❌ Redis connection error:', err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis connect error:', err);
  }
})();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

app.use('/api/admin', authRoutes);
app.use('/api/admin', ClientRouter);
app.use('/api/admin', EmployeeRouter);
app.use('/api/employee', employee);

import { Request, Response, NextFunction } from 'express';

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;