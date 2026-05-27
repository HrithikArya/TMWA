import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as authService from '../services/auth.service';
import { success } from '../utils/apiResponse';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };
  const result = await authService.signup(name, email, password);
  success(res, result, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.login(email, password);
  success(res, result, 'Login successful');
});
