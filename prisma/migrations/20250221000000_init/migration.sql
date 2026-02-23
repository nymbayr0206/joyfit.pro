-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('sedentary', 'light', 'moderate', 'active');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "PaymentClaimStatus" AS ENUM ('submitted', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('invited', 'joined', 'paid');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "gender" "Gender",
    "age" INTEGER,
    "currentWeightKg" DOUBLE PRECISION,
    "goalWeightKg" DOUBLE PRECISION,
    "mealsPerDay" INTEGER,
    "activityLevel" "ActivityLevel",
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentClaim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountMnt" INTEGER NOT NULL DEFAULT 89000,
    "notePhone" TEXT NOT NULL,
    "status" "PaymentClaimStatus" NOT NULL DEFAULT 'submitted',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "inviterUserId" TEXT NOT NULL,
    "friendName" TEXT NOT NULL,
    "friendPhone" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'invited',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalDaily" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mealsOnTime" BOOLEAN NOT NULL DEFAULT false,
    "waterOk" BOOLEAN NOT NULL DEFAULT false,
    "workoutDone" BOOLEAN NOT NULL DEFAULT false,
    "workoutNote" TEXT,
    "sleepOk" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeighInWeekly" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeighInWeekly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarsLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "bronzeCount" INTEGER NOT NULL DEFAULT 0,
    "silverCount" INTEGER NOT NULL DEFAULT 0,
    "goldCount" INTEGER NOT NULL DEFAULT 0,
    "reason" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StarsLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_approvalStatus_idx" ON "User"("approvalStatus");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentClaim_status_idx" ON "PaymentClaim"("status");

-- CreateIndex
CREATE INDEX "PaymentClaim_userId_idx" ON "PaymentClaim"("userId");

-- CreateIndex
CREATE INDEX "Invite_inviterUserId_idx" ON "Invite"("inviterUserId");

-- CreateIndex
CREATE INDEX "JournalDaily_userId_idx" ON "JournalDaily"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JournalDaily_userId_date_key" ON "JournalDaily"("userId", "date");

-- CreateIndex
CREATE INDEX "WeighInWeekly_userId_weekStartDate_idx" ON "WeighInWeekly"("userId", "weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "WeighInWeekly_userId_weekStartDate_key" ON "WeighInWeekly"("userId", "weekStartDate");

-- CreateIndex
CREATE INDEX "StarsLedger_userId_weekStartDate_idx" ON "StarsLedger"("userId", "weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "StarsLedger_userId_weekStartDate_key" ON "StarsLedger"("userId", "weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_code_key" ON "Agent"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentClaim" ADD CONSTRAINT "PaymentClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_inviterUserId_fkey" FOREIGN KEY ("inviterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalDaily" ADD CONSTRAINT "JournalDaily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeighInWeekly" ADD CONSTRAINT "WeighInWeekly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarsLedger" ADD CONSTRAINT "StarsLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

