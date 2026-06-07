import apiClient from './client';
import { ParentDashboard } from '../types/parent.types';

export const parentApi = {
  getDashboard: (parentId: string) =>
    apiClient.get<ParentDashboard>(`/parent/${parentId}/dashboard`),
  approveChild: (parentId: string, childId: string) =>
    apiClient.post(`/parent/${parentId}/approve/${childId}`),
  linkChild: (data: { parent_email: string; child_email: string }) =>
    apiClient.post('/parent/link', data),
};
