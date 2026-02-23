"use client";

import { STEP_2_OPTIONS } from "@/types/lead";
import type { CheckupPayload, EmotionalGap } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2EmotionalGap({ payload, update, onBack, onNext }: Props) {
  const value = payload.emotional_gap;

  return (
    <StepLayout
      step={2}
      title="Та хамгийн сүүлд хэзээ өөрийн биедээ сэтгэл хангалуун байсан бэ?"
      onBack={onBack}
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-500">
          Энэ сэтгэл хангалуун байсан мөч таны зорилтыг илүү ойлгоход тусална.
        </p>
        <div className="space-y-3">
          {STEP_2_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                value === opt.value
                  ? "bg-emerald-50 border-emerald-500 text-gray-900 scale-[1.02] shadow-sm"
                  : "bg-white border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
              onClick={() => {
                update({ emotional_gap: opt.value as EmotionalGap });
                setTimeout(onNext, 300);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full border-2 border-gray-300 text-gray-800 font-medium rounded-xl py-4 hover:bg-gray-50 transition-all duration-200"
        >
          Буцах
        </button>
      </div>
    </StepLayout>
  );
}
