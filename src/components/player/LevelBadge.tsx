import React from 'react';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-full bg-surface2 border-2 border-amber flex items-center justify-center font-mono font-bold text-amber shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        sizeClasses[size],
        className
      )}
    >
      LVL {level}
    </div>
  );
}
