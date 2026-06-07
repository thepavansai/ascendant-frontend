import apiClient from './client';
import { AdminUser } from '../types/admin.types';

export const adminApi = {
  listUsers: (params?: { role?: string; limit?: number }) =>
    apiClient.get<AdminUser[]>('/admin/users', { params }),
  createMission: (data: Record<string, unknown>) =>
    apiClient.post<{ id: string; title: string; message: string }>('/admin/missions', data),
  updateMission: (id: string, data: Record<string, unknown>) =>
    apiClient.put<{ id: string; message: string }>(`/admin/missions/${id}`, data),
  deactivateMission: (id: string) => apiClient.delete(`/admin/missions/${id}`),
};
