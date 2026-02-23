"use client";

import { STEP_9_OPTIONS } from "@/types/lead";
import type { CheckupPayload } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step9Timeline({ payload, update, onBack, onNext }: Props) {
  const value = payload.timeline_weeks;

  return (
    <StepLayout
      step={9}
      title="Та хэдэн долоо хоногийн дотор зорилгодоо хүрэхийг хүсэж байна вэ?"
      onBack={onBack}
    >
      <div className="grid grid-cols-3 gap-3">
        {STEP_9_OPTIONS.map((weeks) => (
          <button
            key={weeks}
            type="button"
            className={`py-4 rounded-xl font-medium transition-all border-2 ${
              value === weeks
                ? "border-[var(--color-joyfit-primary)] bg-[var(--color-joyfit-primary-light)]"
                : "border-gray-200 hover:border-[var(--color-joyfit-primary)]"
            }`}
            onClick={() => update({ timeline_weeks: weeks })}
          >
            {weeks} долоо хоног
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
