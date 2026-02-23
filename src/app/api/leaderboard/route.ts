import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

type LeaderboardRow = {
  userId: string;
  displayName: string | null;
  approvalStatus: string;
  gold: number;
  silver: number;
  bronze: number;
};

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Include approved AND pending users (real leaderboard, no masking)
  const rows = await prisma.$queryRaw<LeaderboardRow[]>`
    SELECT
      u.id AS "userId",
      COALESCE(u.name, '****' || RIGHT(u.phone, 4)) AS "displayName",
      u."approvalStatus" AS "approvalStatus",
      COALESCE(SUM(s."goldCount"), 0)::int AS gold,
      COALESCE(SUM(s."silverCount"), 0)::int AS silver,
      COALESCE(SUM(s."bronzeCount"), 0)::int AS bronze
    FROM "User" u
    LEFT JOIN "StarsLedger" s ON s."userId" = u.id
    WHERE u."approvalStatus" IN ('approved', 'pending')
    GROUP BY u.id, u.name, u.phone, u."approvalStatus"
    ORDER BY gold DESC, silver DESC, bronze DESC
  `;

  const list = rows.map((r) => ({
    userId: r.userId,
    displayName: r.displayName ?? "****",
    approvalStatus: r.approvalStatus,
    gold: Number(r.gold),
    silver: Number(r.silver),
    bronze: Number(r.bronze),
  }));

  return NextResponse.json({ ok: true, list });
}
