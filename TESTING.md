# Testing the Prisma + PostgreSQL Foundation

This guide walks you through testing the database foundation locally.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 14+ running locally or via Docker
- Git

## Setup Steps

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd joyfit-app
npm install
```

### 2. Configure Database

Copy the example environment file and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/joyfit?schema=public"
```

### 3. Run Database Migrations

```bash
npm run prisma:migrate
```

This creates all tables and enums in your PostgreSQL database.

### 4. Seed the Database

```bash
npm run prisma:seed
```

This creates:
- 1 admin user (phone: `99999999`)
- 63 demo users with realistic Mongolian names (phones: `88000000` - `88000062`)
- Sample star ledger entries for leaderboard testing

### 5. Verify Database Connectivity

Start the Next.js development server:

```bash
npm run dev
```

Then visit the health endpoint:

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

### 6. Explore the Database

Use Prisma Studio to browse the seeded data:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view all tables and records.

## Database Schema Overview

### User
- Core user model with phone authentication
- Roles: USER, ADMIN
- Approval workflow: PENDING → APPROVED/REJECTED

### PaymentClaim
- Tracks 89,000 MNT reward claims
- Status: SUBMITTED → APPROVED/REJECTED
- Links to User

### JournalEntry
- Daily habits: meals, water (glasses), workout, sleep
- Optional notes for each category
- Unique per user per day

### WeighIn
- Weekly weight tracking
- Decimal precision for kg
- Unique per user per date

### StarLedger
- Achievement tracking (BRONZE, SILVER, GOLD)
- Links to weight delta and monetary amounts
- Used for leaderboard

### Invite
- Referral system with unique invite codes
- Tracks who invited whom

## Troubleshooting

### Migration Errors

If migrations fail, reset the database:

```bash
npx prisma migrate reset
```

This will drop all tables, rerun migrations, and reseed data.

### Connection Issues

Verify PostgreSQL is running:

```bash
psql -h localhost -U <username> -d joyfit -c "SELECT version();"
```

### Seed Script Issues

Run the seed script directly for more detailed output:

```bash
npx tsx prisma/seed.ts
```

## Quick Docker PostgreSQL Setup

If you don't have PostgreSQL installed:

```bash
docker run --name joyfit-db -e POSTGRES_PASSWORD=password -e POSTGRES_USER=joyfit -e POSTGRES_DB=joyfit -p 5432:5432 -d postgres:16-alpine
```

Then use this DATABASE_URL in `.env`:

```
DATABASE_URL="postgresql://joyfit:password@localhost:5432/joyfit?schema=public"
```
