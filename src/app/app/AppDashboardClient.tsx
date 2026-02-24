"use client";

import Link from "next/link";
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
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">
            Хянах самбар
          </h1>
          <p className="text-[var(--color-gray-600)]">
            Welcome, {user.name || user.phone}
            {user.role === "admin" && (
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[var(--color-joyfit-primary-light)] text-[var(--color-joyfit-primary)]">
                Admin
              </span>
            )}
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-[var(--color-charcoal)] mb-4">
            Top Performers
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-[var(--color-gray-600)]">
                Одоогоор мэдээлэл байхгүй.
              </p>
            ) : (
              <ul className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <li
                    key={entry.userId}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[var(--color-gray-400)] w-6">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-[var(--color-charcoal)]">
                        {entry.displayName}
                      </span>
                      {entry.approvalStatus && entry.approvalStatus !== "approved" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-[var(--color-gray-600)] flex items-center gap-2">
                      <span>🥇{entry.gold}</span>
                      <span>🥈{entry.silver}</span>
                      <span>🥉{entry.bronze}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/app/leaderboard"
              className="mt-4 text-sm text-[var(--color-joyfit-primary)] font-medium inline-block hover:underline"
            >
              View full leaderboard →
            </Link>
          </div>
        </section>

        {user.role === "admin" && (
          <section>
            <h2 className="text-lg font-bold text-[var(--color-charcoal)] mb-4">
              Admin Actions
            </h2>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-charcoal)] text-white font-medium hover:bg-[var(--color-charcoal-soft)] transition-all"
            >
              Open Admin Panel
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
