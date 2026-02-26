import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { PaymentClaimStatus } from "@prisma/client";

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
  const statusParam = searchParams.get("status") ?? "submitted";
  const phoneFilter = searchParams.get("phone")?.trim() || null;

  const status =
    statusParam === "approved"
      ? PaymentClaimStatus.APPROVED
      : statusParam === "rejected"
        ? PaymentClaimStatus.REJECTED
        : PaymentClaimStatus.SUBMITTED;

  const where: { status: PaymentClaimStatus; user?: { phone: string } } = {
    status,
  };
  if (phoneFilter) {
    where.user = { phone: phoneFilter };
  }

  const claims = await prisma.paymentClaim.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          phone: true,
          firstName: true,
          lastName: true,
          approvalStatus: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const list = claims.map((c) => ({
    claim: {
      id: c.id,
      note: c.note,
      status: c.status,
      createdAt: c.createdAt,
      paidAt: c.paidAt,
    },
    user: {
      id: c.user.id,
      phone: c.user.phone,
      name: `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || c.user.phone,
      approvalStatus: c.user.approvalStatus,
    },
  }));

  return NextResponse.json({ ok: true, list });
}
