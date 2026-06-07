import type React from 'react';
import type { Metadata } from 'next';
import { syne, dmSans, dmMono } from '@/lib/fonts';
import './global.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Ascendant',
  description: 'Train Your Brain. Level Up Your Life.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-[#0B0F1A] text-[#F8FAFC] min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
