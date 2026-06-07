'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Lightbulb, Hammer, ChevronRight, ChevronLeft, User, Trophy, Bot, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ScoreCircle from '@/components/evaluation/ScoreCircle';
import { responsesApi } from '@/lib/api/responses';
import PageLoader from '@/components/ui/page-loader';

import { useTokenStore } from '@/lib/store/tokenStore';

function ResultsContent() {
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const failed = searchParams.get('failed');
  const { userRole } = useTokenStore();
  const isAdult = userRole === 'PARENT' || userRole === 'ADMIN';

  const { data, isLoading } = useQuery({
    queryKey: ['evaluation', responseId],
    queryFn: () => responsesApi.getEvaluation(responseId!).then((res) => res.data),
    enabled: !!responseId,
    refetchInterval: (query) => {
      const result = query.state.data;
      if (result?.status === 'PENDING') return 2000;
      return false;
    },
  });

  const [xpCount, setXpCount] = useState(0);
  const eval_ = data?.evaluation;
  const finalScore = eval_?.finalScore ?? 0;
  const xpEarned = data?.xpEarned ?? Math.round(finalScore * 100);
  const leveledUp = data?.leveledUp ?? false;

  useEffect(() => {
    if (!eval_) return;
    const timer = setInterval(() => {
      setXpCount((prev) => {
        if (prev >= xpEarned) {
          clearInterval(timer);
          return xpEarned;
        }
        return prev + Math.max(1, Math.floor(xpEarned / 20));
      });
    }, 40);

    return () => clearInterval(timer);
  }, [eval_, xpEarned, leveledUp]);

  if (isLoading || data?.status === 'PENDING') return <PageLoader />;

  if (failed || data?.status === 'FAILED' || !eval_) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Evaluation unavailable</h1>
          <p className="text-muted mb-6">Something went wrong while evaluating your response.</p>
          <Link href={isAdult ? (userRole === 'PARENT' ? '/parent/dashboard' : '/admin/dashboard') : '/missions'}>
            <Button className="btn-primary">Back to {isAdult ? 'Dashboard' : 'Missions'}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const attributes = [
    { name: 'Intellect', score: eval_.intellectScore, icon: Brain, color: 'purple' },
    { name: 'Judgment', score: eval_.judgmentScore, icon: Target, color: 'amber' },
    { name: 'Awareness', score: eval_.awarenessScore, icon: Lightbulb, color: 'teal' },
    { name: 'Clarity', score: eval_.clarityScore, icon: Hammer, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {leveledUp && data.newLevel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="w-full bg-gradient-to-r from-amber/40 via-surface2 to-amber/40 border border-amber/30 rounded-3xl p-8 text-center"
          >
            <Trophy className="text-amber mb-4 mx-auto animate-bounce" size={48} />
            <h2 className="text-4xl font-heading font-bold text-white mb-2">LEVEL UP!</h2>
            <p className="text-amber font-bold text-lg">Welcome to Level {data.newLevel}</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-center bg-surface border border-border rounded-[40px] p-12 shadow-2xl">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-heading font-bold mb-2">Mission Complete!</h1>
            <p className="text-muted text-lg">Here&apos;s how you did.</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-bold text-white">+{xpCount} XP</span>
            </div>
          </div>
          <div className="flex justify-center">
            <ScoreCircle score={finalScore} size={220} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {attributes.map((attr) => (
            <Card key={attr.name} className="p-6 bg-surface border-border flex flex-col items-center text-center">
              <attr.icon size={20} style={{ color: `var(--color-${attr.color})` }} className="mb-3" />
              <div className="text-[10px] font-bold text-muted uppercase mb-1">{attr.name}</div>
              <div className="text-2xl font-mono font-bold text-white">
                {attr.score?.toFixed(1)}/10
              </div>
            </Card>
          ))}
        </div>

        {eval_.feedbackText && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 border-l-8 border-l-teal bg-surface2/50 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-teal" size={24} />
                <h3 className="text-lg font-heading font-bold">Your Response</h3>
              </div>
              {data.selectedChoice ? (
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  <div className="text-sm font-bold text-muted uppercase">Selected Option</div>
                  <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-teal/20 text-teal font-bold flex items-center justify-center shrink-0">
                      {data.selectedChoice}
                    </div>
                    <span className="font-bold">{data.answerText}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-surface p-6 rounded-xl border border-border flex-1">
                  <p className="text-offwhite whitespace-pre-wrap font-medium">
                    {data.answerText}
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-8 border-l-8 border-l-purple bg-surface2/50 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Bot className="text-purple" size={24} />
                <h3 className="text-lg font-heading font-bold">Mentor Feedback</h3>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border flex-1 flex flex-col justify-center">
                <p className="text-offwhite text-lg leading-relaxed italic">
                  &ldquo;{eval_.feedbackText}&rdquo;
                </p>
              </div>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          {isAdult ? (
            <Button 
              className="btn-primary px-12 h-14 text-xl" 
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="mr-2" /> Back
            </Button>
          ) : (
            <>
              <Link href="/missions">
                <Button className="btn-primary px-12 h-14 text-xl">
                  Next Mission <ChevronRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="btn-ghost px-12 h-14 text-xl">
                  <User className="mr-2" /> View Profile
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MissionResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
