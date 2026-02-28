# MVP Acceptance Criteria

This document defines the acceptance criteria for JoyFit MVP v0.1.

## Core Features (Must Have)

### 1. User Registration & Authentication
- [ ] User can register with phone number + 6-digit PIN
- [ ] User can log in with phone + PIN
- [ ] PIN is hashed with bcrypt (never stored plain text)
- [ ] Session persists across page refreshes
- [ ] User can log out

### 2. Weekly Weigh-In
- [ ] User can submit weight once per week
- [ ] Cannot submit more than once in same week
- [ ] Weight is stored with timestamp
- [ ] Weight history is viewable

### 3. Star Rewards System
- [ ] User earns stars for weekly weigh-ins
- [ ] Stars are displayed on dashboard
- [ ] Stars ledger tracks all earnings
- [ ] Star balance is accurate

### 4. Leaderboard
- [ ] Shows all active users ranked by stars
- [ ] Updates in real-time when stars change
- [ ] Shows user's rank and total stars
- [ ] Mobile-responsive display

### 5. Invite System
- [ ] User can generate invite code
- [ ] New user can register with invite code
- [ ] Inviter and invitee both earn stars
- [ ] Invite tracking works correctly

### 6. Admin Panel
- [ ] Admin can view all users
- [ ] Admin can view payment claims
- [ ] Admin can approve/reject payment claims
- [ ] Admin-only access (redirects non-admins)

## Technical Requirements

### Database
- [x] Prisma schema with 8 models (User, Lead, PaymentClaim, Invite, JournalDaily, WeighInWeekly, StarsLedger, Agent)
- [x] Baseline migration applies cleanly
- [x] Seed script creates test accounts
- [x] Database indexes on frequently queried fields

### Security
- [ ] Bcrypt PIN hashing (cost factor 10)
- [ ] Session validation on protected routes
- [ ] No sensitive data in client-side code
- [ ] SQL injection prevention (Prisma parameterized queries)

### UI/UX
- [ ] Mobile-first responsive design (320px+)
- [ ] Clean, modern interface
- [ ] Loading states for async operations
- [ ] Error messages are user-friendly
- [ ] All forms have validation

## How to Test

### Setup Test Environment

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed test accounts
npm run prisma:seed

# Start dev server
npm run dev
```

### Test Accounts

After seeding, use these accounts:

| Role  | Phone    | PIN    |
|-------|----------|--------|
| User  | 90000001 | 123456 |
| Admin | 99999999 | 123456 |

### Manual Test Checklist

1. **Login**: Visit `/login` and authenticate with seed account
2. **Dashboard**: Verify user data loads correctly
3. **Weigh-In**: Submit weekly weight entry
4. **Stars**: Confirm stars appear after weigh-in
5. **Leaderboard**: Check ranking updates at `/app/leaderboard`
6. **Invite**: Generate invite code and test registration flow
7. **Admin**: Log in as admin (99999999) and access `/admin`
8. **Mobile**: Test all flows on 375px viewport

### Acceptance Criteria

- All core features are functional
- No TypeScript errors (`npm run build`)
- No console errors in browser
- All seed accounts work
- Mobile responsive on iPhone SE (375px) and larger
- Admin panel accessible only to admin users

## Out of Scope (Future Phases)

- SMS OTP verification
- Email notifications
- Password reset flow
- Payment processing
- Social media integration
- Native mobile apps
