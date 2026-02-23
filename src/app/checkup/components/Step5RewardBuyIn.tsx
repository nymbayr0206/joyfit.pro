"use client";

import { STEP_5_OPTIONS } from "@/types/lead";
import type { CheckupPayload, RewardBuyIn } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step5RewardBuyIn({ payload, update, onBack, onNext }: Props) {
  const value = payload.reward_buy_in;

  return (
    <StepLayout
      step={5}
      title="Урамшуулалтай систем танд илүү тохирох уу?"
      helper="Stars: Bronze -0.5кг/7 хоног, Silver -1.0кг/7 хоног, Gold -2.0кг/7 хоног. Найзаа урихад Gold зөвхөн найз төлбөр төлсний дараа олгоно."
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_5_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => update({ reward_buy_in: opt.value as RewardBuyIn })}
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
