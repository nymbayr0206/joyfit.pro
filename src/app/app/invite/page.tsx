import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { getAccessTier } from "@/lib/access";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export default async function InvitePage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { approvalStatus: true, role: true },
  });
  if (!user || getAccessTier(user) !== "FULL") redirect("/app/leaderboard?locked=1");

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader>
        <Link href="/app" className="text-sm text-[var(--color-gray-600)] font-medium">
          Самбар
        </Link>
      </AppHeader>
      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Урилга</h1>
        <p className="text-sm text-[var(--color-gray-600)] mt-2">Функц хөгжүүлэгдэж байна.</p>
      </main>
    </div>
  );
}
