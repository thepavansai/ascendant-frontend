import { useQuery } from '@tanstack/react-query';
import { missionsApi } from '../api/missions';

export function useMissions() {
  const missionsQuery = useQuery({
    queryKey: ['missions'],
    queryFn: () => missionsApi.getAll().then((res) => res.data),
  });

  const nextMissionQuery = useQuery({
    queryKey: ['missions', 'next'],
    queryFn: () => missionsApi.getNext(),
  });

  return {
    missions: missionsQuery.data ?? [],
    isLoadingMissions: missionsQuery.isLoading,
    missionsError: missionsQuery.error,
    nextMission: nextMissionQuery.data ?? null,
    isLoadingNext: nextMissionQuery.isLoading,
  };
}

export function useMissionDetail(id: string) {
  return useQuery({
    queryKey: ['missions', id],
    queryFn: () => missionsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
