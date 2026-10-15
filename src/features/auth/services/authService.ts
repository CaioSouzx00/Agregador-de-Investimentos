import { apiClient } from '@/shared/services/api/client';
import {
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  UserResponse,
} from '@/shared/types/api';

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/v1/auth/login', payload);
    return data;
  },

  register: async (payload: CreateUserRequest): Promise<void> => {
    await apiClient.post('/v1/users', payload);
  },

  getUserById: async (userId: string): Promise<UserResponse> => {
    const { data } = await apiClient.get<UserResponse>(`/v1/users/${userId}`);
    return data;
  },
};
