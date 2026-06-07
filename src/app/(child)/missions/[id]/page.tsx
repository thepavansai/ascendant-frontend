'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock, Zap, Brain, Target, Lightbulb, Hammer, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DifficultyStars from '@/components/mission/DifficultyStars';
import { useMissionDetail } from '@/lib/hooks/useMissions';
import { cn, formatMissionType } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';

const ATTR_CONFIG = [
  { key: 'intellect', name: 'Intellect', icon: Brain, color: 'purple' },
  { key: 'judgment', name: 'Judgment', icon: Target, color: 'amber' },
  { key: 'awareness', name: 'Awareness', icon: Lightbulb, color: 'teal' },
  { key: 'clarity', name: 'Clarity', icon: Hammer, color: 'green' },
] as const;

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { data: mission, isLoading, error } = useMissionDetail(resolvedParams.id);

  if (isLoading) return <PageLoader />;
  if (error || !mission) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted mb-4">Mission not found.</p>
        <Link href="/missions" className="text-purple hover:underline">
          Back to missions
        </Link>
      </div>
    );
  }

  const weights = mission.attributeWeights ?? {};
  const scenarioText = mission.scenario?.context ?? 'Complete the challenge with your best reasoning.';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="h-[300px] w-full bg-gradient-to-br from-orange/20 via-surface to-background relative border-b border-border overflow-hidden">
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link
            href="/missions"
            className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6 w-fit"
          >
            <ChevronLeft size={20} /> Back to Missions
          </Link>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold">
                {formatMissionType(mission.missionType)}
              </div>
              <DifficultyStars level={mission.difficultyLevel} />
              <span className="text-muted text-xs font-medium flex items-center gap-1">
                <Clock size={14} /> ~15 mins
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight">
              {mission.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <Card className="p-10 bg-surface border-border shadow-2xl relative overflow-hidden">
            <span className="text-[10px] font-bold text-purple uppercase tracking-[0.2em] mb-6 block">
              MISSION BRIEFING
            </span>
            <p className="text-offwhite text-lg leading-relaxed whitespace-pre-line">
              {mission.narrative}
            </p>
          </Card>

          <Card className="p-10 border-l-4 border-l-purple bg-surface2/50 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-purple uppercase tracking-[0.2em] mb-6 block">
              YOUR CHALLENGE
            </span>
            <p className="text-white text-xl font-medium leading-relaxed mb-8 italic">
              &ldquo;{scenarioText}&rdquo;
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                WHAT THIS MISSION DEVELOPS
              </span>
              <div className="flex flex-wrap gap-3">
                {ATTR_CONFIG.map((attr) => {
                  const active = (weights[attr.key] ?? 0) > 0;
                  return (
                    <div
                      key={attr.key}
                      className={cn(
                        'px-4 py-2 rounded-xl flex items-center gap-3 border transition-all duration-300',
                        active ? '' : 'border-border bg-transparent text-dimmed'
                      )}
                      style={
                        active
                          ? {
                              color: `var(--color-${attr.color})`,
                              borderColor: `var(--color-${attr.color})40`,
                              backgroundColor: `var(--color-${attr.color})10`,
                            }
                          : {}
                      }
                    >
                      <attr.icon size={18} />
                      <span className="text-sm font-bold">{attr.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                DIFFICULTY
              </span>
              <div className="text-2xl font-heading font-bold text-white flex items-center gap-3">
                <Zap className="text-amber" size={24} /> Level {mission.difficultyLevel} / 5
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-border py-6 px-6 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 text-sm font-bold text-muted">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-amber">DIFFICULTY</span>
              <span className="text-lg text-white font-mono">{mission.difficultyLevel} / 5</span>
            </div>
          </div>

          <Link href={`/missions/${mission.id}/play`}>
            <Button className="btn-primary px-12 h-14 text-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105">
              Begin Mission <ChevronRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
