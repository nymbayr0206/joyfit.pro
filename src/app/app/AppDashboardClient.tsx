"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";

interface User {
  id: string;
  phone: string;
  name: string | null;
  approvalStatus: string;
  role: string;
}

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  approvalStatus?: string;
  gold: number;
  silver: number;
  bronze: number;
}

export function AppDashboardClient({ user }: { user: User }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.list)) setLeaderboard(data.list);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader>
        <div className="flex items-center gap-3">
          <Link
            href="/app/leaderboard"
            className="text-sm text-[var(--color-joyfit-primary)] font-medium"
          >
            Leaderboard
          </Link>
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-[var(--color-joyfit-primary)] font-medium"
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
            className="text-sm text-[var(--color-gray-600)]"
          >
            Гарах
          </button>
        </div>
      </AppHeader>

      <main className="max-w-lg mx-auto px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/app/journal"
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-[var(--color-charcoal)] hover:bg-gray-50"
          >
            Өдрийн тэмдэглэл
          </Link>
          <Link
            href="/app/weighin"
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-[var(--color-charcoal)] hover:bg-gray-50"
          >
            Жингийн бүртгэл
          </Link>
          <Link
            href="/app/invite"
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-[var(--color-charcoal)] hover:bg-gray-50"
          >
            Урилга
          </Link>
        </nav>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-[var(--color-charcoal)] mb-3">
            Leaderboard
          </h2>
          <div className="step-card">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-[var(--color-gray-600)]">
                Одоогоор мэдээлэл байхгүй.
              </p>
            ) : (
              <ul className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <li
                    key={entry.userId}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-charcoal)]">
                        {i + 1}. {entry.displayName}
                      </span>
                      {entry.approvalStatus && entry.approvalStatus !== "approved" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-[var(--color-gray-600)]">
                      🥇{entry.gold} 🥈{entry.silver} 🥉{entry.bronze}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
