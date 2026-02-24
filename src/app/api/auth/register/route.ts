import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, pin, name, email } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Утасны дугаар шаардлагатай." },
        { status: 400 }
      );
    }

    if (!pin || typeof pin !== "string" || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN 6 оронтой тоо байх ёстой." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ утасны дугаар бүртгэлтэй байна." },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const user = await prisma.user.create({
      data: {
        phone: cleanPhone,
        pinHash,
        name: name?.trim() || null,
        email: email?.trim() || null,
        approvalStatus: "pending",
        role: "user",
      },
    });

    await setSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      redirect: "/app",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Бүртгэлд алдаа гарлаа." },
      { status: 500 }
    );
  }
}
