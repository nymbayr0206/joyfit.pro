"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import type { AccessTier } from "@/lib/access";

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
  approvalStatus: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface LeaderboardClientProps {
  user: User;
  tier: AccessTier;
}

export function LeaderboardClient({ user, tier }: LeaderboardClientProps) {
  const searchParams = useSearchParams();
  const locked = searchParams.get("locked") === "1";
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLockedToast, setShowLockedToast] = useState(locked);
  const isLeaderboardOnly = tier === "LEADERBOARD_ONLY";

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.list)) setLeaderboard(data.list);
      });
  }, []);

  // Auto-dismiss locked toast after 5s
  useEffect(() => {
    if (!showLockedToast) return;
    const t = setTimeout(() => setShowLockedToast(false), 5000);
    return () => clearTimeout(t);
  }, [showLockedToast]);

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader>
        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-[var(--color-joyfit-primary)] font-medium"
            >
              Админ
            </Link>
          )}
          {user.approvalStatus === "approved" && (
            <Link
              href="/app"
              className="text-sm text-[var(--color-gray-600)] font-medium"
            >
              Самбар
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
        {showLockedToast && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-2">
            <p className="text-sm text-amber-800">
              Энэ хэсэг зөвхөн баталгаажсан хэрэглэгчидэд нээлттэй.
            </p>
            <button
              type="button"
              onClick={() => setShowLockedToast(false)}
              className="text-amber-600 hover:text-amber-800 shrink-0"
              aria-label="Хаах"
            >
              ×
            </button>
          </div>
        )}

        {isLeaderboardOnly && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <h2 className="text-base font-bold text-amber-900">
              Баталгаажуулалт хүлээгдэж байна
            </h2>
            <p className="text-sm text-amber-800 mt-1">
              Төлбөр баталгаажмагц бүх функц нээгдэнэ.
            </p>
            <Link
              href="/payment"
              className="mt-3 inline-block px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Төлбөрийн хүсэлт илгээх / Шалгах
            </Link>
          </div>
        )}

        <section>
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
                      {entry.approvalStatus !== "approved" && (
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
