"use client";

import { STEP_4_OPTIONS } from "@/types/lead";
import type { CheckupPayload, CommunityPreference } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  onBack: () => void;
  onNext: () => void;
  leaderboardPreview?: { name: string; change: string }[];
}

const defaultLeaderboard = [
  { name: "Сарнай", change: "-1.2 кг" },
  { name: "Оюуна", change: "-0.8 кг" },
  { name: "Нарантуяа", change: "-1.0 кг" },
];

export function Step4CommunityPreference({
  payload,
  update,
  onBack,
  onNext,
  leaderboardPreview = defaultLeaderboard,
}: Props) {
  const value = payload.community_preference;

  return (
    <StepLayout
      step={4}
      title="Та ганцаараа эсвэл багийн дэмжлэгтэй хасахыг илүүд үзэх вэ?"
      onBack={onBack}
    >
      <div className="space-y-2">
        {STEP_4_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => update({ community_preference: opt.value as CommunityPreference })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-[var(--color-gray-50)] border border-gray-200">
        <p className="text-sm font-medium text-[var(--color-charcoal-soft)] mb-2">
          Leaderboard (жишээ)
        </p>
        <ul className="space-y-1.5">
          {leaderboardPreview.map((u, i) => (
            <li
              key={i}
              className="flex justify-between text-sm text-[var(--color-charcoal)]"
            >
              <span>{u.name}</span>
              <span className="text-[var(--color-joyfit-primary)] font-medium">
                {u.change}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="btn-primary w-full mt-6"
      >
        Үргэлжлүүлэх
      </button>
      <button type="button" onClick={onBack} className="btn-outline w-full mt-3">
        Буцах
      </button>
    </StepLayout>
  );
}
