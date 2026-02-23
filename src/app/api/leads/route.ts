import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeMongolianPhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const rawPhone =
      body.phone != null && body.phone !== ""
        ? String(body.phone).trim()
        : null;
    const phone = rawPhone ? normalizeMongolianPhone(rawPhone) ?? rawPhone : null;
    const payload = body.payload != null ? body.payload : {};

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "И-мэйл хаягаа оруулна уу." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        email,
        phone,
        payload: payload as object,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[joyfit:lead:created]", lead.id, { email: lead.email });
    }

    return NextResponse.json({ ok: true, id: lead.id, leadId: lead.id });
  } catch (e) {
    console.error("[joyfit:leads:error]", e);
    return NextResponse.json(
      { ok: false, error: "Lead бүртгэхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
}
