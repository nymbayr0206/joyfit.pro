"use client";

import { useState } from "react";
import type { CheckupPayload } from "@/types/lead";
import { StepLayout } from "./StepLayout";
import { getStoredPayload, setStoredPayload } from "../CheckupStorage";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmitLead: (p: Partial<CheckupPayload>) => Promise<{ ok: boolean; error?: string; leadId?: string }>;
}

export function Step11Email({
  payload,
  update,
  onBack,
  onNext,
  onSubmitLead,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fullPayload = { ...getStoredPayload(), ...payload };
    const res = await onSubmitLead(fullPayload);
    setLoading(false);
    if (res.ok) {
      setStoredPayload(fullPayload);
      if (typeof window !== "undefined") {
        if (res.leadId) localStorage.setItem("joyfit_last_lead_id", res.leadId);
        window.dispatchEvent(new CustomEvent("joyfit:onboarding:step", { detail: { step: 11 } }));
      }
      onNext();
    } else {
      setError(res.error ?? "Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleSkip = async () => {
    const fullPayload = { ...getStoredPayload(), ...payload };
    const res = await onSubmitLead(fullPayload);
    if (res.ok) {
      setStoredPayload(fullPayload);
      if (typeof window !== "undefined" && res.leadId) {
        localStorage.setItem("joyfit_last_lead_id", res.leadId);
      }
    }
    onNext();
  };

  return (
    <StepLayout
      step={11}
      title="Имэйл (заавал биш)"
      helper="7 хоногийн жишиг төлөвлөгөөг имэйлээр авахыг хүсвэл оруулна уу."
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Имэйл
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="name@example.com"
            value={payload.email ?? ""}
            onChange={(e) => update({ email: e.target.value || undefined })}
          />
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={payload.consent ?? false}
            onChange={(e) => update({ consent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-[var(--color-joyfit-primary)]"
          />
          <span className="text-sm text-[var(--color-gray-600)]">
            Зөвлөмж, санал болголт авахыг зөвшөөрч байна.
          </span>
        </label>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          className="btn-primary w-full mt-6"
          disabled={loading}
        >
          {loading ? "Илгээж байна..." : "7 хоногийн жишиг төлөвлөгөөг авах"}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="btn-outline w-full mt-3"
          disabled={loading}
        >
          Алгасах
        </button>
        <button
          type="button"
          onClick={onBack}
          className="btn-outline w-full mt-3"
          disabled={loading}
        >
          Буцах
        </button>
      </form>
    </StepLayout>
  );
}
