import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
  Pagination,
  ApiResponse,
  PaginatedResponse,
} from '../../types/task.types';
import { apiFetch } from '../../utils/apiFetch';

interface TasksState {
  items: Task[];
  pagination: Pagination | null;
  adminItems: Task[];
  adminPagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  pagination: null,
  adminItems: [],
  adminPagination: null,
  isLoading: false,
  error: null,
};

const toQuery = (params: TaskQueryParams): string => {
  const sp = new URLSearchParams();
  (Object.entries(params) as [string, unknown][]).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.set(k, String(v));
  });
  return sp.toString();
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: TaskQueryParams, { rejectWithValue }) => {
    try {
      const res = await apiFetch<ApiResponse<PaginatedResponse>>(`/tasks?${toQuery(params)}`);
      return res.data!;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (dto: CreateTaskDto, { rejectWithValue }) => {
    try {
      const res = await apiFetch<ApiResponse<{ task: Task }>>('/tasks', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
      return res.data!.task;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...dto }: { id: string } & UpdateTaskDto, { rejectWithValue }) => {
    try {
      const res = await apiFetch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      });
      return res.data!.task;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiFetch<ApiResponse<null>>(`/tasks/${id}`, { method: 'DELETE' });
      return id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await apiFetch<ApiResponse<{ task: Task }>>(`/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      return res.data!.task;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchAdminTasks = createAsyncThunk(
  'tasks/fetchAdminTasks',
  async (params: TaskQueryParams, { rejectWithValue }) => {
    try {
      const res = await apiFetch<ApiResponse<PaginatedResponse>>(`/admin/tasks?${toQuery(params)}`);
      return res.data!;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const adminDeleteTask = createAsyncThunk(
  'tasks/adminDeleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiFetch<ApiResponse<null>>(`/admin/tasks/${id}`, { method: 'DELETE' });
      return id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminTasks.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminItems = action.payload.tasks;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
