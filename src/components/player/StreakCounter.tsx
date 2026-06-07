'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streakDays: number;
  lastSevenDays: boolean[];
  className?: string;
}

export default function StreakCounter({
  streakDays,
  lastSevenDays,
  className,
}: StreakCounterProps) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-orange/10 border border-orange/20 rounded-2xl flex items-center justify-center">
          <Flame className="text-orange" size={32} />
        </div>
        <div className="flex flex-col">
          <span className="text-muted font-bold text-xs tracking-widest uppercase">DAY STREAK</span>
          <span className="font-mono text-5xl font-bold text-orange">{streakDays}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface2/50 p-4 rounded-xl border border-border/50">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-500',
                lastSevenDays[i] ? 'bg-orange shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-border'
              )}
            />
            <span className="text-[10px] font-bold text-muted">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
