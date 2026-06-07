import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { responsesApi } from '@/lib/api/responses';
import { EvaluationResult } from '@/lib/types/evaluation.types';

export function useEvaluationPoll(responseId: string | null) {
  const [status, setStatus] = useState<'PENDING' | 'DONE' | 'FAILED'>('PENDING');

  const { data, error, isError } = useQuery({
    queryKey: ['evaluation', responseId],
    queryFn: () => responsesApi.getEvaluation(responseId!).then((res) => res.data),
    enabled: !!responseId && status === 'PENDING',
    refetchInterval: (query) => {
      const result = query.state.data as EvaluationResult | undefined;
      if (result?.status === 'DONE' || result?.status === 'FAILED') {
        return false;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (data?.status === 'DONE' || data?.status === 'FAILED') {
      setStatus(data.status);
    }
  }, [data]);

  return {
    data,
    isLoading: status === 'PENDING' && !isError,
    isError,
    status: data?.status ?? 'PENDING',
    error,
  };
}
