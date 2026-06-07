'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AttributeCardProps {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
  desc: string;
}

export default function AttributeCard({
  name,
  value,
  icon: Icon,
  color,
  desc,
}: AttributeCardProps) {
  return (
    <Card className="p-6 bg-surface border-border flex flex-col items-center text-center">
      <div
        className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center"
        style={{
          backgroundColor: `var(--color-${color})10`,
          border: `1px solid var(--color-${color})30`,
        }}
      >
        <Icon size={24} style={{ color: `var(--color-${color})` }} />
      </div>
      <h4 className="font-bold text-white mb-1">{name}</h4>
      <div className="text-xl font-mono font-bold text-white mb-3">{value}/10</div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          className="h-full"
          style={{ backgroundColor: `var(--color-${color})` }}
        />
      </div>
      <p className="text-[10px] text-muted leading-tight">{desc}</p>
    </Card>
  );
}
