import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { AppDashboardClient } from "./AppDashboardClient";

export default async function AppPage() {
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
  return (
    <AppDashboardClient
      user={{
        id: user.id,
        phone: user.phone,
        name: user.name,
        approvalStatus: user.approvalStatus,
        role: user.role,
      }}
    />
  );
}
