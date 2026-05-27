import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongod: MongoMemoryServer;

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
});

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123',
};

describe('POST /api/auth/signup', () => {
  it('creates a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/signup').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.role).toBe('user');
  });

  it('returns 400 when name is too short', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...validUser, name: 'A' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...validUser, email: 'notanemail' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when password has no uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...validUser, password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    await request(app).post('/api/auth/signup').send(validUser);
    const res = await request(app).post('/api/auth/signup').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CONFLICT');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(validUser);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it('returns 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'WrongPass123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nope@example.com', password: 'Password123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'Password123' });

    expect(res.status).toBe(400);
  });
});
