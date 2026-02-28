"use client";

import { useEffect, useState } from "react";

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
    <div>
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--color-charcoal)] mb-3">
          Нүүр хуудас
        </h2>
        <div className="step-card mb-4">
          <p className="text-sm text-[var(--color-gray-600)] mb-2">
            Тавтай морил, <span className="font-medium text-[var(--color-charcoal)]">{user.name || user.phone}</span>!
          </p>
          <p className="text-xs text-[var(--color-gray-500)]">
            Төлөв: {user.approvalStatus === "approved" ? "Баталгаажсан" : "Хүлээгдэж буй"}
          </p>
        </div>
      </section>

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
    </div>
  );
}
