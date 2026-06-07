import React from 'react';
import { Brain, Target, Lightbulb, Hammer } from 'lucide-react';
import { IdentityType } from '@/lib/types/player.types';
import { cn } from '@/lib/utils';

interface IdentityBadgeProps {
  type: IdentityType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const config = {
  ANALYST: {
    color: '#8B5CF6',
    bg: 'bg-purple/10',
    border: 'border-purple/30',
    icon: Brain,
    name: 'ANALYST',
  },
  STRATEGIST: {
    color: '#F59E0B',
    bg: 'bg-amber/10',
    border: 'border-amber/30',
    icon: Target,
    name: 'STRATEGIST',
  },
  CREATOR: {
    color: '#06B6D4',
    bg: 'bg-teal/10',
    border: 'border-teal/30',
    icon: Lightbulb,
    name: 'CREATOR',
  },
  BUILDER: {
    color: '#10B981',
    bg: 'bg-green/10',
    border: 'border-green/30',
    icon: Hammer,
    name: 'BUILDER',
  },
};

export default function IdentityBadge({ type, size = 'md', className }: IdentityBadgeProps) {
  const item = config[type];
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1 text-[10px]',
    md: 'px-3 py-1.5 gap-2 text-xs',
    lg: 'px-5 py-2.5 gap-3 text-sm',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 20,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-bold tracking-wider',
        item.bg,
        item.border,
        sizeClasses[size],
        className
      )}
      style={{ color: item.color, borderWidth: '1px' }}
    >
      <Icon size={iconSizes[size]} />
      {item.name}
    </div>
  );
}
