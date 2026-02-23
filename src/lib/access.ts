import type { ApprovalStatus } from "@prisma/client";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessTier } from "@/lib/access-tier";

export type { AccessTier } from "@/lib/access-tier";
export { getAccessTier } from "@/lib/access-tier";

/**
 * For APIs that require FULL tier (journal, weighin, invite, profile changes).
 * Returns user if tier is FULL; otherwise throws with 403.
 */
export async function requireFullTier(): Promise<{ id: string; approvalStatus: ApprovalStatus }> {
  const userId = await getSessionUserId();
  if (!userId) {
    const err = new Error("Unauthorized");
    (err as { status?: number }).status = 401;
    throw err;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, approvalStatus: true },
  });
  if (!user) {
    const err = new Error("Unauthorized");
    (err as { status?: number }).status = 401;
    throw err;
  }
  if (getAccessTier(user) !== "FULL") {
    const err = new Error("Forbidden");
    (err as { status?: number }).status = 403;
    throw err;
  }
  return user;
}
