# JoyFit MVP – Production Scaffold

Gamified accountability web app for weight loss with weekly weigh-ins, star rewards, leaderboard, and invite system.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS 4, Lucide Icons
- **Backend:** Next.js API routes, Prisma 6, PostgreSQL
- **Node:** >= 20.9.0 required for Next.js 14+
- **Auth:** Phone + 6-digit PIN (bcrypt hashed)

## Project Structure

```
/src
  /app
    /                    # Landing page with CTA to /checkup
    /login              # Login page (phone + PIN)
    /checkup            # Lead generation wizard
    /app                # Protected app area with sidebar layout
      /leaderboard      # Leaderboard page (locked placeholder)
      /journal          # Daily journal (locked placeholder)
      /weighin          # Weekly weigh-in (locked placeholder)
      /invite           # Invite friends (locked placeholder)
    /admin              # Admin panel (role-gated)
  /components           # Reusable React components
  /lib                  # Utilities (auth, env validation, prisma)
/prisma                 # Database schema and migrations
```

## Quick Start

### 1. Prerequisites

- Node.js >= 20.9.0
- PostgreSQL database (local or remote)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/joyfit"
NODE_ENV="development"
DEV_LOGIN_CODE="1111"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

**Note:** If upgrading from a legacy schema, use `npx prisma migrate reset` to drop all data and start fresh.

### 5. Seed Demo Data

Seed the database with demo users and an admin account:

```bash
npm run prisma:seed
```

This creates:
- 10 demo users (phones: 90000001–90000010, PIN: 123456)
- 1 admin user (phone: 99999999, PIN: 123456)

### 6. Start Development Server

```bash
npm run dev
```

Visit:
- Landing: http://localhost:3000
- Login: http://localhost:3000/login
- App Dashboard: http://localhost:3000/app
- Admin Panel: http://localhost:3000/admin  

## Routes Overview

### Public Routes
- **`/`** – Landing page with CTA to `/checkup`
- **`/login`** – Phone + PIN login
- **`/checkup`** – Lead generation wizard (health/weight questionnaire)

### Protected Routes (Requires Auth)
- **`/app`** – Dashboard with sidebar navigation
- **`/app/leaderboard`** – Leaderboard (locked placeholder)
- **`/app/journal`** – Daily journal tracking (locked placeholder)
- **`/app/weighin`** – Weekly weigh-in recording (locked placeholder)
- **`/app/invite`** – Friend invite system (locked placeholder)

### Admin Routes (Requires Admin Role)
- **`/admin`** – Admin panel for user/payment approval

## Seed Accounts

After running `npm run prisma:seed`:

| Role   | Phone    | PIN    | Access |
|--------|----------|--------|--------|
| Demo   | 90000001–90000010 | 123456 | User dashboard |
| Admin  | 99999999 | 123456 | Admin panel + dashboard |

## Building for Production

Test the production build:

```bash
npm run build
npm start
```

The build command:
1. Generates Prisma client
2. Validates environment variables
3. Builds Next.js app with TypeScript checking
4. Outputs to `.next/` directory

## Environment Variables

All environment variables are validated at build time via `src/lib/env.ts`.

**Required:**
- `DATABASE_URL` – PostgreSQL connection string

**Optional:**
- `NODE_ENV` – `development` | `production` | `test`
- `DEV_LOGIN_CODE` – Dev login bypass code (default: `1111`)

## Admin Access

**Create or promote an admin user:**

1. **Via seed:** `npm run prisma:seed` (creates admin 99999999)
2. **Via SQL:**
   ```bash
   npx prisma db execute --stdin <<< "UPDATE \"User\" SET role = 'admin' WHERE phone = 'YOUR_PHONE';"
   ```
3. **Via Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   Then open `User` table → edit user → set `role` to `admin`

## Database Schema

The app uses Prisma 6 with PostgreSQL:

- **Models:** User, Session, Lead, PaymentClaim, Invite, JournalDaily, WeighInWeekly, StarsLedger, Agent
- **Enums:** Gender, ActivityLevel, ApprovalStatus, UserRole, PaymentClaimStatus, InviteStatus
- **Schema file:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`

**Useful commands:**
- `npx prisma studio` – Open database GUI
- `npx prisma migrate dev` – Create and apply migrations
- `npx prisma migrate reset` – Reset database (WARNING: deletes all data)

## Development Notes

- **ESLint:** Configured with Next.js rules (`eslint.config.mjs`)
- **TypeScript:** Strict mode enabled (`tsconfig.json`)
- **TailwindCSS:** v4 with custom design tokens in `globals.css`
- **Auth:** Session-based with cookies, bcrypt for PIN hashing
- **Layout:** `/app` routes use sidebar layout with locked placeholders
