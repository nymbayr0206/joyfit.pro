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
      firstName: true,
      lastName: true,
      approvalStatus: true,
      role: true,
    },
  });
  if (!user) {
    redirect("/login");
  }
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.phone;
  return (
    <AppDashboardClient
      user={{
        id: user.id,
        phone: user.phone,
        name: userName,
        approvalStatus: user.approvalStatus,
        role: user.role,
      }}
    />
  );
}
