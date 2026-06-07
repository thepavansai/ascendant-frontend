'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Lightbulb, Hammer, Clock, Send, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useMissionDetail } from '@/lib/hooks/useMissions';
import { useAuth } from '@/lib/hooks/useAuth';
import { responsesApi } from '@/lib/api/responses';
import PageLoader from '@/components/ui/page-loader';

export default function MissionPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { userId } = useAuth();
  const { data: mission, isLoading } = useMissionDetail(resolvedParams.id);
  const [response, setResponse] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const wordCount = response.split(/\s+/).filter(Boolean).length;
  const isMinWordsMet = (mission?.scenario?.openResponse === false && selectedChoice) || wordCount >= 10;

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!userId || !mission?.scenario?.id) {
      setSubmitError('Missing user or scenario. Please sign in again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await responsesApi.submit({
        userId,
        missionId: mission.id,
        scenarioId: mission.scenario.id,
        answerText: response,
        selectedChoice: selectedChoice ?? undefined,
      });
      router.push(`/missions/${resolvedParams.id}/loading?responseId=${result.data.responseId}`);
    } catch {
      setSubmitError('Failed to submit response. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!mission) {
    return <div className="p-8 text-center text-muted">Mission not found.</div>;
  }

  const scenarioContext = mission.scenario?.context ?? mission.narrative;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link href={`/missions/${resolvedParams.id}`} className="text-muted hover:text-white">
            <ChevronRight className="rotate-180" />
          </Link>
          <span className="font-heading font-bold text-lg hidden md:block">{mission.title}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted font-mono text-sm">
            <Clock size={16} /> {formatTime(elapsedTime)}
          </div>
          <div
            className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold border transition-colors',
              wordCount >= 50
                ? 'bg-green/10 border-green/30 text-green'
                : wordCount >= 20
                  ? 'bg-amber/10 border-amber/30 text-amber'
                  : 'bg-border/20 border-border/30 text-muted'
            )}
          >
            {wordCount} WORDS
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[40%] bg-surface2/30 border-r border-border overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col gap-8 max-w-xl mx-auto">
            <div>
              <span className="text-[10px] font-bold text-purple uppercase tracking-[0.2em] mb-4 block">
                THE SCENARIO
              </span>
              <Card className="p-6 bg-surface/50 border-border">
                <p className="text-offwhite text-sm leading-relaxed whitespace-pre-line">
                  {scenarioContext}
                </p>
              </Card>
            </div>

            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 block">
                YOU&apos;LL BE EVALUATED ON
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Brain, label: 'Intellect', color: 'purple' },
                  { icon: Target, label: 'Judgment', color: 'amber' },
                  { icon: Lightbulb, label: 'Awareness', color: 'teal' },
                  { icon: Hammer, label: 'Clarity', color: 'green' },
                ].map((attr, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface/30 border border-border flex items-center gap-3"
                  >
                    <attr.icon size={16} style={{ color: `var(--color-${attr.color})` }} />
                    <span className="text-xs font-medium text-offwhite">{attr.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-background p-8 flex flex-col overflow-hidden relative">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
              YOUR RESPONSE
            </span>

            {mission.scenario?.choices && mission.scenario.choices.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {mission.scenario.choices.map((choice, i) => {
                  // The backend sends choices as List<Map<String, String>>
                  // Each map has a single key-value pair, e.g. { "A": "Wait for help" }
                  const key = Object.keys(choice)[0];
                  const value = choice[key];
                  const isSelected = selectedChoice === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedChoice(key)}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all flex items-start gap-4",
                        isSelected 
                          ? "bg-purple/20 border-purple text-white" 
                          : "bg-surface/50 border-border text-offwhite hover:bg-surface hover:border-purple/50"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0",
                        isSelected ? "bg-purple border-purple text-white" : "border-muted text-muted"
                      )}>
                        {key}
                      </div>
                      <span className="text-sm pt-0.5 leading-relaxed">{value}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {(!mission.scenario?.choices || mission.scenario.choices.length === 0 || mission.scenario.openResponse !== false) && (
              <div className="flex-1 relative flex flex-col">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Think out loud. Break down the problem step by step. What would you do and why?"
                  className="flex-1 bg-surface2/50 border-border text-white text-lg leading-relaxed p-8 rounded-2xl resize-none focus:border-purple focus:ring-4 focus:ring-purple/10 custom-scrollbar font-body min-h-[200px]"
                />
              </div>
            )}

            {submitError && <p className="text-red text-sm">{submitError}</p>}

            <button
              type="button"
              onClick={() => setIsNudgeOpen(!isNudgeOpen)}
              className="flex items-center gap-2 text-xs font-bold text-purple hover:text-purple-light transition-colors w-fit"
            >
              <Lightbulb size={12} /> Need a thinking nudge?
            </button>
            <AnimatePresence>
              {isNudgeOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="p-4 bg-surface/50 border-purple/20 text-xs text-offwhite">
                    Consider trade-offs, risks, and what evidence would change your mind.
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <footer className="h-20 bg-surface border-t border-border px-8 flex items-center justify-between z-50">
        <span className={cn('text-xs font-bold', (!isMinWordsMet) ? 'text-red' : 'text-green')}>
          {mission.scenario?.openResponse === false ? 'SELECT AN OPTION' : `${wordCount} / 10 WORDS MIN`}
        </span>

        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          disabled={!isMinWordsMet}
          className="btn-primary px-8 h-12"
        >
          Submit Response <Send size={18} className="ml-2" />
        </Button>
      </footer>

      <AlertDialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <AlertDialogContent className="bg-surface border-border text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl">Ready to Submit?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted">
              Your thinking will be evaluated. You won&apos;t be able to edit after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel className="btn-ghost m-0">Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting} className="btn-primary m-0">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Yes, Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
