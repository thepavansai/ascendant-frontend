import apiClient from './client';
import { MissionSummary, MissionDetail } from '../types/mission.types';

export const missionsApi = {
  getAll: () => apiClient.get<MissionSummary[]>('/missions'),
  getNext: async (): Promise<MissionDetail | null> => {
    const res = await apiClient.get<MissionDetail>('/missions/next', {
      validateStatus: (status) => status === 200 || status === 204,
    });
    return res.status === 204 ? null : res.data;
  },
  getById: (id: string) => apiClient.get<MissionDetail>(`/missions/${id}`),
};
