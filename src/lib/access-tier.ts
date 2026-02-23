/**
 * Edge-safe: no Node.js or Prisma imports.
 * Single source of truth for user access tier.
 */

export type AccessTier = "FULL" | "LEADERBOARD_ONLY";

/**
 * - FULL: All core routes and APIs accessible (approval_status === 'approved')
 * - LEADERBOARD_ONLY: Only leaderboard page and read API accessible
 */
export function getAccessTier(user: { approvalStatus: string }): AccessTier {
  return user.approvalStatus === "approved" ? "FULL" : "LEADERBOARD_ONLY";
}
