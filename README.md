# Nosh — Meal Planning App

A budget-friendly meal planning web app built for [Nosh](https://nosh.org.uk), a UK charity helping households on tight budgets eat well. Plan your week, generate a shopping list, and stay on budget.

## Features

- Browse and filter recipes by dietary preference, cuisine, and meal type
- Add, edit, and delete your own custom recipes
- Set dietary preferences (vegetarian, vegan, gluten-free, dairy-free) that apply app-wide
- Plan meals across a 7-day week with structured Breakfast / Lunch / Dinner slots
- Per-meal serving size scaler — cook for 2 on Tuesday, 6 on Sunday
- Aggregated weekly shopping list with quantities combined across recipes
- Budget estimator showing estimated weekly spend using UK average prices

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Hono, TypeScript, Node.js |
| Database | Neon Postgres (Drizzle ORM) |
| Shared | Zod schemas (`packages/shared`) |
| Hosting | Vercel (frontend + API) |

## Project structure

```
nosh/
├── apps/
│   ├── web/          # Vite + React frontend
│   └── api/          # Hono API server
└── packages/
    └── shared/       # Zod schemas + TypeScript types
```

## Getting started

### Prerequisites

- Node.js 18+
- pnpm 12+
- A [Neon](https://neon.tech) Postgres database (free tier)

### First-time setup

```bash
# Install dependencies (first run only — approves esbuild build scripts)
pnpm install --allow-build=esbuild

# Copy env example and fill in your Neon connection string
cp apps/api/.env.example apps/api/.env

# Run DB migrations and seed starter recipes
pnpm --filter @nosh/api db:migrate
pnpm --filter @nosh/api db:seed
```

### Local development

```bash
# Start both servers in parallel
pnpm dev

# Or individually
pnpm --filter @nosh/api dev    # API on http://localhost:3001
pnpm --filter @nosh/web dev    # UI  on http://localhost:5173
```

## Git workflow

One branch per ticket, PR into `main`. Branch naming: `feat/ticket-N-short-description`.

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
