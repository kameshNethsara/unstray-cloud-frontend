export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}