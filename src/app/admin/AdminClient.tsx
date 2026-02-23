"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";

type Tab = "pending" | "claims";

interface PendingUser {
  id: string;
  phone: string;
  name: string | null;
  approvalStatus: string;
  createdAt: string;
  lastClaim: { id: string; status: string; createdAt: string } | null;
}

interface ClaimItem {
  claim: {
    id: string;
    amountMnt: number;
    notePhone: string;
    status: string;
    createdAt: string;
    paidAt: string | null;
  };
  user: {
    id: string;
    phone: string;
    name: string | null;
    approvalStatus: string;
  };
}

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return d.toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

export function AdminClient() {
  const [tab, setTab] = useState<Tab>("pending");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [claimsStatus, setClaimsStatus] = useState<string>("submitted");
  const [claimsPhone, setClaimsPhone] = useState("");
  const [claimsPhoneFilter, setClaimsPhoneFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/users?status=pending");
      const data = await r.json();
      if (data.ok && Array.isArray(data.list)) setPendingUsers(data.list);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/payment-claims?status=${claimsStatus}`;
      if (claimsPhoneFilter.trim())
        url += `&phone=${encodeURIComponent(claimsPhoneFilter.trim())}`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.ok && Array.isArray(data.list)) setClaims(data.list);
    } finally {
      setLoading(false);
    }
  }, [claimsStatus, claimsPhoneFilter]);

  useEffect(() => {
    if (tab === "pending") fetchPending();
  }, [tab, fetchPending]);

  useEffect(() => {
    if (tab === "claims") fetchClaims();
  }, [tab, fetchClaims]);

  const handleApprove = async (claimId: string) => {
    setActioning(claimId);
    try {
      const r = await fetch(`/api/admin/payment-claims/${claimId}/approve`, {
        method: "POST",
      });
      const data = await r.json();
      if (data.ok) {
        fetchClaims();
        fetchPending();
      } else {
        alert(data.error ?? "Алдаа гарлаа");
      }
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (claimId: string) => {
    setActioning(claimId);
    try {
      const r = await fetch(`/api/admin/payment-claims/${claimId}/reject`, {
        method: "POST",
      });
      const data = await r.json();
      if (data.ok) {
        fetchClaims();
        fetchPending();
      } else {
        alert(data.error ?? "Алдаа гарлаа");
      }
    } finally {
      setActioning(null);
    }
  };

  const goToClaimsForPhone = (phone: string) => {
    setClaimsPhone(phone);
    setClaimsPhoneFilter(phone);
    setClaimsStatus("submitted");
    setTab("claims");
  };

  const applyClaimsFilter = () => {
    setClaimsPhoneFilter(claimsPhone);
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader>
        <a
          href="/app"
          className="text-sm text-[var(--color-gray-600)] hover:text-[var(--color-charcoal)]"
        >
          Буцах
        </a>
      </AppHeader>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[var(--color-charcoal)] mb-6">
          Админ — Баталгаажуулалт
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={`px-4 py-2 rounded-2xl font-medium transition-all ${
              tab === "pending"
                ? "bg-[var(--color-joyfit-primary)] text-white shadow-md"
                : "bg-white text-[var(--color-gray-600)] border border-gray-200 hover:border-emerald-300"
            }`}
          >
            Pending хэрэглэгчид
          </button>
          <button
            type="button"
            onClick={() => setTab("claims")}
            className={`px-4 py-2 rounded-2xl font-medium transition-all ${
              tab === "claims"
                ? "bg-[var(--color-joyfit-primary)] text-white shadow-md"
                : "bg-white text-[var(--color-gray-600)] border border-gray-200 hover:border-emerald-300"
            }`}
          >
            Payment claims
          </button>
        </div>

        {tab === "pending" && (
          <div className="step-card">
            {loading ? (
              <p className="text-sm text-[var(--color-gray-600)]">Ачаалж байна...</p>
            ) : pendingUsers.length === 0 ? (
              <p className="text-sm text-[var(--color-gray-600)]">
                Pending хэрэглэгч байхгүй.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                        Огноо
                      </th>
                      <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                        Утас
                      </th>
                      <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                        Нэр
                      </th>
                      <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                        Claim
                      </th>
                      <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 text-[var(--color-gray-600)]">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="py-3 font-medium">{u.phone}</td>
                        <td className="py-3">{u.name ?? "—"}</td>
                        <td className="py-3">
                          {u.lastClaim ? (
                            <span className="text-sm text-[var(--color-gray-600)]">
                              {u.lastClaim.status}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Claim байхгүй
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {u.lastClaim ? (
                            <button
                              type="button"
                              onClick={() => goToClaimsForPhone(u.phone)}
                              className="text-sm font-medium text-[var(--color-joyfit-primary)] hover:underline"
                            >
                              Claims
                            </button>
                          ) : (
                            <span className="text-xs text-[var(--color-gray-500)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "claims" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 sm:flex-row sm:items-center">
              <select
                value={claimsStatus}
                onChange={(e) => setClaimsStatus(e.target.value)}
                className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm text-[var(--color-charcoal)]"
              >
                <option value="submitted">submitted</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
              <input
                type="text"
                placeholder="Утасны дугаар (шүүх)"
                value={claimsPhone}
                onChange={(e) => setClaimsPhone(e.target.value)}
                className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm w-40"
              />
              <button
                type="button"
                onClick={applyClaimsFilter}
                className="px-4 py-2 rounded-xl bg-[var(--color-joyfit-primary)] text-white text-sm font-medium"
              >
                Шүүх
              </button>
            </div>

            <div className="step-card">
              {loading ? (
                <p className="text-sm text-[var(--color-gray-600)]">Ачаалж байна...</p>
              ) : claims.length === 0 ? (
                <p className="text-sm text-[var(--color-gray-600)]">
                  Claim олдсонгүй.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Огноо
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Утас
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Утга
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Дүн
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Төлөв
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Төлсөн
                        </th>
                        <th className="text-left py-2 font-semibold text-[var(--color-charcoal)]">
                          Үйлдэл
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map(({ claim, user }) => (
                        <tr
                          key={claim.id}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-3 text-[var(--color-gray-600)]">
                            {formatDate(claim.createdAt)}
                          </td>
                          <td className="py-3 font-medium">{user.phone}</td>
                          <td className="py-3">{claim.notePhone}</td>
                          <td className="py-3">{claim.amountMnt.toLocaleString()}₮</td>
                          <td className="py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                              {claim.status}
                            </span>
                          </td>
                          <td className="py-3">
                            {claim.paidAt
                              ? formatDate(claim.paidAt)
                              : "—"}
                          </td>
                          <td className="py-3">
                            {claim.status === "submitted" ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(claim.id)}
                                  disabled={actioning === claim.id}
                                  className="text-sm font-medium text-[var(--color-joyfit-primary)] hover:underline disabled:opacity-50"
                                >
                                  {actioning === claim.id ? "..." : "Approve"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(claim.id)}
                                  disabled={actioning === claim.id}
                                  className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[var(--color-gray-500)]">
                                {claim.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
