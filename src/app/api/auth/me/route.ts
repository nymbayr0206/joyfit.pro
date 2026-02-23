import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

/**
 * Lightweight auth endpoint for middleware.
 * Returns minimal user info (approvalStatus, role) for access checks.
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, user: null });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, approvalStatus: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ ok: false, user: null });
  }
  return NextResponse.json({ ok: true, user });
}
