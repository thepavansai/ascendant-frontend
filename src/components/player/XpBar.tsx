'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface XpBarProps {
  xp: number;
  maxXp: number;
  showLabel?: boolean;
}

export default function XpBar({ xp, maxXp, showLabel = true }: XpBarProps) {
  const percentage = Math.min(Math.round((xp / maxXp) * 100), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[10px] font-mono text-muted mb-1.5 uppercase tracking-wider">
          <span>XP PROGRESS</span>
          <span>
            {xp} / {maxXp} XP
          </span>
        </div>
      )}
      <div className="h-2.5 w-full bg-border rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
        />
      </div>
    </div>
  );
}
