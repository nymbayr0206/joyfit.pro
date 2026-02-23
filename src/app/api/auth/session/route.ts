import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, user: null });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      approvalStatus: true,
      role: true,
    },
  });
  if (!user) {
    return NextResponse.json({ ok: false, user: null });
  }
  return NextResponse.json({ ok: true, user });
}
