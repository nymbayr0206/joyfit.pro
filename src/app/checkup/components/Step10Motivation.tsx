"use client";

import { STEP_10_OPTIONS } from "@/types/lead";
import type { CheckupPayload, Motivation } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step10Motivation({ payload, update, onBack, onNext }: Props) {
  const value = payload.motivation;

  return (
    <StepLayout
      step={10}
      title="Та ямар зорилгод бэлдэж байна вэ?"
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_10_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => update({ motivation: opt.value as Motivation })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onNext} className="btn-primary w-full mt-6">
        Үргэлжлүүлэх
      </button>
      <button type="button" onClick={onBack} className="btn-outline w-full mt-3">
        Буцах
      </button>
    </StepLayout>
  );
}
