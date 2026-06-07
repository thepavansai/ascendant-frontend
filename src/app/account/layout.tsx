'use client';

import React from 'react';
import PublicHeader from '@/components/layout/PublicHeader';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
