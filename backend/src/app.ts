import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import adminRoutes from './routes/admin.routes';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(
  morgan('combined', {
    stream: { write: (msg: string) => logger.info(msg.trim()) },
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests', error: 'RATE_LIMIT_EXCEEDED' },
});
app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', error: 'NOT_FOUND' });
});

app.use(errorHandler);

export default app;
