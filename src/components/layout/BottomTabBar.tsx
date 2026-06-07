'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, User, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomTabBar() {
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: Target, label: 'Missions', href: '/missions' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: TrendingUp, label: 'Progress', href: '/progress' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-border px-6 py-3 flex justify-between items-center z-50 safe-area-inset-bottom">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors',
              isActive ? 'text-purple' : 'text-muted'
            )}
          >
            <item.icon size={24} className={isActive ? 'animate-bounce' : ''} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isActive ? item.label : ''}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
