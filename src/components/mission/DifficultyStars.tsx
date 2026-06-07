import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifficultyStarsProps {
  level: number;
  className?: string;
}

export default function DifficultyStars({ level, className }: DifficultyStarsProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={cn(
            'w-2.5 h-2.5 rounded-full',
            star <= level ? 'bg-amber shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}
