'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, LogOut, Brain, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';

function ParentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/parent/dashboard' },
    { icon: Users, label: 'Children', href: '/parent/children' },
    { icon: Settings, label: 'Account', href: '#' },
  ];

  return (
    <aside className="hidden md:flex w-[240px] bg-surface border-r border-border h-screen sticky top-0 flex-col p-6 pt-10">

      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-teal text-[#0B0F1A] shadow-lg shadow-teal/20'
                    : 'text-muted hover:text-white hover:bg-surface2'
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    'transition-transform group-hover:scale-110',
                    isActive ? 'text-[#0B0F1A]' : 'text-muted group-hover:text-teal'
                  )}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="parent-active-pill"
                    className="absolute left-0 w-1 h-6 bg-[#0B0F1A] rounded-r-full"
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

import { useEffect, useState } from 'react';
import { getHomePathForRole } from '@/lib/auth-routing';

import TopHeader from '@/components/layout/TopHeader';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userRole } = useTokenStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && userRole !== 'PARENT' && userRole !== 'ADMIN') {
      router.replace(getHomePathForRole(userRole || 'CHILD'));
    }
  }, [userRole, router, mounted]);

  if (!mounted || (userRole !== 'PARENT' && userRole !== 'ADMIN')) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <ParentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-8 md:p-12">{children}</main>
      </div>
    </div>
  );
}
