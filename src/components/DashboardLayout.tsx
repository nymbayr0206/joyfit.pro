"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";

interface User {
  id: string;
  phone: string;
  name: string | null;
  approvalStatus: string;
  role: string;
}

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/app", label: "Үндсэн", exact: true },
    { href: "/app/journal", label: "Өдрийн тэмдэглэл" },
    { href: "/app/weighin", label: "Жингийн бүртгэл" },
    { href: "/app/leaderboard", label: "Leaderboard" },
    { href: "/app/invite", label: "Урилга" },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader>
        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-[var(--color-joyfit-primary)] font-medium hover:underline"
            >
              Админ
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-sm text-[var(--color-gray-600)] hover:text-[var(--color-charcoal)]"
          >
            Гарах
          </button>
        </div>
      </AppHeader>

      <main className="max-w-lg mx-auto px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-[var(--color-joyfit-primary)] text-white border-[var(--color-joyfit-primary)]"
                  : "bg-white border-gray-200 text-[var(--color-charcoal)] hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </main>
    </div>
  );
}
