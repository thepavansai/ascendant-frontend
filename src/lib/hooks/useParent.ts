import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentApi } from '../api/parent';

export function useParent(parentId: string) {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ['parent', parentId, 'dashboard'],
    queryFn: () => parentApi.getDashboard(parentId).then((res) => res.data),
    enabled: !!parentId,
  });

  const approveMutation = useMutation({
    mutationFn: ({ childId }: { childId: string }) => parentApi.approveChild(parentId, childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
    },
  });

  const linkChildMutation = useMutation({
    mutationFn: (data: { parent_email: string; child_email: string }) => parentApi.linkChild(data),
  });

  return {
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    approveChild: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    linkChild: linkChildMutation.mutateAsync,
    isLinking: linkChildMutation.isPending,
  };
}
