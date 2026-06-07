'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { MissionSummary } from '@/lib/types/mission.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DifficultyStars from './DifficultyStars';

interface MissionCardProps {
  mission: MissionSummary;
}

const typeConfig = {
  FACTUAL: { color: 'teal', label: 'FACTUAL', bg: 'bg-teal', border: 'border-teal/30' },
  ANALYTICAL: { color: 'amber', label: 'ANALYTICAL', bg: 'bg-amber', border: 'border-amber/30' },
  OPEN_ENDED: { color: 'orange', label: 'OPEN-ENDED', bg: 'bg-orange', border: 'border-orange/30' },
};

export default function MissionCard({ mission }: MissionCardProps) {
  const config = typeConfig[mission.missionType];

  if (mission.isLocked) {
    return (
      <Card className="opacity-60 grayscale bg-surface/50 border-border relative overflow-hidden group cursor-not-allowed h-full flex flex-col">
        <div className={cn('h-1.5 w-full', config.bg)} />
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-border/20 flex items-center justify-center mb-4">
            <Lock className="text-muted" size={24} />
          </div>
          <h3 className="font-heading font-bold text-lg mb-2">{mission.title}</h3>
          <p className="text-xs text-muted">Locked</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="bg-surface border-border hover:border-purple/50 transition-all duration-300 h-full flex flex-col overflow-hidden relative group">
        <div className={cn('h-1.5 w-full', config.bg)} />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div
              className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold border', config.border)}
              style={{ color: `var(--color-${config.color})` }}
            >
              {config.label}
            </div>
            {mission.userCompleted && (
              <div className="flex items-center gap-1 text-green text-[10px] font-bold">
                <CheckCircle2 size={12} /> COMPLETED
              </div>
            )}
          </div>

          <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-purple transition-colors leading-tight">
            {mission.title}
          </h3>

          <p className="text-xs text-muted mb-6 line-clamp-2">
            Test your {mission.missionType.toLowerCase().replace('_', ' ')} reasoning in this
            challenging scenario.
          </p>

          <div className="mt-auto flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <DifficultyStars level={mission.difficultyLevel} />
              {mission.bestScore != null && (
                <span className="text-xs font-mono font-bold text-white">
                  {Math.round(mission.bestScore * 100)}%
                </span>
              )}
            </div>

            {mission.id === 'preview' ? (
              <Button
                className={cn(
                  'w-full h-10 text-sm font-bold rounded-xl opacity-50 cursor-not-allowed',
                  mission.userCompleted ? 'btn-ghost' : 'btn-primary'
                )}
              >
                {mission.userCompleted ? 'Play Again' : 'Play Mission'}{' '}
                <ChevronRight size={14} className="ml-1" />
              </Button>
            ) : (
              <Link href={`/missions/${mission.id}`}>
                <Button
                  className={cn(
                    'w-full h-10 text-sm font-bold rounded-xl',
                    mission.userCompleted ? 'btn-ghost' : 'btn-primary'
                  )}
                >
                  {mission.userCompleted ? 'Play Again' : 'Play Mission'}{' '}
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {mission.userCompleted && mission.bestScore != null && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-green"
            style={{ width: `${mission.bestScore * 100}%` }}
          />
        )}
      </Card>
    </motion.div>
  );
}
