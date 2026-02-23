"use client";

import { useCallback, useEffect, useState } from "react";
import type { CheckupPayload } from "@/types/lead";
import { getStoredPayload, setStoredPayload } from "./CheckupStorage";
import { Step1BodyBasics } from "./components/Step1BodyBasics";
import { Step2EmotionalGap } from "./components/Step2EmotionalGap";
import { Step3PastAttempts } from "./components/Step3PastAttempts";
import { Step4CommunityPreference } from "./components/Step4CommunityPreference";
import { Step5RewardBuyIn } from "./components/Step5RewardBuyIn";
import { Step6MealsPerDay } from "./components/Step6MealsPerDay";
import { Step7ActivityLevel } from "./components/Step7ActivityLevel";
import { Step8Commitment } from "./components/Step8Commitment";
import { Step9Timeline } from "./components/Step9Timeline";
import { Step10Motivation } from "./components/Step10Motivation";
import { Step11Email } from "./components/Step11Email";
import { Step12Summary } from "./components/Step12Summary";
import { AppHeader } from "@/components/AppHeader";

const TOTAL_STEPS = 12;

function validateStep1(p: Partial<CheckupPayload>): Record<string, string> {
  const err: Record<string, string> = {};
  const c = p.current_weight_kg;
  const g = p.goal_weight_kg;
  const a = p.age;
  if (c == null || c < 30 || c > 250) {
    err.current_weight_kg = "Одоогийн жинг 30–250 кг хооронд оруулна уу.";
  }
  if (g == null || g < 30 || g > 250) {
    err.goal_weight_kg = "Зорилтот жинг 30–250 кг хооронд оруулна уу.";
  }
  if (typeof c === "number" && typeof g === "number" && g >= c) {
    err.goal_weight_kg = "Зорилтот жин одоогийн жингээс бага байх ёстой.";
  }
  if (a == null || a < 13 || a > 80) {
    err.age = "Насыг 13–80 хооронд оруулна уу.";
  }
  if (!p.gender) {
    err.gender = "Хүйсээ сонгоно уу.";
  }
  return err;
}

function validateStep6(p: Partial<CheckupPayload>): Record<string, string> {
  const err: Record<string, string> = {};
  const m = p.meals_per_day;
  if (m == null || m < 1 || m > 8) {
    err.meals_per_day = "1–8 хооронд сонгоно уу.";
  }
  return err;
}

async function submitLead(payload: Partial<CheckupPayload>) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Алдаа" };
  return { ok: Boolean(data.ok), error: data.error, leadId: data.leadId ?? data.id };
}

const STEP_STORAGE_KEY = "joyfit_checkup_step";

function getStoredStep(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(STEP_STORAGE_KEY);
    if (raw == null) return 1;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 && n <= TOTAL_STEPS ? n : 1;
  } catch {
    return 1;
  }
}

function setStoredStep(s: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STEP_STORAGE_KEY, String(s));
  } catch {
    // ignore
  }
}

export default function CheckupWizardClient() {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Partial<CheckupPayload>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setPayload(getStoredPayload());
    setStep(getStoredStep());
  }, []);

  const persistStep = useCallback((s: number) => {
    setStoredStep(s);
  }, []);

  const update = useCallback((p: Partial<CheckupPayload>) => {
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

  const handleStep1Next = useCallback(() => {
    const err = validateStep1(payload);
    setErrors(err);
    if (Object.keys(err).length === 0) goNext();
  }, [payload, goNext]);

  const handleStep6Next = useCallback(() => {
    const err = validateStep6(payload);
    setErrors(err);
    if (Object.keys(err).length === 0) goNext();
  }, [payload, goNext]);

  if (typeof window !== "undefined" && step) {
    window.dispatchEvent(
      new CustomEvent("joyfit:onboarding:step", { detail: { step } })
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)]">
      <AppHeader />

      {step === 1 && (
        <Step1BodyBasics
          payload={payload}
          update={update}
          errors={errors}
          onBack={step > 1 ? goBack : undefined}
          onNext={handleStep1Next}
        />
      )}
      {step === 2 && (
        <Step2EmotionalGap
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 3 && (
        <Step3PastAttempts
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 4 && (
        <Step4CommunityPreference
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 5 && (
        <Step5RewardBuyIn
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 6 && (
        <Step6MealsPerDay
          payload={payload}
          update={update}
          errors={errors}
          onBack={goBack}
          onNext={handleStep6Next}
        />
      )}
      {step === 7 && (
        <Step7ActivityLevel
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 8 && (
        <Step8Commitment
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 9 && (
        <Step9Timeline
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 10 && (
        <Step10Motivation
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 11 && (
        <Step11Email
          payload={payload}
          update={update}
          onBack={goBack}
          onNext={goNext}
          onSubmitLead={submitLead}
        />
      )}
      {step === 12 && (
        <Step12Summary payload={payload} onBack={goBack} />
      )}
    </div>
  );
}
