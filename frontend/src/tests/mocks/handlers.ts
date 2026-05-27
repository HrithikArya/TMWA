import { http, HttpResponse } from 'msw';

const API = 'http://localhost:5000/api';

const mockUser = {
  _id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
};

const mockTask = {
  _id: 'task-1',
  title: 'Test task',
  description: 'A test task',
  status: 'pending' as const,
  priority: 'medium' as const,
  dueDate: null,
  owner: mockUser,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const handlers = [
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({
      success: true,
      message: 'Login successful',
      data: { token: 'mock-token-jwt', user: mockUser },
    })
  ),

  http.post(`${API}/auth/signup`, () =>
    HttpResponse.json(
      {
        success: true,
        message: 'Account created',
        data: { token: 'mock-token-jwt', user: mockUser },
      },
      { status: 201 }
    )
  ),

  http.get(`${API}/tasks`, () =>
    HttpResponse.json({
      success: true,
      message: 'Tasks fetched',
      data: {
        tasks: [mockTask],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    })
  ),

  http.post(`${API}/tasks`, () =>
    HttpResponse.json(
      { success: true, message: 'Task created', data: { task: mockTask } },
      { status: 201 }
    )
  ),

  http.put(`${API}/tasks/:id`, () =>
    HttpResponse.json({
      success: true,
      message: 'Task updated',
      data: { task: { ...mockTask, title: 'Updated task' } },
    })
  ),

  http.delete(`${API}/tasks/:id`, () =>
    HttpResponse.json({ success: true, message: 'Task deleted', data: null })
  ),

  http.patch(`${API}/tasks/:id/toggle`, () =>
    HttpResponse.json({
      success: true,
      message: 'Task toggled',
      data: { task: { ...mockTask, status: 'completed' } },
    })
  ),

  http.get(`${API}/admin/tasks`, () =>
    HttpResponse.json({
      success: true,
      message: 'All tasks',
      data: {
        tasks: [mockTask],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    })
  ),

  http.delete(`${API}/admin/tasks/:id`, () =>
    HttpResponse.json({ success: true, message: 'Task deleted by admin', data: null })
  ),
];
