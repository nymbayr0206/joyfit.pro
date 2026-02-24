"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Утасны дугаараа оруулна уу.");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError("PIN 6 оронтой тоо байх ёстой.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PIN таарахгүй байна.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          pin: pin.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Бүртгэлд алдаа гарлаа.");
        setLoading(false);
        return;
      }

      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (err) {
      setError("Бүртгэлд алдаа гарлаа.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold text-[var(--color-charcoal)] mb-1">
        Бүртгүүлэх
      </h1>
      <p className="text-sm text-[var(--color-gray-600)] mb-6">
        JOYFIT-д нэгдэхийн тулд мэдээллээ оруулна уу
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="phone">
            Утасны дугаар *
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            className="input-field"
            placeholder="80123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="name">
            Нэр
          </label>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="Таны нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Имэйл
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="pin">
            PIN (6 орон) *
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
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="confirmPin">
            PIN баталгаажуулах *
          </label>
          <input
            id="confirmPin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            className="input-field"
            placeholder="******"
            value={confirmPin}
            onChange={(e) =>
              setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
        </button>
      </form>

      <p className="text-xs text-[var(--color-gray-500)] mt-6 text-center">
        Аль хэдийн бүртгэлтэй юу? <a href="/login" className="text-[var(--color-joyfit-primary)] underline">Нэвтрэх</a>
      </p>
    </>
  );
}
