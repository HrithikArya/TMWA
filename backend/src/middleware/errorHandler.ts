import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error(err.message, { stack: err.stack, path: req.path });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.code ?? err.message,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ success: false, message: 'Validation error', error: err.message });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: 'INVALID_ID' });
    return;
  }

  if (err instanceof TokenExpiredError) {
    res.status(401).json({ success: false, message: 'Token expired', error: 'TOKEN_EXPIRED' });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ success: false, message: 'Invalid token', error: 'UNAUTHORIZED' });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({ success: false, message: 'Duplicate entry', error: 'CONFLICT' });
    return;
  }

  res.status(500).json({ success: false, message: 'Internal server error', error: 'SERVER_ERROR' });
};
