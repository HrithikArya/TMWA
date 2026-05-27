export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
}
