# JoyFit MVP v0.1

Gamified accountability web app for weight loss: weekly weigh-ins, star rewards, leaderboard, invite system. Next.js App Router, TypeScript, TailwindCSS, Prisma, PostgreSQL.

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, TailwindCSS 4, mobile-first
- **Backend:** Next.js API routes, Prisma 6, PostgreSQL
- **Node:** >= 20.9.0 required for Next.js 16

## Authentication (MVP)

- **Phone + 6-digit PIN only.** No OTP, no SMS, no external auth provider.
- User creates a 6-digit PIN on first payment claim or first signup; account is created when phone + PIN are stored.
- Login uses phone + PIN. PIN is stored as a **bcrypt hash only** (never plain text).
- Name is optional and not required to log in.

*(Login and payment flows that use this auth model will be implemented in later phases.)*

## Commands

From the app root (folder containing `package.json` and `prisma/`):

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

If you are **upgrading from the legacy schema** (e.g. previous JoyFit DB with old `User`/`WeighIn`), reset the database and apply the new baseline migration:

```bash
npx prisma migrate reset
```

**Warning:** `prisma migrate reset` **drops all data** in the database. Use only in development or when you intend to start fresh.

Then seed demo and admin users:

```bash
npm run prisma:seed
```

Start the dev server:

```bash
npm run dev
```

- App: http://localhost:3000  
- Checkup: http://localhost:3000/checkup  
- Payment: http://localhost:3000/payment  
- Login: http://localhost:3000/login  

## Seed accounts (after `npm run prisma:seed`)

| Role   | Phone    | PIN    |
|--------|----------|--------|
| Demo   | 90000001 … 90000010 | 123456 |
| Admin  | 99999999 | 123456 |

All seed users share the same PIN for development. One agent (`AGENT01`) is created; the first two demo users are assigned to that agent.

## Admin panel

- **URL:** `/admin` (protected, admin-only)
- **Access:** Only users with `role="admin"` can access. Non-admin or unauthenticated users are redirected to `/login`.

**Create or promote an admin user:**

1. **Via seed** (creates admin 99999999): `npm run prisma:seed`
2. **Via SQL** (promote existing user by phone):
   ```bash
   npx prisma db execute --stdin <<< "UPDATE \"User\" SET role = 'admin' WHERE phone = 'YOUR_PHONE';"
   ```
3. **Via Prisma Studio:** `npx prisma studio` → open `User` → edit the desired user → set `role` to `admin`

## Environment

- Copy `.env.example` to `.env` and set `DATABASE_URL` (e.g. `postgresql://joyfit:joyfit@127.0.0.1:5432/joyfit` for local PostgreSQL, or `postgresql://joyfit:joyfit@db:5432/joyfit` when using Docker).

## Phase 1 scope (current)

- **Done:** Prisma schema (8 models, enums, indexes), single baseline migration, seed (10 demo users + 1 admin, bcrypt PIN), README.
- **No UI or API changes in this phase.** Existing routes (/, /checkup, /payment, /login, /dashboard) are unchanged; they will be updated in later phases to use the new auth model (e.g. /payment to create PIN, /login to authenticate with phone + PIN).

## Prisma

- **Schema:** `prisma/schema.prisma` — User, Lead, PaymentClaim, Invite, JournalDaily, WeighInWeekly, StarsLedger, Agent (camelCase fields, enums, indexes).
- **Migrations:** `prisma/migrations/`. Use `npx prisma migrate dev` for development; `npx prisma migrate deploy` for production.
- **Seed:** `prisma/seed.ts` — 10 demo users + 1 admin with hashed PIN; optional 1 agent with 2 users assigned.
