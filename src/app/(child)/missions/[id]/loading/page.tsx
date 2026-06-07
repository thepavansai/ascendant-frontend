'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EvaluationLoadingScreen from '@/components/evaluation/EvaluationLoadingScreen';
import { useEvaluationPoll } from '@/lib/hooks/useEvaluationPoll';

function LoadingContent({ missionId }: { missionId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const { status, isError } = useEvaluationPoll(responseId);

  useEffect(() => {
    if (status === 'DONE') {
      router.push(`/missions/${missionId}/results?responseId=${responseId}`);
    }
    if (status === 'FAILED' || isError) {
      router.push(`/missions/${missionId}/results?responseId=${responseId}&failed=1`);
    }
  }, [status, isError, missionId, responseId, router]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-50">
      <EvaluationLoadingScreen status={status === 'FAILED' ? 'FAILED' : 'PENDING'} />
    </div>
  );
}

export default function EvaluationLoadingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  return (
    <Suspense>
      <LoadingContent missionId={resolvedParams.id} />
    </Suspense>
  );
}
