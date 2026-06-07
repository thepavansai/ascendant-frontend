'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User, Shield, Brain, ChevronDown, Menu, X, ChevronLeft } from 'lucide-react';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import IdentityBadge from '@/components/player/IdentityBadge';
import Link from 'next/link';

export default function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, userRole, userId } = useTokenStore();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await backendAuthApi.logout();
    router.replace('/account/signin');
  };

  if (!mounted) return <header className="h-20 border-b border-border bg-surface/50" />;

  const isChild = userRole === 'CHILD';
  const isParent = userRole === 'PARENT';
  const isAdmin = userRole === 'ADMIN';

  // Determine if we should show the back button based on whether we are at a root navigation level
  const isRootPage = ['/dashboard', '/admin/dashboard', '/parent/dashboard', '/missions', '/progress', '/profile', '/admin/missions'].includes(pathname);

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-surface/80 backdrop-blur-lg px-6 flex items-center justify-between">
      <div className="flex items-center">
        {/* Dynamic Back Button */}
        {!isRootPage && (
          <button 
            onClick={() => router.back()} 
            className="p-2 mr-4 rounded-xl bg-surface2/50 hover:bg-surface border border-border/50 text-muted hover:text-white transition-colors flex items-center gap-1 group"
            aria-label="Go back"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-sm font-bold pr-1">Back</span>
          </button>
        )}

        {/* Unified Branding (Mobile & Desktop) */}
        <Link href="/" className="flex items-center gap-2 group mr-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple/20 group-hover:scale-105 transition-transform">
            <Brain className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-heading text-lg md:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple via-purple-light to-teal">
            ASCENDANT
          </span>
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* User Profile Dropdown or Auth Links */}
        {userId ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 pr-4 rounded-full bg-surface2/50 border border-border/50 hover:bg-surface2 transition-all"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm
                ${isAdmin ? 'bg-purple-light/20 border-purple-light/30 text-purple-light' : 
                  isParent ? 'bg-teal/20 border-teal/30 text-teal' : 
                  'bg-purple/20 border-purple/30 text-purple'}`}
              >
                {userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-none">{userName || 'User'}</div>
                <div className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">{userRole}</div>
              </div>
              <ChevronDown size={14} className="text-muted ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-border/50">
                    <div className="text-sm font-bold text-white">{userName}</div>
                    <div className="text-xs text-muted mt-0.5 uppercase tracking-wider">{userRole}</div>
                  </div>
                  <div className="p-1">
                    {isChild && (
                      <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-offwhite hover:bg-surface2 rounded-lg transition-colors">
                          <User size={16} /> Profile
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red hover:bg-red/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/account/signin" className="flex items-center justify-center h-9 px-5 rounded-xl font-semibold text-sm bg-purple/10 text-purple border border-transparent hover:bg-purple/20 hover:-translate-y-[1px] transition-all min-w-[100px]">
              Log In
            </Link>
            <Link href="/account/signup" className="flex items-center justify-center h-9 px-5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple to-purple-light text-white shadow-lg shadow-purple/20 hover:shadow-xl hover:-translate-y-[1px] transition-all min-w-[120px]">
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted hover:text-purple transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-20 bg-background/60 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`md:hidden fixed top-20 right-0 w-[280px] h-[calc(100vh-5rem)] bg-surface border-l border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col p-6 shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {userId && (
          <nav className="flex flex-col gap-2 mb-8">
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2 pb-2 border-b border-border/50">Navigation</div>
            {isAdmin ? (
              <>
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-purple-light">Dashboard</Link>
                <Link href="/admin/missions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-purple-light">Missions</Link>
              </>
            ) : isParent ? (
              <>
                <Link href="/parent/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-teal">Dashboard</Link>
                <Link href="/parent/children" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-teal">Children</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-purple">Home</Link>
                <Link href="/missions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-purple">Missions</Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-offwhite py-2 hover:text-purple">Profile</Link>
              </>
            )}
          </nav>
        )}

        <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-border/50">
          {userId ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 text-red bg-red/10 hover:bg-red/20 rounded-xl transition-colors font-bold w-full"
            >
              <LogOut size={18} /> Sign Out
            </button>
          ) : (
            <>
              <Link href="/account/signin" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center h-12 rounded-xl font-bold bg-purple/10 text-purple border border-transparent hover:bg-purple/20 transition-colors">
                Log In
              </Link>
              <Link href="/account/signup" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center h-12 rounded-xl font-bold bg-gradient-to-r from-purple to-purple-light text-white shadow-lg shadow-purple/20 hover:shadow-xl transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
