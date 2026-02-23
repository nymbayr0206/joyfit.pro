import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { normalizeMongolianPhone } from "@/lib/phone";

const MAX_ATTEMPTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

const attemptCountByIp = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attemptCountByIp.get(ip);
  if (!entry) return false;
  if (now >= entry.resetAt) {
    attemptCountByIp.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS_PER_MINUTE;
}

function recordAttempt(ip: string): void {
  const now = Date.now();
  const entry = attemptCountByIp.get(ip);
  if (!entry) {
    attemptCountByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  if (now >= entry.resetAt) {
    attemptCountByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawPhone = String(body.phone ?? "").trim();
    const pin = String(body.pin ?? body.code ?? "").trim();

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

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      recordAttempt(ip);
      return NextResponse.json(
        {
          ok: false,
          error:
            "Бүртгэлгүй байна. Төлбөр баталгаажуулах хэсгээр бүртгүүлнэ үү.",
          redirectToPayment: true,
        },
        { status: 400 }
      );
    }

    if (!pin || pin.length !== 6) {
      return NextResponse.json(
        { ok: false, error: "PIN 6 оронтой байна." },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(pin, user.pinHash);
    if (!match) {
      recordAttempt(ip);
      return NextResponse.json(
        { ok: false, error: "Буруу PIN." },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[joyfit:auth:login]", user.id, { phone });
    }

    await setSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      redirect: "/app/leaderboard",
    });
  } catch (err) {
    console.error("API_ERROR /api/auth/login", err);
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
