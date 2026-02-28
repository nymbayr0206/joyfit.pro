import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <DashboardLayout
      user={{
        id: user.id,
        phone: user.phone,
        name: user.name,
        approvalStatus: user.approvalStatus,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
