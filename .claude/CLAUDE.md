# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js template with authentication, file management, and admin capabilities. Uses the App Router pattern.

## Tech Stack (Fixed - Do Not Change)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (dark mode via class strategy)
- **UI:** shadcn/ui components
- **Client State:** Zustand
- **Data Fetching:** tRPC + React Query
- **Auth:** Better Auth (email/password)
- **ORM:** Drizzle with MySQL
- **File Storage:** Cloudflare R2
- **PDF Viewer:** pdf.js

## Commands

```bash
# Setup
npm install          # Install dependencies

# Development
npm run dev          # Start dev server

# Build & Production
npm run build        # Production build
npm run start        # Run production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check

# Database
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## Architecture (FSD - Feature-Sliced Design)

### Layer Structure & Dependencies

```
src/
├── app/            → Next.js App Router pages and layouts
├── core/           → Auth, sessions, guards, theme provider
├── shared/         → Shared resources (lowest layer)
│   ├── ui/         → Reusable UI components (no business logic)
│   └── lib/        → Pure utilities (cn, formatters, trpc client)
├── entities/       → Business entities (types, base models)
│   ├── user/       → User types
│   └── file/       → File types
├── features/       → User interactions with complex logic
│   ├── file-upload/      → File upload with progress tracking
│   └── user-management/  → User activate/deactivate/role actions
├── widgets/        → Composite UI blocks (smart components)
│   ├── header/     → Global navigation header
│   ├── auth/       → OAuth buttons
│   ├── user-list/  → Admin user list with actions
│   ├── file-list/  → User file list with actions
│   ├── file-upload/→ File upload dropzone
│   └── pdf-viewer/ → PDF viewer component
├── server/         → Backend (DB, storage, tRPC)
│   ├── db/         → Drizzle schema and connection
│   │   └── schema/ → Split schema files (auth, file)
│   ├── storage/    → R2 integration
│   └── trpc/       → tRPC routers and procedures
```

**FSD Layer Hierarchy (lower cannot import upper):**
`shared` → `entities` → `features` → `widgets` → `app`

### Key Constraints

- **Lower layers cannot import from upper layers**
- **Features must not depend on other features**
- **Shared UI components must not contain business logic** (no DB, auth, or tRPC calls)
- **Widgets are smart components** - they can use tRPC, hooks, and compose features
- **No `any` types** - use `strict: true`
- **Entity types in `src/entities/`** - API I/O must be typed with matching runtime validation

## Route Groups

- `(auth)` - Sign in/up pages (redirects authenticated users)
- `(protected)` - Requires authentication
- `(protected)/admin` - Requires admin role

## Documentation Requirements

See `claude.md` for the full development contract.

### Update Triggers

**FEATURES.md** - update when:
- Adding/removing feature modules or reusable UI components
- Changing public API surface (exports)
- Adding/changing env vars

**PAGES.md** - update when:
- Adding/removing/renaming routes
- Changing access levels (public/protected/admin)
- Changing header navigation or page data dependencies

### Environment Variables

- All secrets in `.env` (gitignored)
- Mirror all keys in `.env.example` with placeholders
- Use `NEXT_PUBLIC_*` only for browser-safe values

## Theme System

- Light/Dark mode toggle in Header
- Default: follow system preference
- Persist choice in localStorage (`theme` key)
- Apply via Tailwind `dark` class on `<html>`
- Provider: `src/core/theme/provider.tsx`

## Workflow

1. Update `PRD.md` only for scope/requirement changes
2. Implement code
3. Update `FEATURES.md` and/or `PAGES.md` in same PR if triggered
4. Ensure `.env.example` matches `.env` keys
