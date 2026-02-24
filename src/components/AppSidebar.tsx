"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  BookText,
  Scale,
  UserPlus,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Хянах самбар", href: "/app", icon: LayoutDashboard },
  { name: "Тэргүүлэгчид", href: "/app/leaderboard", icon: Trophy, locked: true },
  { name: "Өдрийн тэмдэглэл", href: "/app/journal", icon: BookText, locked: true },
  { name: "Жингийн бүртгэл", href: "/app/weighin", icon: Scale, locked: true },
  { name: "Урих", href: "/app/invite", icon: UserPlus, locked: true },
];

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[var(--color-joyfit-primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <span className="font-bold text-xl text-[var(--color-charcoal)]">
            JOYFIT
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isLocked = item.locked;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${
                  isActive
                    ? "bg-[var(--color-joyfit-primary-light)] text-[var(--color-joyfit-primary)] font-semibold"
                    : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"
                }
                ${isLocked ? "opacity-60 cursor-not-allowed" : ""}
              `}
              aria-disabled={isLocked}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              {isLocked && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Гарах</span>
        </button>
      </div>
    </aside>
  );
}
