"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid") === "1";
  const ok = searchParams.get("ok") === "1";
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectToPayment, setRedirectToPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRedirectToPayment(false);
    if (!phone.trim()) {
      setError("Утасны дугаараа оруулна уу.");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError("PIN 6 оронтой байна.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone.trim(), pin: pin.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Нэвтрэхэд алдаа гарлаа.");
      setRedirectToPayment(Boolean(data.redirectToPayment));
      return;
    }
    if (data.redirect) router.push(data.redirect);
  };

  return (
    <>
      <h1 className="text-xl font-bold text-[var(--color-charcoal)] mb-1">
        Нэвтрэх
      </h1>
      <p className="text-sm text-[var(--color-gray-600)] mb-6">
        Утасны дугаар + 6 оронтой PIN
      </p>

      {paid && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-joyfit-primary-light)] border border-emerald-200">
          <p className="text-sm text-[var(--color-charcoal-soft)]">
            Төлбөр амжилттай илгээгдлээ. Одоо нэвтэрч болно.
          </p>
        </div>
      )}
      {ok && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-joyfit-primary-light)] border border-emerald-200">
          <p className="text-sm text-[var(--color-charcoal-soft)]">
            Нэвтрэлт амжилттай. Дараагийн шатанд хамгаалалт идэвхжинэ.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="phone">
            Утасны дугаар
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            className="input-field"
            placeholder="80123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="pin">
            PIN (6 орон)
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            className="input-field"
            placeholder="******"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
        </div>
        {error && (
          <div>
            <p className="text-sm text-red-600">{error}</p>
            {redirectToPayment && (
              <a
                href="/payment"
                className="text-sm text-[var(--color-joyfit-primary)] underline mt-2 inline-block"
              >
                Төлбөр баталгаажуулах хэсэгт орох
              </a>
            )}
          </div>
        )}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </button>
      </form>

      <p className="text-xs text-[var(--color-gray-500)] mt-6 text-center">
        Шинэ хэрэглэгч үү? <a href="/register" className="text-[var(--color-joyfit-primary)] underline">Бүртгүүлэх</a>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-gray-50)] flex items-center justify-center">
          <p className="text-[var(--color-gray-600)]">Ачаалж байна...</p>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
