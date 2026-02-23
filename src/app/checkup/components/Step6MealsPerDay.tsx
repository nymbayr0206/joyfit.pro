"use client";

import type { CheckupPayload } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onNext: () => void;
}

const MEALS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function Step6MealsPerDay({ payload, update, errors, onBack, onNext }: Props) {
  const value = payload.meals_per_day;

  return (
    <StepLayout
      step={6}
      title="Өдөрт хэдэн удаа хооллох вэ?"
      helper="1–8 хооронд сонгоно уу."
      onBack={onBack}
    >
      <div className="flex flex-wrap gap-2">
        {MEALS.map((n) => (
          <button
            key={n}
            type="button"
            className={`min-w-[3rem] py-3 px-4 rounded-xl font-medium transition-all border-2 ${
              value === n
                ? "border-[var(--color-joyfit-primary)] bg-[var(--color-joyfit-primary-light)]"
                : "border-gray-200 hover:border-[var(--color-joyfit-primary)]"
            }`}
            onClick={() => update({ meals_per_day: n })}
          >
            {n}
          </button>
        ))}
      </div>
      {errors.meals_per_day && (
        <p className="mt-2 text-sm text-red-600">{errors.meals_per_day}</p>
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
