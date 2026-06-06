# anything-web

Next.js 16 web app — extracted from the `anything` monorepo as a standalone npm project.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **Auth**: better-auth
- **Data fetching**: TanStack Query v5
- **Database**: Neon (Postgres serverless)
- **Testing**: Vitest + Testing Library

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in the values in .env
```

### 3. Run the dev server

```bash
npm run dev
# → http://localhost:4000
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 4000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm test` | Run tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── (admin)/          # Admin route group
│   ├── (auth)/           # Auth route group (login, register, etc.)
│   ├── (child)/          # Child dashboard, missions, profile
│   ├── (parent)/         # Parent dashboard & children management
│   ├── account/          # Sign-in / sign-up / logout
│   └── api/              # API routes (auth, session)
├── components/
│   ├── charts/           # Recharts-based chart components
│   ├── evaluation/       # Mission evaluation UI
│   ├── layout/           # Sidebar & bottom tab bar
│   ├── mission/          # Mission cards & chips
│   ├── player/           # XP bar, level badge, streaks, etc.
│   └── ui/               # shadcn/ui primitives
├── hooks/                # Shared React hooks
├── lib/
│   ├── api/              # API client & typed fetchers
│   ├── auth.ts           # better-auth server config
│   ├── auth-client.ts    # better-auth browser client
│   ├── fonts.ts          # Next.js font definitions
│   ├── hooks/            # Data-layer hooks (React Query)
│   ├── store/            # Zustand stores
│   ├── types/            # Shared TypeScript types
│   └── utils.ts          # cn() and other utilities
├── middleware.ts          # Auth middleware (route protection)
└── utils/                # Stream response & upload helpers
```
# ascendant-frontend
# ascendant-frontend
