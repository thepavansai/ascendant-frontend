import { useQuery } from '@tanstack/react-query';
import { playerApi } from '../api/player';

export function usePlayer(userId: string, limit = 30) {
  const profileQuery = useQuery({
    queryKey: ['player', userId, 'profile'],
    queryFn: () => playerApi.getProfile(userId).then((res) => res.data),
    enabled: !!userId,
  });

  const progressionQuery = useQuery({
    queryKey: ['player', userId, 'progression', limit],
    queryFn: () => playerApi.getProgression(userId, limit).then((res) => res.data),
    enabled: !!userId,
  });

  const statsQuery = useQuery({
    queryKey: ['player', userId, 'stats'],
    queryFn: () => playerApi.getWeeklyStats(userId).then((res) => res.data),
    enabled: !!userId,
  });

  return {
    profile: profileQuery.data,
    progression: progressionQuery.data,
    stats: statsQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    isLoadingProgression: progressionQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
  };
}
