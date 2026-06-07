/**
 * ⚠ ASCENDANT PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. The <form onSubmit>, e.preventDefault(), and
 * window.location.href redirect are load-bearing for the mobile WebView auth
 * flow (AuthWebView intercepts the navigation to capture the session). A
 * prior AI rewrite replaced <form onSubmit> with <button onClick> and broke
 * signup platform-wide — "credentials cleared" / "button does nothing" for
 * every user until a human reverted it. DO NOT repeat that mistake.
 *
 *   Safe:   restyle, rewrite copy, add form fields (pass `name` explicitly).
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           backend auth call, changing the callbackUrl redirect.
 */
'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import { resolvePostAuthRedirect } from '@/lib/auth-routing';
import { Brain, Eye, EyeOff, AlertCircle } from 'lucide-react';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('CHILD');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setTokens = useTokenStore((state) => state.setTokens);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate parent email for child accounts
    if (role === 'CHILD' && !parentEmail) {
      setError('Parent email is required for child accounts');
      setLoading(false);
      return;
    }

    try {
      const response = await backendAuthApi.register({
        name: name || email.split('@')[0], // Use email local-part as fallback
        email,
        password,
        role,
        parentEmail: role === 'CHILD' ? parentEmail : undefined,
      });

      const { token, refreshToken, user } = response;
      setTokens(token, refreshToken, user.id, { name: user.name, role: user.role });

      if (typeof window !== 'undefined') {
        window.location.href = resolvePostAuthRedirect(callbackUrl, user.role);
      } else {
        console.warn('signup: window is undefined; cannot redirect to callbackUrl');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
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
          <h2 className="mb-6 text-2xl font-bold text-white">Create Account</h2>

          {/* Name Input */}
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">
              Name <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
          </div>

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
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
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
            <p className="text-xs text-slate-500">Minimum 8 characters</p>
          </div>

          {/* Account Type */}
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium text-slate-300">
              Account Type
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            >
              <option value="CHILD">Child (Student)</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>

          {/* Parent Email (conditional) */}
          {role === 'CHILD' && (
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="parentEmail" className="text-sm font-medium text-slate-300">
                Parent Email Address
              </label>
              <input
                id="parentEmail"
                type="email"
                required
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
              />
              <p className="text-xs text-slate-500">Your parent will receive a link to approve this account</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-500/15 border border-red-500/30 p-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
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
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a
              href={
                callbackUrl
                  ? `/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : '/account/signin'
              }
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in
            </a>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Ascendant Initiative. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
