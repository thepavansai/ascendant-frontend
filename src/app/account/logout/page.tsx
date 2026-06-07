/**
 * ⚠ ASCENDANT PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. The useEffect-on-mount → backend logout →
 * window.location.href redirect is load-bearing for the mobile WebView's
 * "sign out" flow. Safe to restyle the spinner / copy; unsafe to bypass
 * backend logout or change the redirect behavior.
 */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import { Brain, LogOut } from 'lucide-react';

function LogoutHandler() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account/signin';
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const clearTokens = useTokenStore((state) => state.clearTokens);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await backendAuthApi.logout();
      } catch (err) {
        // Ignore logout errors, we'll clear tokens anyway
        console.error('Logout error:', err);
      }

      if (cancelled) return;

      clearTokens();

      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl;
      } else {
        console.warn('logout: window is undefined; cannot redirect to callbackUrl');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [callbackUrl, clearTokens]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-heading">ASCENDANT</h1>
            <p className="mt-1 text-sm text-slate-400">Cognitive Training Platform</p>
          </div>
        </div>

        {/* Logout Card */}
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 flex items-center justify-center">
                <LogOut className="h-8 w-8 text-purple-400" />
              </div>
              {status === 'loading' && (
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
              )}
            </div>
          </div>

          {status === 'loading' ? (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Signing out...</h2>
              <p className="text-slate-400 text-sm">Please wait while we secure your account</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-400">Logout Failed</h2>
              <p className="text-slate-300 text-sm">{error || 'An error occurred while signing out'}</p>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = callbackUrl;
                  }
                }}
                className="mt-6 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Ascendant Initiative. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutHandler />
    </Suspense>
  );
}
