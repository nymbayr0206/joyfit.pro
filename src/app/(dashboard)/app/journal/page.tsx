import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { getAccessTier } from "@/lib/access";

export default async function JournalPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { approvalStatus: true, role: true },
  });
  if (!user || getAccessTier(user) !== "FULL") redirect("/app/leaderboard?locked=1");

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--color-charcoal)] mb-4">Өдрийн тэмдэглэл</h1>
      <div className="step-card">
        <p className="text-sm text-[var(--color-gray-600)]">Функц хөгжүүлэгдэж байна.</p>
      </div>
    </div>
  );
}
