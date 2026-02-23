"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [notePhone, setNotePhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailFromCheckup = (() => {
    try {
      const raw = searchParams.get("email") ?? "";
      return raw ? decodeURIComponent(raw) : "";
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    if (phone && !notePhone) setNotePhone(phone);
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedPhone = phone.replace(/\s/g, "");
    if (!trimmedPhone) {
      setError("Утасны дугаараа оруулна уу.");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError("PIN 6 оронтой тоо байна.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PIN таарахгүй байна.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/payment-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: trimmedPhone,
        pin,
        confirmPin,
        notePhone: notePhone.trim() || trimmedPhone,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Алдаа гарлаа. Дахин оролдоно уу.");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push(data.redirect ?? "/login?paid=1");
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-50)]">
        <AppHeader />
        <main className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg font-semibold text-[var(--color-joyfit-primary)] text-center">
            Хүсэлт амжилттай илгээгдлээ.
          </p>
          <p className="text-sm text-[var(--color-gray-600)] mt-2 text-center">
            Админ баталгаажуулсны дараа бүх функцүүд нээгдэнэ.
          </p>
          <p className="text-xs text-[var(--color-gray-500)] mt-4">
            Нэвтрэх хуудас руу шилжиж байна...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-[var(--color-charcoal)] mb-2">
          Төлбөр
        </h1>
        <p className="text-sm text-[var(--color-gray-600)] mb-6">
          Хөтөлбөрт нэгдэхийн тулд доорх данс руу шилжүүлж, гүйлгээний утгад
          утасны дугаараа бичнэ үү.
        </p>
        {emailFromCheckup && (
          <p className="text-xs text-[var(--color-gray-500)] mb-4">
            И-мэйл: {emailFromCheckup}
          </p>
        )}

        <div className="step-card mb-6">
          <p className="text-[var(--color-gray-600)] line-through text-lg">
            149,000₮
          </p>
          <p className="text-2xl font-bold text-[var(--color-joyfit-primary)]">
            89,000₮
          </p>
          <p className="text-sm text-[var(--color-gray-500)] mt-1">
            Зөвлөмжөөр бүртгүүлсэн үнэ
          </p>
        </div>

        <div className="step-card mb-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-[var(--color-charcoal-soft)] mb-1">
            Банкны мэдээлэл
          </p>
          <p className="text-[var(--color-charcoal)]">Банк: ... (статик)</p>
          <p className="text-[var(--color-charcoal)]">Данс: ... (статик)</p>
          <p className="text-[var(--color-charcoal)]">Хүлээн авагч: JOYFIT</p>
          <p className="text-sm text-[var(--color-gray-600)] mt-2">
            Гүйлгээний утга: утасны дугаараа бичнэ үү.
          </p>
        </div>

        <div className="step-card mb-6 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
          <p className="text-sm font-semibold text-[var(--color-joyfit-primary)] mb-3">
            <span className="text-base" aria-hidden>🟢</span> ТӨЛБӨРИЙН ЗААВАР
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--color-charcoal-soft)] mb-4">
            <li>Доорх данс руу 89,000₮ шилжүүлнэ.</li>
            <li>
              Гүйлгээний &quot;Утга/Тайлбар&quot; хэсэгт өөрийн УТАСНЫ ДУГААР-аа заавал бичнэ.
            </li>
            <li>
              Дараа нь энэ хуудсан дээр &quot;Төлбөр хийсэн&quot; товчийг дарж баталгаажуулалтын хүсэлтээ илгээнэ.
            </li>
          </ol>
          <p className="text-sm font-semibold text-[var(--color-charcoal-soft)] mb-2">
            <span aria-hidden>⏳</span> БАТАЛГААЖУУЛАЛТ ХЭРХЭН ЯВДАГ ВЭ?
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-gray-600)] mb-3">
            <li>Таны илгээсэн хүсэлтийг админ гараар шалгаж баталгаажуулна.</li>
            <li>
              Баталгаажуулсны дараа таны аккаунт &quot;Идэвхтэй&quot; болж: Самбар (Dashboard), Жингийн бүртгэл, Өдрийн тэмдэглэл, Leaderboard / Одны систем зэрэг бүх функцүүд нээгдэнэ.
            </li>
          </ul>
          <p className="text-sm text-[var(--color-gray-600)] mb-2">
            <span aria-hidden>⏱</span> <strong>Хугацаа:</strong> Ихэнхдээ 5–30 минутын дотор (ачааллаас хамаарч өөрчлөгдөж болно).
          </p>
          <p className="text-xs text-amber-700 mt-3">
            <span aria-hidden>⚠️</span> <strong>Анхаар:</strong> Утга дээр утасны дугаар бичээгүй бол баталгаажуулалт удааширна. PIN бол таны 6 оронтой нэвтрэх код — хэнд ч бүү өг.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="phone">
              Утасны дугаар (заавал)
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              className={`input-field ${error ? "error" : ""}`}
              placeholder="80123456"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (!notePhone) setNotePhone(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="label" htmlFor="pin">
              6 оронтой PIN үүсгэх (заавал)
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              className={`input-field ${error ? "error" : ""}`}
              placeholder="******"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <div>
            <label className="label" htmlFor="confirmPin">
              PIN баталгаажуулах
            </label>
            <input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              className={`input-field ${error ? "error" : ""}`}
              placeholder="******"
              value={confirmPin}
              onChange={(e) =>
                setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="notePhone">
              Гүйлгээний утга дээр бичсэн дугаар
            </label>
            <input
              id="notePhone"
              type="tel"
              inputMode="numeric"
              className="input-field"
              placeholder="80123456"
              value={notePhone}
              onChange={(e) => setNotePhone(e.target.value)}
            />
            <p className="text-xs text-[var(--color-gray-500)] mt-1">
              Ихэвчлэн утасны дугаартай ижил байна.
            </p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Илгээж байна..." : "Төлбөр хийсэн"}
          </button>
        </form>

        <p className="text-xs text-[var(--color-gray-500)] mt-6 text-center">
          Төлбөр хийсний дараа шалгагдаж батлагдана. Утас + PIN-ээр нэвтэрнэ.
        </p>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-gray-50)] flex items-center justify-center">
          <p className="text-[var(--color-gray-600)]">Ачаалж байна...</p>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
