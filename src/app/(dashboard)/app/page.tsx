import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppDashboardClient } from "./AppDashboardClient";

export default async function AppPage() {
  const userId = await getSessionUserId();
  
  const user = await prisma.user.findUnique({
    where: { id: userId! },
    select: {
      id: true,
      phone: true,
      name: true,
      approvalStatus: true,
      role: true,
    },
  });

  return (
    <AppDashboardClient
      user={{
        id: user!.id,
        phone: user!.phone,
        name: user!.name,
        approvalStatus: user!.approvalStatus,
        role: user!.role,
      }}
    />
  );
}
