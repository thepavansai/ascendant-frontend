import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import { missionsApi } from '../api/missions';

export function useAdminDashboard() {
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.listUsers({ limit: 500 }).then((res) => res.data),
  });

  const missionsQuery = useQuery({
    queryKey: ['missions'],
    queryFn: () => missionsApi.getAll().then((res) => res.data),
  });

  const users = usersQuery.data ?? [];
  const missions = missionsQuery.data ?? [];

  return {
    users,
    missions,
    isLoading: usersQuery.isLoading || missionsQuery.isLoading,
    stats: {
      totalUsers: users.length,
      activeChildren: users.filter((u) => u.role === 'CHILD').length,
      totalMissions: missions.length,
      parents: users.filter((u) => u.role === 'PARENT').length,
    },
  };
}
