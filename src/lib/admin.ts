import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export interface AdminUser {
  id: string;
  role: UserRole;
}

/**
 * Ensures the current session belongs to an admin user.
 * @returns The admin user
 * @throws 401 if no session
 * @throws 403 if role !== admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const userId = await getSessionUserId();
  if (!userId) {
    const err = new Error("Unauthorized");
    (err as { status?: number }).status = 401;
    throw err;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user || user.role !== UserRole.admin) {
    const err = new Error("Forbidden");
    (err as { status?: number }).status = 403;
    throw err;
  }
  return user;
}
