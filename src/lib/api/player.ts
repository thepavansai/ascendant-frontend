import apiClient from './client';
import { PlayerProfile, ProgressionEntry, WeeklyStats } from '../types/player.types';

export const playerApi = {
  getProfile: (userId: string) => apiClient.get<PlayerProfile>(`/player/${userId}/profile`),
  getProgression: (userId: string, limit = 30) =>
    apiClient.get<ProgressionEntry[]>(`/player/${userId}/progression`, { params: { limit } }),
  getWeeklyStats: (userId: string) =>
    apiClient.get<WeeklyStats>(`/player/${userId}/stats/weekly`),
};
