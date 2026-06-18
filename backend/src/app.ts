import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.route.js';
import { ValidationError } from './helper/errorClass.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { CLIENT_URL } from './config/env.js';
import type { Request, Response, NextFunction } from 'express';

// Initialization and Middleware
const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
  next(new ValidationError('Test error'));
});

app.use('/api/v1', indexRouter);
app.use(errorHandler);

export default app;
