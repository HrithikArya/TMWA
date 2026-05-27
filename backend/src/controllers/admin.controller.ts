import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as taskService from '../services/task.service';
import { success, paginated } from '../utils/apiResponse';

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, priority, q, sortBy, order, userId } = req.query;
  const result = await taskService.getTasks(req.user!.id, 'admin', {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    status: status as string | undefined,
    priority: priority as string | undefined,
    q: q as string | undefined,
    sortBy: sortBy as string | undefined,
    order: order as string | undefined,
    userId: userId as string | undefined,
  });
  paginated(res, result.tasks, result.pagination, 'All tasks fetched');
});

export const deleteAnyTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id, req.user!.id, 'admin');
  success(res, null, 'Task deleted by admin');
});
