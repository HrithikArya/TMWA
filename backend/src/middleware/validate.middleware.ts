import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { error } from '../utils/apiResponse';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error(res, 'Validation failed', 400, JSON.stringify(errors.array()));
    return;
  }
  next();
};
