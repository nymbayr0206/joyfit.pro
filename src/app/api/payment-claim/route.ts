import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { normalizeMongolianPhone } from "@/lib/phone";
import { ApprovalStatus } from "@prisma/client";
import { UserRole } from "@prisma/client";

const SALT_ROUNDS = 10;

function validatePin(
  pin: string,
  confirmPin: string
): { ok: true } | { ok: false; error: string } {
  if (!/^\d{6}$/.test(pin)) {
    return { ok: false, error: "PIN 6 оронтой тоо байна." };
  }
  if (pin !== confirmPin) {
    return { ok: false, error: "PIN таарахгүй байна." };
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone ?? "").trim();
    const pin = String(body.pin ?? "").trim();
    const confirmPin = String(body.confirmPin ?? "").trim();
    const notePhone = String(body.notePhone ?? body.note_phone ?? rawPhone).trim();

    if (!rawPhone) {
      return NextResponse.json(
        { ok: false, error: "Утасны дугаараа оруулна уу." },
        { status: 400 }
      );
    }

    const phone = normalizeMongolianPhone(rawPhone);
    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Утасны дугаар 8 оронтой байна (жишээ: 80123456)." },
        { status: 400 }
      );
    }

    const pinResult = validatePin(pin, confirmPin);
    if (!pinResult.ok) {
      return NextResponse.json(
        { ok: false, error: pinResult.error },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          pinHash,
          approvalStatus: ApprovalStatus.pending,
          role: UserRole.user,
        },
      });
    } else {
      if (user.approvalStatus === ApprovalStatus.approved) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Баталгаажсан хэрэглэгчийн PIN-ийг солих боломжгүй. Админтай холбогдоно уу.",
          },
          { status: 400 }
        );
      }
      if (user.approvalStatus === ApprovalStatus.pending) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { pinHash },
        });
      }
    }

    await prisma.paymentClaim.create({
      data: {
        userId: user.id,
        amountMnt: 89000,
        notePhone: notePhone || phone,
        status: "submitted",
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[joyfit:payment-claim:submitted]", user.id, { phone });
    }

    await setSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      redirect: "/app/leaderboard",
      userId: user.id,
    });
  } catch (err) {
    console.error("API_ERROR /api/payment-claim", err);
    const payload: { ok: false; error: string; detail?: string; detailCode?: string } = {
      ok: false,
      error: "Internal Server Error",
    };
    if (process.env.NODE_ENV !== "production") {
      payload.detail = err instanceof Error ? err.message : String(err);
      if (typeof (err as { code?: string }).code !== "undefined") {
        payload.detailCode = (err as { code: string }).code;
      }
    }
    return NextResponse.json(payload, { status: 500 });
  }
}
