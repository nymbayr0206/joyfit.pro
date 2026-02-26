# PR #3: Prisma + PostgreSQL Database Foundation for JoyFit MVP

## Overview

This PR establishes the complete database foundation for the JoyFit MVP using Prisma ORM and PostgreSQL. The schema is focused on core functionality: user management, payment claims, daily journaling, weight tracking, achievement stars, and invitations.

## Changes Made

### 1. Database Schema (`prisma/schema.prisma`)

Created 6 core models with proper relationships and constraints:

#### User
- **Fields**: id, phone (unique), firstName, lastName (optional), role, approvalStatus, createdAt
- **Enums**: role (USER | ADMIN), approvalStatus (PENDING | APPROVED | REJECTED)
- **Relations**: paymentClaims, journalEntries, weighIns, starLedger, invitesSent
- **Auth**: pinHash for PIN-based authentication, sessions for login state

#### PaymentClaim
- **Fields**: id, userId, status, createdAt, paidAt (optional), note (optional)
- **Enum**: status (SUBMITTED | APPROVED | REJECTED)
- **Purpose**: Tracks 89,000 MNT reward claims for user onboarding

#### JournalEntry
- **Fields**: id, userId, date, mealChecked, mealNote, waterGlasses (default 0), workoutChecked, workoutNote, sleepChecked, sleepNote, feelingNote, createdAt, updatedAt
- **Constraint**: Unique per userId + date
- **Purpose**: Daily habit tracking with granular checkboxes and notes

#### WeighIn
- **Fields**: id, userId, date, weightKg (Decimal), note, createdAt
- **Constraint**: Unique per userId + date
- **Purpose**: Weight tracking with decimal precision

#### StarLedger
- **Fields**: id, userId, type, kgDelta (optional Decimal), amountMnt (optional), createdAt
- **Enum**: type (BRONZE | SILVER | GOLD)
- **Purpose**: Achievement tracking for leaderboard and rewards

#### Invite
- **Fields**: id, inviterUserId, code (unique), createdAt
- **Purpose**: Referral system with unique invite codes

### 2. Supporting Models

- **Session**: Token-based authentication with expiration
- **Lead**: Lead capture from landing page

### 3. Database Migration

Created clean initial migration: `20260224000000_init/migration.sql`
- All tables with proper indexes
- Foreign key constraints with CASCADE on delete
- Unique constraints for phone, codes, and composite keys

### 4. Seed Script (`prisma/seed.ts`)

- Creates 1 admin user (phone: `99999999`)
- Creates 63 demo users (phones: `88000000` - `88000062`)
- Uses authentic Mongolian names (Бат, Болд, Энх, Отгон, etc.)
- Seeds sample star ledger entries for leaderboard testing
- All users approved by default for easy testing

### 5. Health Check Endpoint (`/api/health`)

Simple database connectivity check:
- Returns `{ status: "ok", database: "connected" }` on success
- Returns `{ status: "error", database: "disconnected" }` with 503 on failure

### 6. Configuration

- **`.env.example`**: Template with `DATABASE_URL` for PostgreSQL connection
- **`package.json`**: Already includes scripts:
  - `npm run prisma:migrate` - Run database migrations
  - `npm run prisma:seed` - Seed demo data
  - `npm run prisma:generate` - Generate Prisma Client

### 7. Code Updates

Updated existing API routes to match new schema:
- Fixed enum values (lowercase → UPPERCASE)
- Updated User model references (name → firstName/lastName)
- Updated PaymentClaim references (amountMnt/notePhone → note)
- All TypeScript compilation passes

## How to Test Locally

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   # Option A: Use Docker
   docker run --name joyfit-db \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_USER=joyfit \
     -e POSTGRES_DB=joyfit \
     -p 5432:5432 -d postgres:16-alpine

   # Option B: Use existing PostgreSQL
   createdb joyfit
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set your DATABASE_URL
   ```

4. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed demo data:**
   ```bash
   npm run prisma:seed
   ```

   Expected output:
   ```
   ✓ Admin user created (phone: 99999999)
   ✓ 63 demo users created
   ✓ Sample star ledger entries created for leaderboard
   🎉 Seed complete: 1 admin + 63 demo users with sample stars
   ```

6. **Start the app:**
   ```bash
   npm run dev
   ```

7. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2026-02-24T..."
   }
   ```

8. **Explore data with Prisma Studio:**
   ```bash
   npx prisma studio
   ```

   Opens at `http://localhost:5555` - browse all tables and seeded data

### Test Login

You can test authentication with any demo user:
- Phone: `88000000` through `88000062` (any of the 63 demo users)
- PIN: Not set in seed (would need to register through payment flow)

Or use the admin user:
- Phone: `99999999`
- PIN: Not set in seed

### Database Reset

To reset and reseed:
```bash
npx prisma migrate reset
```

This drops all tables, reruns migrations, and reseeds automatically.

## Key Design Decisions

1. **Uppercase Enums**: All enum values use UPPERCASE for consistency (USER, ADMIN, PENDING, etc.)
2. **UUID Primary Keys**: All models use UUIDs for better scalability
3. **Cascade Deletes**: User deletion cascades to all related records
4. **Decimal for Weight**: Using `Decimal(5,2)` for precise weight tracking
5. **Date-only Fields**: JournalEntry and WeighIn use `@db.Date` for date-only storage
6. **Unique Constraints**: Prevent duplicate entries per user per day/date

## Files Changed

- `prisma/schema.prisma` - Complete schema rewrite for MVP focus
- `prisma/migrations/` - Fresh migration reflecting new schema
- `prisma/seed.ts` - Enhanced with 63 Mongolian-named demo users
- `src/app/api/health/route.ts` - New health check endpoint
- `.env.example` - Database configuration template
- `TESTING.md` - Comprehensive testing guide
- Multiple API route files - Updated to match new schema

## What's Next

After this PR is merged:
1. Set up production database (PostgreSQL instance)
2. Run migrations in production
3. Configure environment variables
4. The app will be ready for user registration and core feature development

## Notes

- All code is TypeScript-compliant (verified with `tsc --noEmit`)
- Migration is reversible with `prisma migrate reset`
- Seed script is idempotent (uses upsert)
- Health endpoint can be used for monitoring/alerts
