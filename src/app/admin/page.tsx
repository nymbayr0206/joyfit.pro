import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user || user.role !== UserRole.admin) {
    redirect("/login");
  }
  return <AdminClient />;
}
