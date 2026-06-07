'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTokenStore } from '@/lib/store/tokenStore';

import TopHeader from '@/components/layout/TopHeader';

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole } = useTokenStore();
  const isAdult = userRole === 'PARENT' || userRole === 'ADMIN';

  return (
    <div className="flex min-h-screen bg-background">
      {!isAdult && <Sidebar />}
      <div className={`flex-1 flex flex-col min-w-0 relative ${isAdult ? '' : 'pb-20 md:pb-0'}`}>
        {!isAdult && <TopHeader />}
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={isAdult ? "p-4 md:p-8" : "p-8 md:p-12"}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {!isAdult && <BottomTabBar />}
    </div>
  );
}
