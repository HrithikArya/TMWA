import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/apiResponse';

export const requireRole =
  (role: 'admin' | 'user') =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      error(res, 'Insufficient permissions', 403, 'FORBIDDEN');
      return;
    }
    next();
  };
