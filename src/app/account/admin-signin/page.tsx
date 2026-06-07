/**
 * Admin-only sign-in page.
 * Calls POST /api/auth/admin-login which validates against env-configured
 * admin credentials (app.admin.email / app.admin.password) and returns
 * a JWT with the special admin UUID (000...000). Regular /login will NOT
 * work for admins because the admin account is not in the users table.
 */
'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/lib/store/tokenStore';
import { backendAuthApi } from '@/lib/api/backendAuth';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';

function AdminSignInForm() {
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
      const response = await backendAuthApi.adminLogin(email, password);
      const { token, refreshToken, user } = response;

      setTokens(token, refreshToken, user.id, { name: user.name, role: user.role });

      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl && callbackUrl !== '/' ? callbackUrl : '/admin/dashboard';
      }
    } catch {
      setError('Invalid admin credentials. Check your email and password.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40">
              <Shield className="h-9 w-9 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 shadow-md">
              <Lock className="h-3 w-3 text-amber-900" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white font-heading tracking-tight">ADMIN PANEL</h1>
            <p className="mt-1 text-sm text-slate-400">Ascendant Initiative — Restricted Access</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-3">
          <Lock size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300 font-medium">
            This portal is for authorized administrators only. All access attempts are logged.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={(e) => { void onSubmit(e); }}
          className="rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-8 shadow-2xl"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Administrator Sign In</h2>

          {/* Email Input */}
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="admin-email" className="text-sm font-medium text-slate-300">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              placeholder="admin@ascendant.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-slate-300">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 pr-10 text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
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
              <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Shield size={16} />
                Access Admin Panel
              </span>
            )}
          </button>

          {/* Back to regular sign in */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Not an admin?{' '}
            <a
              href="/account/signin"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Go to regular sign in
            </a>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          © 2026 Ascendant Initiative. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInForm />
    </Suspense>
  );
}
