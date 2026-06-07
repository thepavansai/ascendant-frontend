import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasAuthToken(request: NextRequest) {
  return Boolean(request.cookies.get('auth-token')?.value);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/account/signin' ||
    pathname === '/account/signup' ||
    pathname === '/account/logout'
  ) {
    return NextResponse.next();
  }

  // Protected routes
  if (!hasAuthToken(request)) {
    const callbackUrl = encodeURIComponent(`${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(new URL(`/account/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/missions/:path*',
    '/profile/:path*',
    '/progress/:path*',
    '/parent/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/account/signin',
    '/account/signup',
    '/account/logout',
  ],
};
