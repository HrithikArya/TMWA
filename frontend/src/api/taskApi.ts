import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { triggerLogout } from '../utils/logoutBridge';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '../types/task.types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  prepareHeaders: headers => {
    const token = localStorage.getItem('tf_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    triggerLogout();
  }
  return result;
};

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery,
  tagTypes: ['Task'],
  endpoints: builder => ({
    getTasks: builder.query<ApiResponse<PaginatedResponse>, TaskQueryParams>({
      query: params => ({ url: '/tasks', params }),
      providesTags: ['Task'],
    }),
    getTask: builder.query<ApiResponse<{ task: Task }>, string>({
      query: id => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<ApiResponse<{ task: Task }>, CreateTaskDto>({
      query: body => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<ApiResponse<{ task: Task }>, { id: string } & UpdateTaskDto>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<ApiResponse<null>, string>({
      query: id => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
    toggleStatus: builder.mutation<ApiResponse<{ task: Task }>, string>({
      query: id => ({ url: `/tasks/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: ['Task'],
    }),
    getAdminTasks: builder.query<ApiResponse<PaginatedResponse>, TaskQueryParams>({
      query: params => ({ url: '/admin/tasks', params }),
      providesTags: ['Task'],
    }),
    adminDeleteTask: builder.mutation<ApiResponse<null>, string>({
      query: id => ({ url: `/admin/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useToggleStatusMutation,
  useGetAdminTasksQuery,
  useAdminDeleteTaskMutation,
} = taskApi;
