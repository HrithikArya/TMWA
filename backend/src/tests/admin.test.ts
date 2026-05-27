import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/user.model';

let mongod: MongoMemoryServer;
let adminToken: string;
let userToken: string;

const signupUser = async (
  email: string,
  role: 'user' | 'admin' = 'user'
): Promise<string> => {
  const user = await User.create({
    name: 'Test',
    email,
    password: 'Password123',
    role,
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'Password123' });

  // The user was created with create() which triggers the pre-save hook
  // so the password is hashed. But our login uses comparePassword.
  // We need to get the token directly by creating it.
  // Actually, the User.create hashes the password, so login with raw password should work.
  // But wait - User.create triggers the pre-save hook which hashes.
  // Then login tries User.findOne and comparePassword with the raw 'Password123'.
  // comparePassword does bcrypt.compare(candidate, hash) which should work.
  const _ = user; // suppress unused warning
  return loginRes.body.data?.token as string;
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
  adminToken = await signupUser('admin@example.com', 'admin');
  userToken = await signupUser('user@example.com', 'user');
});

const createTask = async (token: string, title = 'Test task') =>
  request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title });

describe('GET /api/admin/tasks', () => {
  it('returns all tasks for admin', async () => {
    await createTask(userToken, 'User task');
    await createTask(adminToken, 'Admin task');

    const res = await request(app)
      .get('/api/admin/tasks')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks.length).toBeGreaterThanOrEqual(2);
  });

  it('returns 403 for regular user', async () => {
    const res = await request(app)
      .get('/api/admin/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('FORBIDDEN');
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/tasks');
    expect(res.status).toBe(401);
  });

  it('supports pagination', async () => {
    for (let i = 0; i < 15; i++) {
      await createTask(userToken, `Task ${i}`);
    }

    const res = await request(app)
      .get('/api/admin/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.body.data.tasks).toHaveLength(10);
    expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(15);
    expect(res.body.data.pagination.hasNext).toBe(true);
  });
});

describe('DELETE /api/admin/tasks/:id', () => {
  it('admin can delete any task', async () => {
    const created = await createTask(userToken, 'User task to delete');
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .delete(`/api/admin/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted by admin');
  });

  it('returns 403 for regular user trying admin delete', async () => {
    const created = await createTask(userToken, 'Task');
    const taskId = created.body.data.task._id as string;

    const res = await request(app)
      .delete(`/api/admin/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/admin/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
