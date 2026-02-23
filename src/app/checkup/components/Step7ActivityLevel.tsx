"use client";

import { STEP_7_OPTIONS } from "@/types/lead";
import type { CheckupPayload, ActivityLevel } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step7ActivityLevel({ payload, update, onBack, onNext }: Props) {
  const value = payload.activity_level;

  return (
    <StepLayout
      step={7}
      title="Өдөр тутмын идэвх"
      helper="Таны хөдөлгөөний түвшинг сонгоно уу."
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_7_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() =>
              update({ activity_level: opt.value as ActivityLevel })
            }
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
