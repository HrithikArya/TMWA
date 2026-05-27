export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskOwner {
  _id: string;
  name: string;
  email?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  owner: TaskOwner;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse {
  tasks: Task[];
  pagination: Pagination;
}

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
