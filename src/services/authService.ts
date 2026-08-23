import api from './api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  // Real Login Call - Spring Boot JWT Response
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/v1/users/login', credentials);
    
    localStorage.setItem('unstray_token', res.data.token);
    localStorage.setItem('unstray_user', JSON.stringify(res.data.user));
    return res.data;
  },

  // Real Register Call - Spring Boot JWT Response
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/v1/users', data);

    localStorage.setItem('unstray_token', res.data.token);
    localStorage.setItem('unstray_user', JSON.stringify(res.data.user));
    return res.data;
  },

  // Fetch Logged-in User Info via JWT Token
  async getCurrentUser(): Promise<User> {
    const res = await api.get<User>('/api/v1/users/me');
    localStorage.setItem('unstray_user', JSON.stringify(res.data));
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('unstray_token');
    localStorage.removeItem('unstray_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('unstray_token');
  },
};