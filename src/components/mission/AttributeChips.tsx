import React from 'react';
import { Brain, Target, Lightbulb, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttributeChipsProps {
  attributes: {
    intellect?: boolean;
    judgment?: boolean;
    awareness?: boolean;
    clarity?: boolean;
  };
}

const config = {
  intellect: { icon: Brain, color: 'purple', label: 'Intellect' },
  judgment: { icon: Target, color: 'amber', label: 'Judgment' },
  awareness: { icon: Lightbulb, color: 'teal', label: 'Awareness' },
  clarity: { icon: Hammer, color: 'green', label: 'Clarity' },
};

export default function AttributeChips({ attributes }: AttributeChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(attributes).map(([key, active]) => {
        if (!active) return null;
        const item = config[key as keyof typeof config];
        const Icon = item.icon;
        return (
          <div
            key={key}
            className={cn(
              'px-2 py-1 rounded-lg flex items-center gap-1.5 border',
              `border-${item.color}/30 bg-${item.color}/10 text-${item.color}`
            )}
            style={{
              color: `var(--color-${item.color})`,
              borderColor: `var(--color-${item.color})30`,
              backgroundColor: `var(--color-${item.color})10`,
            }}
          >
            <Icon size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
