"use client";

import { STEP_8_OPTIONS } from "@/types/lead";
import type { CheckupPayload, Commitment } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step8Commitment({ payload, update, onBack, onNext }: Props) {
  const value = payload.commitment;
  const isNo = value === "no";

  return (
    <StepLayout
      step={8}
      title="Та 7 хоног бүр жингээ оруулах амлалт өгөх үү?"
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_8_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => update({ commitment: opt.value as Commitment })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {isNo && (
        <p className="mt-4 text-sm text-[var(--color-gray-600)] italic">
          Амлалт өгсөн хүмүүс илүү тогтвортой байдаг.
        </p>
      )}
      <button type="button" onClick={onNext} className="btn-primary w-full mt-6">
        Үргэлжлүүлэх
      </button>
      <button type="button" onClick={onBack} className="btn-outline w-full mt-3">
        Буцах
      </button>
    </StepLayout>
  );
}
