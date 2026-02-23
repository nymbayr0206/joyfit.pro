"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";

const LEGACY_TOTAL_STEPS = 2;
const LEGACY_STEP_LABEL = (s: number) => `Алхам ${s} / ${LEGACY_TOTAL_STEPS}`;

export default function LegacyRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader />

      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="w-full mb-4">
          <p className="text-sm font-medium text-[var(--color-gray-600)] mb-1">
            {LEGACY_STEP_LABEL(step)}
          </p>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${(step / LEGACY_TOTAL_STEPS) * 100}%`,
                backgroundColor: "var(--color-joyfit-primary)",
              }}
            />
          </div>
        </div>

        {step === 1 && (
          <>
            <h1 className="text-xl font-bold text-[var(--color-charcoal)] mt-6">
              Хуучин бүртгэл – Алхам 1
            </h1>
            <p className="text-sm text-[var(--color-gray-600)] mt-1">
              Нэр болон имэйлээ оруулна уу.
            </p>
            <div className="mt-6 step-card space-y-4">
              <div>
                <label className="label" htmlFor="legacy_name">
                  Нэр
                </label>
                <input
                  id="legacy_name"
                  type="text"
                  className="input-field"
                  placeholder="Нэрээ оруулна уу"
                />
              </div>
              <div>
                <label className="label" htmlFor="legacy_email">
                  Имэйл
                </label>
                <input
                  id="legacy_email"
                  type="email"
                  className="input-field"
                  placeholder="name@example.com"
                />
              </div>
              <button
                type="button"
                className="btn-primary w-full mt-6"
                onClick={() => setStep(2)}
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-xl font-bold text-[var(--color-charcoal)] mt-6">
              Хуучин бүртгэл – Алхам 2
            </h1>
            <p className="text-sm text-[var(--color-gray-600)] mt-1">
              Бүртгэл дууслаа.
            </p>
            <div className="mt-6 step-card space-y-4">
              <p className="text-[var(--color-gray-600)]">
                Та шинэ 12 алхамын шалгалт руу шилжихийг хүсвэл{" "}
                <a href="/checkup" className="text-[var(--color-joyfit-primary)] font-medium">
                  /checkup
                </a>{" "}
                руу орно уу.
              </p>
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => setStep(1)}
              >
                Буцах
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
