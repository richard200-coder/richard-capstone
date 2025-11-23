import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRouter from './src/routes/auth.routes.js';
import smsRouter from './src/routes/sms.routes.js';
import quizRouter from './src/routes/quiz.routes.js';
import { notFoundHandler, errorHandler } from './src/middleware/error.middleware.js';

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnplay';

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/sms', smsRouter);
app.use('/api/quizzes', quizRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  } catch (err) {
    console.error('Server start failed', err);
    process.exit(1);
  }
}

start();
