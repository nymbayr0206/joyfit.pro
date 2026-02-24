import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { getAccessTier } from "@/lib/access";
import { LeaderboardClient } from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      approvalStatus: true,
      role: true,
    },
  });
  if (!user) {
    redirect("/login");
  }
  const tier = getAccessTier(user);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-gray-50)] flex items-center justify-center">
          <p className="text-[var(--color-gray-600)]">Ачаалж байна...</p>
        </div>
      }
    >
      <LeaderboardClient
        user={{
          id: user.id,
          phone: user.phone,
          name: user.name,
          approvalStatus: user.approvalStatus,
          role: user.role,
        }}
        tier={tier}
      />
    </Suspense>
  );
}
