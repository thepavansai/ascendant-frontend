'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, User as UserIcon } from 'lucide-react';
import { useTokenStore } from '@/lib/store/tokenStore';

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { userId, userName, userRole } = useTokenStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On auth pages, we might want it to always be transparent, or just act the same.
  // The scroll effect is safe to keep everywhere.

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple/20">
            <Brain className="text-white" size={24} />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple via-purple-light to-teal">
            ASCENDANT
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          {mounted && userId ? (
            <Link
              href={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'PARENT' ? '/parent/dashboard' : '/dashboard'}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-surface/80 backdrop-blur-sm border border-border/50 hover:bg-surface transition-all group shadow-xl"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple/20 flex items-center justify-center">
                <UserIcon size={14} className="text-purple group-hover:text-purple-light transition-colors" />
              </div>
              <span className="font-bold text-sm text-offwhite group-hover:text-white transition-colors">{userName || 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              {pathname !== '/account/signin' && (
                <Link
                  href="/account/signin"
                  className="hidden sm:flex items-center justify-center h-9 px-5 rounded-xl font-semibold text-sm bg-purple/10 text-purple border border-transparent hover:bg-purple/20 transition-all min-w-[100px]"
                >
                  Log In
                </Link>
              )}
              {pathname !== '/account/signup' && (
                <Link 
                  href="/account/signup"
                  className="flex items-center justify-center h-9 px-4 md:px-5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple to-purple-light text-white shadow-lg shadow-purple/20 hover:shadow-xl hover:-translate-y-[1px] transition-all"
                >
                  Get Started
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
