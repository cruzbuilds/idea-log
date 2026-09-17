# Idea Log

Log ideas, score them on differentiation, evidence, cost, and reversibility
(1-5 each), and see them ranked by total score. When an idea finishes or gets
abandoned, record what actually happened and re-score it in hindsight to see
where your predictions were off.

- Full TypeScript stack: Next.js App Router + API routes, Prisma, PostgreSQL.
- Accounts with private ideas (cookie session, `bcrypt` password hashing).
- Share a single idea by unshareable/unguessable link — no signup required to view.
- Score ranges enforced both in the API (Zod) and the database (CHECK constraints).

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **API**: Next.js Route Handlers under `src/app/api/**`
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Signed JWT session cookie (`jose`), `bcryptjs` for password hashing — no third-party auth service
- **Styling**: Tailwind CSS v4, hand-rolled UI kit (`src/components/ui.tsx`)

## Getting started

Requires Docker (for local Postgres) and Node 20+.

```bash
pnpm install          # also runs `prisma generate`
cp .env.example .env  # fill in DATABASE_URL / JWT_SECRET (or keep the defaults)
pnpm db:up            # starts Postgres in Docker
pnpm db:migrate       # applies migrations
pnpm dev              # http://localhost:3000
```

## Data model

- `User` — email, password hash, name.
- `Idea` — belongs to a user. Prediction scores (`differentiation`, `evidence`,
  `cost`, `reversibility`, each 1-5) are required at creation. `status` is
  `ACTIVE` / `DONE` / `ABANDONED`. Once an idea is finished or abandoned, an
  `outcome` (free text) and a second set of hindsight scores (`hDifferentiation`
  etc.) can be recorded. `shareToken` is a unique nullable string — set when
  the owner turns on link sharing, cleared when revoked.

Total score and hindsight delta are computed on read (`src/lib/scoring.ts`),
not stored, so they're always consistent with the underlying scores.

## Key routes

| Route | Purpose |
| --- | --- |
| `/`, `/login`, `/register` | Public marketing + auth |
| `/ideas` | Private dashboard, ranked by total score, with a calibration summary |
| `/ideas/[id]` | Edit an idea, record its outcome, manage its share link |
| `/s/[token]` | Public, read-only view of a single shared idea — no auth |

All `/ideas*` pages are protected by `src/proxy.ts` (Next's middleware
convention) in addition to per-request auth checks in each Server Component
and API route, so there's no route that only "looks" protected client-side.

## Notes

- Prisma is pinned to the 6.x line rather than the newly-released 7, which
  requires driver adapters and a separate `prisma.config.ts` — not worth the
  churn for a project this size.
- `docker-compose.yml` runs Postgres only; the app itself runs with `pnpm dev`
  / `pnpm build && pnpm start`.
