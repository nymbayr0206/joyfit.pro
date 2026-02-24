# Agent Rules for JoyFit MVP

This document defines rules and guidelines for AI agents working on the JoyFit codebase.

## Code Style & Standards

- **TypeScript strict mode**: All code must be TypeScript with proper types
- **No `any` types**: Use explicit types or `unknown` when type is truly dynamic
- **Component structure**: Use React Server Components by default; mark `"use client"` only when needed
- **Error handling**: Always handle errors gracefully with user-friendly messages
- **Mobile-first**: All UI must work on mobile screens (320px+) before desktop

## Database & Prisma

- **Never modify schema directly**: Use `npx prisma migrate dev` to create migrations
- **Seed data**: Update `prisma/seed.ts` when adding new required test data
- **Transactions**: Use Prisma transactions for multi-step database operations
- **Phone field**: Always treat phone as string, never as number

## Authentication

- **Phone + PIN only**: No email, no OAuth, no SMS OTP in MVP
- **PIN storage**: Always hash PINs with bcrypt (cost factor 10), never store plain text
- **Session validation**: Check user session on protected routes
- **Admin access**: Use `role="admin"` check, not hardcoded phone numbers

## Testing

Before submitting changes, verify:

1. **Dev server runs**: `npm run dev` starts without errors
2. **TypeScript compiles**: No type errors in build
3. **Prisma generates**: `npx prisma generate` succeeds
4. **Migrations apply**: `npx prisma migrate dev` works on fresh DB
5. **Seed works**: `npm run prisma:seed` creates test accounts
6. **Login flow**: Can log in with seed account (phone: 90000001, PIN: 123456)
7. **Mobile responsive**: Test on 375px viewport minimum

## File Organization

- **API routes**: `/src/app/api/[feature]/route.ts`
- **Components**: `/src/app/[route]/components/` or `/src/components/` for shared
- **Types**: `/src/types/` for shared types
- **Utilities**: `/src/lib/` for shared logic
- **Prisma**: `/prisma/` for schema, migrations, and seed

## Commit Guidelines

- **Small commits**: One logical change per commit
- **Clear messages**: Use format: `feat: add X`, `fix: resolve Y`, `docs: update Z`
- **Test before commit**: Ensure code runs and passes basic smoke tests
