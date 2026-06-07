/**
 * ⚠ ASCENDANT PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. Same contract as signup/page.tsx: <form
 * onSubmit>, e.preventDefault(), and window.location.href redirect are all
 * load-bearing for the mobile WebView. DO NOT replace <form onSubmit> with
 * <button onClick> — that broke signin platform-wide in a prior AI rewrite.
 *
 *   Safe:   restyle, rewrite copy, add form fields.
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           backend auth call, changing the callbackUrl redirect.
 */
'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import { resolvePostAuthRedirect } from '@/lib/auth-routing';
import { Brain, Eye, EyeOff } from 'lucide-react';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setTokens = useTokenStore((state) => state.setTokens);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await backendAuthApi.login(email, password);
      const { token, refreshToken, user } = response;

      // Store tokens
      setTokens(token, refreshToken, user.id, { name: user.name, role: user.role });

      if (typeof window !== 'undefined') {
        window.location.href = resolvePostAuthRedirect(callbackUrl, user.role);
      } else {
        console.warn('signin: window is undefined; cannot redirect to callbackUrl');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white font-heading">ASCENDANT</h1>
            <p className="mt-1 text-sm text-slate-400">Cognitive Training Platform</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={(e) => { void onSubmit(e); }}
          className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 shadow-2xl"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Welcome Back</h2>

          {/* Email Input */}
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 pr-10 text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/15 border border-red-500/30 p-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mb-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400">
            No account?{' '}
            <a
              href={
                callbackUrl
                  ? `/account/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : '/account/signup'
              }
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Ascendant Initiative. All rights reserved.
        </p>
        <p className="mt-3 text-center text-xs text-slate-600">
          Administrator?{' '}
          <a
            href="/account/admin-signin"
            className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium"
          >
            Admin Portal →
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
