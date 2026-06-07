/**
 * Legacy session endpoint — not used with Spring Boot JWT auth.
 * Session state is managed client-side via Zustand tokenStore.
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Use Spring Boot JWT auth. Session is managed client-side.' },
    { status: 410 }
  );
}
