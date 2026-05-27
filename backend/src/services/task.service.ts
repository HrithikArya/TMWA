import mongoose from 'mongoose';
import { Task, ITask } from '../models/task.model';
import { AppError } from '../middleware/errorHandler';

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  q?: string;
  sortBy?: string;
  order?: string;
  userId?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedTasks {
  tasks: ITask[];
  pagination: PaginationMeta;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}

export const getTasks = async (
  userId: string,
  role: string,
  params: TaskQueryParams
): Promise<PaginatedTasks> => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    q,
    sortBy = 'createdAt',
    order = 'desc',
    userId: filterUserId,
  } = params;

  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(Math.max(1, Number(limit)), 50);
  const sortOrder = order === 'asc' ? 1 : -1;

  const matchFilter: mongoose.FilterQuery<ITask> = {};

  if (role !== 'admin') {
    matchFilter.owner = new mongoose.Types.ObjectId(userId);
  } else if (filterUserId) {
    matchFilter.owner = new mongoose.Types.ObjectId(filterUserId);
  }

  if (status && status !== 'all') {
    matchFilter.status = status;
  }

  if (priority) {
    matchFilter.priority = priority;
  }

  if (q) {
    matchFilter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  const sortStage: Record<string, 1 | -1> =
    sortBy === 'priority' ? { priorityOrder: sortOrder } : { [sortBy]: sortOrder };

  type AggregateResult = {
    tasks: ITask[];
    totalCount: { count: number }[];
  };

  const pipeline: mongoose.PipelineStage[] = [
    { $match: matchFilter },
    {
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'high'] }, then: 3 },
              { case: { $eq: ['$priority', 'medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'low'] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },
    { $sort: sortStage },
    {
      $facet: {
        tasks: [
          { $skip: (safePage - 1) * safeLimit },
          { $limit: safeLimit },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'ownerData',
            },
          },
          { $unwind: '$ownerData' },
          {
            $addFields: {
              owner: {
                _id: '$ownerData._id',
                name: '$ownerData.name',
                email: '$ownerData.email',
              },
            },
          },
          { $project: { ownerData: 0, priorityOrder: 0 } },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  const result = await Task.aggregate<AggregateResult>(pipeline);
  const tasks = result[0]?.tasks ?? [];
  const total = result[0]?.totalCount[0]?.count ?? 0;
  const totalPages = Math.ceil(total / safeLimit);

  return {
    tasks,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
};

export const getTask = async (taskId: string, userId: string, role: string): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404, 'NOT_FOUND');
  if (role !== 'admin' && task.owner.toString() !== userId) {
    throw new AppError('Not authorized to access this task', 403, 'FORBIDDEN');
  }
  await task.populate('owner', 'name email');
  return task;
};

export const createTask = async (userId: string, dto: CreateTaskDto): Promise<ITask> => {
  const task = await Task.create({
    title: dto.title,
    description: dto.description ?? '',
    priority: dto.priority ?? 'medium',
    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    owner: new mongoose.Types.ObjectId(userId),
  });
  await task.populate('owner', 'name email');
  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  role: string,
  dto: Partial<Pick<ITask, 'title' | 'description' | 'status' | 'priority'> & { dueDate?: string }>
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404, 'NOT_FOUND');
  if (role !== 'admin' && task.owner.toString() !== userId) {
    throw new AppError('Not authorized to update this task', 403, 'FORBIDDEN');
  }

  if (dto.title !== undefined) task.title = dto.title;
  if (dto.description !== undefined) task.description = dto.description;
  if (dto.status !== undefined) task.status = dto.status;
  if (dto.priority !== undefined) task.priority = dto.priority;
  if (dto.dueDate !== undefined) {
    task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
  }

  await task.save();
  await task.populate('owner', 'name email');
  return task;
};

export const deleteTask = async (
  taskId: string,
  userId: string,
  role: string
): Promise<void> => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404, 'NOT_FOUND');
  if (role !== 'admin' && task.owner.toString() !== userId) {
    throw new AppError('Not authorized to delete this task', 403, 'FORBIDDEN');
  }
  await task.deleteOne();
};

export const toggleStatus = async (taskId: string, userId: string): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404, 'NOT_FOUND');
  if (task.owner.toString() !== userId) {
    throw new AppError('Not authorized to update this task', 403, 'FORBIDDEN');
  }
  task.status = task.status === 'pending' ? 'completed' : 'pending';
  await task.save();
  await task.populate('owner', 'name email');
  return task;
};
