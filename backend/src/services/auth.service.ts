import jwt, { type SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

interface UserResponse {
  _id: IUser['_id'];
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

interface AuthResult {
  token: string;
  user: UserResponse;
}

const generateToken = (user: IUser): string => {
  const opts: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.JWT_SECRET,
    opts
  );
};

const toUserResponse = (user: IUser): UserResponse => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already in use', 409, 'CONFLICT');

  const user = await User.create({ name, email, password });
  const token = generateToken(user);

  return { token, user: toUserResponse(user) };
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');

  const token = generateToken(user);

  return { token, user: toUserResponse(user) };
};
