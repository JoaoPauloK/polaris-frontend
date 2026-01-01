import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/auth.service';
import { api } from '../services/api';

vi.mock('../services/api');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
(global as any).localStorage = localStorageMock;

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'testuser@example.com',
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer login e retornar usuário', async () => {
    (api.post as any).mockResolvedValue({ data: { success: true, data: { user: mockUser } } });
    const res = await authService.login({ email: 'testuser@example.com', password: 'test1234' });
    expect(res.success).toBe(true);
    expect(res.data.user.email).toBe('testuser@example.com');
  });

  it('deve registrar usuário', async () => {
    (api.post as any).mockResolvedValue({ data: { success: true, data: { user: mockUser } } });
    const res = await authService.register({ name: 'Test User', email: 'testuser@example.com', password: 'test1234' });
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.user.name).toBe('Test User');
  });

  it('deve atualizar perfil do usuário', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    (api.patch as any).mockResolvedValue({ data: { success: true, data: { user: updatedUser } } });
    const res = await authService.updateProfile({ name: 'Updated Name' });
    expect(res.success).toBe(true);
    expect(res.data.user.name).toBe('Updated Name');
  });

  it('deve fazer logout', async () => {
    (api.post as any).mockResolvedValue({ data: { success: true } });

    await authService.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});