import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as taskService from '../services/task.service';
import { success, paginated } from '../utils/apiResponse';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, priority, q, sortBy, order } = req.query;
  const result = await taskService.getTasks(req.user!.id, req.user!.role, {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    status: status as string | undefined,
    priority: priority as string | undefined,
    q: q as string | undefined,
    sortBy: sortBy as string | undefined,
    order: order as string | undefined,
  });
  paginated(res, result.tasks, result.pagination, 'Tasks fetched successfully');
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTask(req.params.id, req.user!.id, req.user!.role);
  success(res, { task }, 'Task fetched');
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, priority, dueDate } = req.body as {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  };
  const task = await taskService.createTask(req.user!.id, {
    title,
    description,
    priority,
    dueDate,
  });
  success(res, { task }, 'Task created successfully', 201);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.user!.id,
    req.user!.role,
    req.body
  );
  success(res, { task }, 'Task updated successfully');
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id, req.user!.id, req.user!.role);
  success(res, null, 'Task deleted successfully');
});

export const toggleStatus = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.toggleStatus(req.params.id, req.user!.id);
  success(res, { task }, `Task marked as ${task.status}`);
});
