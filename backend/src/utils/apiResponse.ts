import { Response } from 'express';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const success = (
  res: Response,
  data: unknown,
  message: string,
  statusCode = 200
): Response => res.status(statusCode).json({ success: true, message, data });

export const error = (
  res: Response,
  message: string,
  statusCode = 500,
  err?: string
): Response => res.status(statusCode).json({ success: false, message, error: err ?? message });

export const paginated = (
  res: Response,
  tasks: unknown[],
  pagination: PaginationMeta,
  message: string
): Response =>
  res.status(200).json({ success: true, message, data: { tasks, pagination } });
