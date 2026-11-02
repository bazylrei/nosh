# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs API on :3001 and web on :5173 in parallel)
pnpm dev

# Build all packages
pnpm build

# Type-check all packages
pnpm typecheck

# Format with Prettier
pnpm format

# Run all tests
pnpm --filter @nosh/web test
pnpm --filter @nosh/api test

# Run a single test file
pnpm --filter @nosh/web test RecipeCard.test.tsx
pnpm --filter @nosh/api test scaling.test.ts

# Watch mode
pnpm --filter @nosh/web test:watch

# Database
pnpm --filter @nosh/api db:migrate    # apply migrations to Neon
pnpm --filter @nosh/api db:generate   # generate new migration from schema changes
pnpm --filter @nosh/api db:seed       # seed recipes.json into DB
pnpm --filter @nosh/api db:studio     # open Drizzle Studio
```

## Code Style

Prettier enforces: no semicolons, single quotes, trailing commas, 100-char line width.

## Architecture

Pnpm monorepo with three packages:

- `apps/api` — Hono 4 server, repositories (data access), and `lib/` (business logic)
- `apps/web` — React 18 + Vite SPA, custom hooks (React Query), and `lib/` (client utilities)
- `packages/shared` — Zod schemas and TypeScript types shared between API and web

### Request flow

`Web (React Query hook)` → `lib/api.ts (fetch wrapper)` → `Hono route` → `repository (Drizzle query)` → `Neon PostgreSQL`

### Key conventions

**API** — Routes live in `apps/api/src/routes/`, database queries in `apps/api/src/repositories/`, pure business logic in `apps/api/src/lib/`. Never put queries directly in routes.

**Web** — All server state goes through a custom hook in `apps/web/src/hooks/`. Pages compose hooks and components; hooks call `lib/api.ts`; neither pages nor hooks import from repositories.

**Shared types** — `packages/shared/src/index.ts` is the single source of truth for request/response schemas. Both API request validation and web API call types derive from these Zod schemas.

**Meal slot upsert** — The `mealSlots` table has a unique constraint on `(day, mealType, weekStart)`. All writes use Drizzle's `onConflictDoUpdate` — no separate create vs. update paths.

**Shopping list state** — Checked state is stored separately in `shoppingListChecks` (keyed by ingredient name + week). The aggregation of ingredients from meal slots happens server-side in `apps/api/src/lib/shopping-list.ts`.

**Cost estimation** — Computed server-side by `apps/api/src/lib/pricing.ts` against a hardcoded UK price map in `apps/api/data/prices.ts`. Returns `null` when an ingredient has no price entry.

**No auth** — Single-user app; `userPreferences` always uses `id = 1`.

### Database

Drizzle ORM + Neon PostgreSQL. Schema defined in `apps/api/src/db/schema.ts`. Tables: `recipes`, `mealSlots`, `shoppingListChecks`, `userPreferences`.

Migrations are generated (`db:generate`) and applied explicitly (`db:migrate`). Do not use `db:push` except for rapid local prototyping.

### Environment variables (API)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | No | Falls back to `DATABASE_URL` for migrations |
| `PORT` | No | Default: 3001 |
| `CORS_ORIGIN` | No | Default: http://localhost:5173 |

Web reads `VITE_API_URL` at build time; defaults to `/api` (proxied by Vite in dev, same origin in prod).
