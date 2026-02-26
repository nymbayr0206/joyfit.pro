import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ApprovalStatus, PaymentClaimStatus } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    const status = (err as { status?: number }).status ?? 401;
    return NextResponse.json(
      { ok: false, error: status === 403 ? "Forbidden" : "Unauthorized" },
      { status }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Claim ID required" },
      { status: 400 }
    );
  }

  const claim = await prisma.paymentClaim.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true },
  });

  if (!claim) {
    return NextResponse.json(
      { ok: false, error: "Claim not found" },
      { status: 404 }
    );
  }

  if (claim.status !== PaymentClaimStatus.SUBMITTED) {
    return NextResponse.json(
      { ok: false, error: "Claim already processed" },
      { status: 400 }
    );
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.paymentClaim.update({
      where: { id },
      data: { status: PaymentClaimStatus.APPROVED, paidAt: now },
    }),
    prisma.user.update({
      where: { id: claim.userId },
      data: { approvalStatus: ApprovalStatus.APPROVED },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
