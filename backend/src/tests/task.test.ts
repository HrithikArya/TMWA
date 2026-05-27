import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongod: MongoMemoryServer;
let userToken: string;
let otherUserToken: string;

const signupAndLogin = async (email: string): Promise<string> => {
  const res = await request(app).post('/api/auth/signup').send({
    name: 'Test User',
    email,
    password: 'Password123',
  });
  return res.body.data.token as string;
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  userToken = await signupAndLogin('user@example.com');
  otherUserToken = await signupAndLogin('other@example.com');
});

const createTask = async (token: string, overrides = {}) =>
  request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test task', priority: 'medium', ...overrides });

describe('GET /api/tasks', () => {
  it('returns empty list for new user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(0);
    expect(res.body.data.pagination.total).toBe(0);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('only returns own tasks', async () => {
    await createTask(userToken, { title: 'My task' });
    await createTask(otherUserToken, { title: 'Other task' });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].title).toBe('My task');
  });

  it('filters by status', async () => {
    await createTask(userToken, { title: 'Pending task' });
    const created = await createTask(userToken, { title: 'Completed task' });
    const taskId = created.body.data.task._id as string;

    await request(app)
      .patch(`/api/tasks/${taskId}/toggle`)
      .set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get('/api/tasks?status=completed')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].status).toBe('completed');
  });

  it('searches by title', async () => {
    await createTask(userToken, { title: 'Fix the bug' });
    await createTask(userToken, { title: 'Write tests' });

    const res = await request(app)
      .get('/api/tasks?q=bug')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].title).toBe('Fix the bug');
  });
});

describe('POST /api/tasks', () => {
  it('creates a task successfully', async () => {
    const res = await createTask(userToken, { title: 'New task', priority: 'high' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.title).toBe('New task');
    expect(res.body.data.task.status).toBe('pending');
    expect(res.body.data.task.priority).toBe('high');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ priority: 'low' });

    expect(res.status).toBe(400);
  });

  it('ignores owner from body and uses JWT user', async () => {
    const fakeOwnerId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Task', owner: fakeOwnerId });

    expect(res.status).toBe(201);
    expect(res.body.data.task.owner._id).not.toBe(fakeOwnerId);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('updates own task', async () => {
    const created = await createTask(userToken);
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Updated title', priority: 'low' });

    expect(res.status).toBe(200);
    expect(res.body.data.task.title).toBe('Updated title');
    expect(res.body.data.task.priority).toBe('low');
  });

  it('returns 403 when updating another user task', async () => {
    const created = await createTask(otherUserToken);
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes own task', async () => {
    const created = await createTask(userToken);
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it('returns 403 when deleting another user task', async () => {
    const created = await createTask(otherUserToken);
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/tasks/:id/toggle', () => {
  it('toggles status from pending to completed', async () => {
    const created = await createTask(userToken);
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/toggle`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe('completed');
  });

  it('toggles status back to pending', async () => {
    const created = await createTask(userToken);
    const taskId = created.body.data.task._id as string;

    await request(app)
      .patch(`/api/tasks/${taskId}/toggle`)
      .set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/toggle`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.body.data.task.status).toBe('pending');
  });
});
