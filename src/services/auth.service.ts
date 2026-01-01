import { api } from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.post<{ success: boolean; data: { user: User } }>('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<RegisterData>): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService;
