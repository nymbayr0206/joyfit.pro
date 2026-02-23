"use client";

import { STEP_3_OPTIONS } from "@/types/lead";
import type { CheckupPayload, PastAttempts } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3PastAttempts({ payload, update, onBack, onNext }: Props) {
  const value = payload.past_attempts;

  return (
    <StepLayout
      step={3}
      title="Өмнө нь жин хасах гэж оролдож байсан уу?"
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_3_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => {
              update({ past_attempts: opt.value as PastAttempts });
              setTimeout(onNext, 300);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onBack} className="btn-outline w-full mt-6">
        Буцах
      </button>
    </StepLayout>
  );
}
