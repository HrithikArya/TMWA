import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { error } from '../utils/apiResponse';

interface JwtPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    error(res, 'Access token required', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      error(res, 'Token expired', 401, 'TOKEN_EXPIRED');
    } else {
      error(res, 'Invalid token', 401, 'UNAUTHORIZED');
    }
  }
};
