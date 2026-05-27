import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
  });
};

start().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
