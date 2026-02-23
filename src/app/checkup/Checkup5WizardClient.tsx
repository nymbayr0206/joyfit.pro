"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Checkup5Payload } from "@/types/checkup5";
import {
  ACTIVITY_OPTIONS,
  type ActivityLevelOption,
  type GenderOption,
} from "@/types/checkup5";
import {
  getStoredPayload,
  setStoredPayload,
  getStoredStep,
  setStoredStep,
  clearCheckup5Storage,
} from "./Checkup5Storage";
import { AppHeader } from "@/components/AppHeader";

const TOTAL_STEPS = 4;

function ProgressBar({ current }: { current: number }) {
  const pct = (current / TOTAL_STEPS) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-[var(--color-joyfit-primary)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Checkup5WizardClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Partial<Checkup5Payload>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setPayload(getStoredPayload());
    setStep(getStoredStep());
  }, []);

  const persistStep = useCallback((s: number) => {
    setStoredStep(s);
  }, []);

  const update = useCallback((p: Partial<Checkup5Payload>) => {
    setPayload((prev) => {
      const next = { ...prev, ...p };
      setStoredPayload(next);
      return next;
    });
    setErrors({});
  }, []);

  const goNext = useCallback(() => {
    setErrors({});
    setStep((s) => {
      const next = Math.min(s + 1, TOTAL_STEPS);
      persistStep(next);
      return next;
    });
  }, [persistStep]);

  const goBack = useCallback(() => {
    setErrors({});
    setStep((s) => {
      const next = Math.max(s - 1, 1);
      persistStep(next);
      return next;
    });
  }, [persistStep]);

  // Step 1 validation
  const validateStep1 = useCallback((): boolean => {
    const err: Record<string, string> = {};
    const c = payload.currentWeightKg;
    const g = payload.goalWeightKg;
    if (c == null || c < 30 || c > 250) {
      err.currentWeightKg = "Одоогийн жинг 30–250 кг хооронд оруулна уу.";
    }
    if (g == null || g < 30 || g > 250) {
      err.goalWeightKg = "Зорилтот жинг 30–250 кг хооронд оруулна уу.";
    }
    if (
      typeof c === "number" &&
      typeof g === "number" &&
      g >= c
    ) {
      err.goalWeightKg = "Зорилтот жин одоогийн жингээс бага байх ёстой.";
    }
    const h = payload.heightCm;
    if (h == null || h < 80 || h > 230) {
      err.heightCm = "Өндөр (см) заавал. 80–230 хооронд зөв оруулна уу.";
    }
    const a = payload.age;
    if (a != null && (typeof a !== "number" || !Number.isInteger(a) || a < 1)) {
      err.age = "Нас зөв оруулна уу.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [payload]);

  // Step 2: priorCommunityProgram required
  const validateStep2 = useCallback((): boolean => {
    if (payload.priorCommunityProgram === undefined) {
      setErrors({ priorCommunityProgram: "Сонголтоо хийнэ үү." });
      return false;
    }
    setErrors({});
    return true;
  }, [payload.priorCommunityProgram]);

  // Step 3: priorRewardSystem required
  const validateStep3 = useCallback((): boolean => {
    if (payload.priorRewardSystem === undefined) {
      setErrors({ priorRewardSystem: "Сонголтоо хийнэ үү." });
      return false;
    }
    setErrors({});
    return true;
  }, [payload.priorRewardSystem]);

  // Step 4: mealsPerDay 1-8, activityLevel required
  const validateStep4 = useCallback((): boolean => {
    const err: Record<string, string> = {};
    const m = payload.mealsPerDay;
    if (m == null || m < 1 || m > 8) {
      err.mealsPerDay = "Өдөрт 1–8 хооронд идэх тоог сонгоно уу.";
    }
    if (!payload.activityLevel) {
      err.activityLevel = "Идэвхжилтийн түвшинг сонгоно уу.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [payload.mealsPerDay, payload.activityLevel]);

  const goToPayment = useCallback(() => {
    if (!validateStep4()) return;
    clearCheckup5Storage();
    router.push("/payment");
  }, [router, validateStep4]);

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader />
      <main className="max-w-lg mx-auto px-4 py-6">
        <p className="text-sm text-[var(--color-gray-600)] mb-2">
          Алхам {step} / {TOTAL_STEPS}
        </p>
        <ProgressBar current={step} />

        {/* Step 1 – Body */}
        {step === 1 && (
          <div className="step-card mt-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-charcoal)]">
              Биеийн үндсэн мэдээлэл
            </h2>
            <div>
              <label className="label" htmlFor="currentWeight">
                Одоогийн жин (кг) *
              </label>
              <input
                id="currentWeight"
                type="number"
                min={30}
                max={250}
                step={0.1}
                className={`input-field ${errors.currentWeightKg ? "error" : ""}`}
                placeholder="72"
                value={payload.currentWeightKg ?? ""}
                onChange={(e) =>
                  update({
                    currentWeightKg: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
              {errors.currentWeightKg && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.currentWeightKg}
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="goalWeight">
                Зорилтот жин (кг) *
              </label>
              <input
                id="goalWeight"
                type="number"
                min={30}
                max={250}
                step={0.1}
                className={`input-field ${errors.goalWeightKg ? "error" : ""}`}
                placeholder="65"
                value={payload.goalWeightKg ?? ""}
                onChange={(e) =>
                  update({
                    goalWeightKg: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
              {errors.goalWeightKg && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.goalWeightKg}
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="heightCm">
                Өндөр (см) *
              </label>
              <input
                id="heightCm"
                type="number"
                min={80}
                max={230}
                step={1}
                className={`input-field ${errors.heightCm ? "error" : ""}`}
                placeholder="Жишээ: 165"
                value={payload.heightCm ?? ""}
                onChange={(e) =>
                  update({
                    heightCm: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
              />
              <p className="text-xs text-[var(--color-gray-500)] mt-1">
                Хооллолтын суурь тооцоололд хэрэгтэй.
              </p>
              {errors.heightCm && (
                <p className="text-sm text-red-600 mt-1">{errors.heightCm}</p>
              )}
            </div>
            <div>
              <label className="label">Хүйс (заавал биш)</label>
              <div className="flex gap-2 flex-wrap">
                {(["male", "female", "other"] as GenderOption[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`option-btn flex-1 min-w-0 ${
                      payload.gender === g ? "selected" : ""
                    }`}
                    onClick={() => update({ gender: g })}
                  >
                    {g === "male" ? "Эрэгтэй" : g === "female" ? "Эмэгтэй" : "Бусад"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="age">
                Нас (заавал биш)
              </label>
              <input
                id="age"
                type="number"
                min={1}
                step={1}
                className={`input-field ${errors.age ? "error" : ""}`}
                placeholder="30"
                value={payload.age ?? ""}
                onChange={(e) =>
                  update({
                    age: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
              />
              {errors.age && (
                <p className="text-sm text-red-600 mt-1">{errors.age}</p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  if (validateStep1()) goNext();
                }}
              >
                Дараах
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Community */}
        {step === 2 && (
          <div className="step-card mt-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-charcoal)]">
              Өмнө нь ижил төстэй хөтөлбөрт оролдсон уу?
            </h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={`option-btn ${payload.priorCommunityProgram === true ? "selected" : ""}`}
                onClick={() => update({ priorCommunityProgram: true })}
              >
                Тийм
              </button>
              <button
                type="button"
                className={`option-btn ${payload.priorCommunityProgram === false ? "selected" : ""}`}
                onClick={() => update({ priorCommunityProgram: false })}
              >
                Үгүй
              </button>
            </div>
            {errors.priorCommunityProgram && (
              <p className="text-sm text-red-600">{errors.priorCommunityProgram}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-outline" onClick={goBack}>
                Буцах
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  if (validateStep2()) goNext();
                }}
              >
                Дараах
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Rewards */}
        {step === 3 && (
          <div className="step-card mt-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-charcoal)]">
              Одны урамшуулал
            </h2>
            <p className="text-sm text-[var(--color-gray-600)]">
              Жин хасснаараа од цуглуулна: хүрэл (0.5 кг+), мөнгө (1 кг+), алт (2
              кг+). Өмнө нь ийм урамшуулалтай тоглож байсан уу?
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={`option-btn ${payload.priorRewardSystem === true ? "selected" : ""}`}
                onClick={() => update({ priorRewardSystem: true })}
              >
                Тийм
              </button>
              <button
                type="button"
                className={`option-btn ${payload.priorRewardSystem === false ? "selected" : ""}`}
                onClick={() => update({ priorRewardSystem: false })}
              >
                Үгүй
              </button>
            </div>
            {errors.priorRewardSystem && (
              <p className="text-sm text-red-600">{errors.priorRewardSystem}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-outline" onClick={goBack}>
                Буцах
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  if (validateStep3()) goNext();
                }}
              >
                Дараах
              </button>
            </div>
          </div>
        )}

        {/* Step 4 – Lifestyle */}
        {step === 4 && (
          <div className="step-card mt-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-charcoal)]">
              Өдөр тутмын амьдрал
            </h2>
            <div>
              <label className="label" htmlFor="mealsPerDay">
                Өдөрт хэдэн удаа идэх вэ? (1–8) *
              </label>
              <input
                id="mealsPerDay"
                type="number"
                min={1}
                max={8}
                className={`input-field ${errors.mealsPerDay ? "error" : ""}`}
                value={payload.mealsPerDay ?? ""}
                onChange={(e) =>
                  update({
                    mealsPerDay: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
              />
              {errors.mealsPerDay && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.mealsPerDay}
                </p>
              )}
            </div>
            <div>
              <label className="label">Идэвхжилтийн түвшин *</label>
              <div className="flex flex-col gap-2">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-btn text-left ${
                      payload.activityLevel === opt.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      update({ activityLevel: opt.value as ActivityLevelOption })
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.activityLevel && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.activityLevel}
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-outline" onClick={goBack}>
                Буцах
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={goToPayment}
              >
                Төлбөр рүү үргэлжлүүлэх
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
