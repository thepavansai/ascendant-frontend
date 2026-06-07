'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Brain, LayoutDashboard, Target, User, TrendingUp, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import IdentityBadge from '@/components/player/IdentityBadge';

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, userId, userName } = useTokenStore();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (userId) {
      setUser({
        id: userId,
        name: userName ?? 'Player',
        email: '',
      });
    }
  }, [userId, userName]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: Target, label: 'Missions', href: '/missions' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: TrendingUp, label: 'Progress', href: '/progress' },
  ];

  const handleLogout = async () => {
    await backendAuthApi.logout();
    router.replace('/account/signin');
  };

  return (
    <aside className="w-[240px] hidden md:flex bg-surface border-r border-border h-screen sticky top-0 flex-col p-6 pt-10 overflow-hidden">

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? 'bg-purple text-white shadow-lg shadow-purple/20'
                  : 'text-muted hover:text-white hover:bg-surface2'
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  'transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-muted group-hover:text-purple'
                )}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
