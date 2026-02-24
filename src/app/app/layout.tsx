import type { Metadata } from "next";
import { AppSidebar } from "@/components/AppSidebar";

export const metadata: Metadata = {
  title: "App – JOYFIT",
  description: "Жин хасах нийгэмлэг",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-50)]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
