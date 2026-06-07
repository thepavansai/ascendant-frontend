'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number; // 0 to 1
  size?: number;
  className?: string;
}

export default function ScoreCircle({ score, size = 180, className }: ScoreCircleProps) {
  const percentage = Math.round(score * 100);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - score * circumference;

  const getColor = () => {
    if (score < 0.5) return '#EF4444'; // red
    if (score < 0.7) return '#F59E0B'; // amber
    return '#10B981'; // green
  };

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1F2D45"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Progress Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-4xl font-mono font-bold text-white"
        >
          {percentage}%
        </motion.span>
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
          FINAL SCORE
        </span>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
