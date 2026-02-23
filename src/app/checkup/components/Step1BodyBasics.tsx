"use client";

import type { CheckupPayload, Gender } from "@/types/lead";
import { StepLayout } from "./StepLayout";

interface Props {
  payload: Partial<CheckupPayload>;
  update: (p: Partial<CheckupPayload>) => void;
  errors: Record<string, string>;
  onBack?: () => void;
  onNext: () => void;
}

export function Step1BodyBasics({ payload, update, errors, onBack, onNext }: Props) {
  const current = payload.current_weight_kg ?? "";
  const goal = payload.goal_weight_kg ?? "";
  const age = payload.age ?? "";
  const gap =
    typeof payload.current_weight_kg === "number" &&
    typeof payload.goal_weight_kg === "number" &&
    payload.goal_weight_kg < payload.current_weight_kg
      ? payload.current_weight_kg - payload.goal_weight_kg
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <StepLayout
      step={1}
      title="Биеийн үндсэн мэдээлэл"
      helper="Одоогийн болон зорилтот жингээ оруулна уу."
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="current_weight_kg">
            Одоогийн жин (кг)
          </label>
          <input
            id="current_weight_kg"
            type="number"
            min={30}
            max={250}
            step={0.1}
            className={`input-field ${errors.current_weight_kg ? "error" : ""}`}
            placeholder="Жишээ: 75"
            value={current}
            onChange={(e) =>
              update({
                current_weight_kg: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          {errors.current_weight_kg && (
            <p className="mt-1 text-sm text-red-600">{errors.current_weight_kg}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="goal_weight_kg">
            Зорилтот жин (кг)
          </label>
          <input
            id="goal_weight_kg"
            type="number"
            min={30}
            max={250}
            step={0.1}
            className={`input-field ${errors.goal_weight_kg ? "error" : ""}`}
            placeholder="Жишээ: 65"
            value={goal}
            onChange={(e) =>
              update({
                goal_weight_kg: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          {errors.goal_weight_kg && (
            <p className="mt-1 text-sm text-red-600">{errors.goal_weight_kg}</p>
          )}
        </div>
        {gap !== null && gap > 0 && (
          <p className="text-sm text-[var(--color-joyfit-primary)] font-medium">
            Зорилтын зөрүү: {gap.toFixed(1)} кг хасах
          </p>
        )}
        <div>
          <label className="label" htmlFor="age">
            Нас
          </label>
          <input
            id="age"
            type="number"
            min={13}
            max={80}
            className={`input-field ${errors.age ? "error" : ""}`}
            placeholder="Жишээ: 28"
            value={age}
            onChange={(e) =>
              update({ age: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
          )}
        </div>
        <div>
          <span className="label">Хүйс</span>
          <div className="flex gap-3 mt-2">
            {(["male", "female"] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={(payload.gender as Gender) === g}
                  onChange={() => update({ gender: g })}
                  className="w-4 h-4 text-[var(--color-joyfit-primary)]"
                />
                <span>{g === "male" ? "Эрэгтэй" : "Эмэгтэй"}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full mt-6">
          Үргэлжлүүлэх
        </button>
      </form>
    </StepLayout>
  );
}
