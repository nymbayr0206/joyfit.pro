import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ApprovalStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    const status = (err as { status?: number }).status ?? 401;
    return NextResponse.json(
      { ok: false, error: status === 403 ? "Forbidden" : "Unauthorized" },
      { status }
    );
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? "pending";
  const status =
    statusParam === "approved"
      ? ApprovalStatus.approved
      : statusParam === "rejected"
        ? ApprovalStatus.rejected
        : ApprovalStatus.pending;

  const users = await prisma.user.findMany({
    where: { approvalStatus: status },
    select: {
      id: true,
      phone: true,
      name: true,
      approvalStatus: true,
      createdAt: true,
      paymentClaims: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, status: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const list = users.map((u) => ({
    id: u.id,
    phone: u.phone,
    name: u.name,
    approvalStatus: u.approvalStatus,
    createdAt: u.createdAt,
    lastClaim: u.paymentClaims[0]
      ? {
          id: u.paymentClaims[0].id,
          status: u.paymentClaims[0].status,
          createdAt: u.paymentClaims[0].createdAt,
        }
      : null,
  }));

  return NextResponse.json({ ok: true, list });
}
