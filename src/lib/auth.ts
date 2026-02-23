import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "joyfit_session";
const SESSION_AGE_SEC = 60 * 60 * 24 * 30; // 30 days
const DEV_CODE = process.env.DEV_LOGIN_CODE ?? "1111";

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getDevCode() {
  return DEV_CODE;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value ?? null;
}

export async function getSessionUserId(): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    select: { userId: true },
  });
  return session?.userId ?? null;
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_AGE_SEC * 1000);
  await prisma.session.create({
    data: { userId, token, expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_AGE_SEC,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function verifyDevCode(code: string): boolean {
  return code === DEV_CODE;
}
